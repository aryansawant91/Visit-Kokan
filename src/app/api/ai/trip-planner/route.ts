import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import {
  KOKAN_SYSTEM_PROMPT,
  ITINERARY_JSON_PROMPT,
  detectItineraryIntent,
} from "@/lib/ai/tripPlanner";
import {
  getRelevantTransportContext,
  validateAndCorrectTransport,
  sanitizeTrekText,
} from "@/lib/ai/transportData";
import { getWebsiteGroundingContext } from "@/lib/ai/kokanWebsiteData";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const { messages, pageContext, pathname } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid messages" },
        { status: 400 }
      );
    }

    const lastUserMessage = messages
      .filter((m: { role: string }) => m.role === "user")
      .pop();

    const isItinerary = lastUserMessage
      ? detectItineraryIntent(lastUserMessage.content)
      : false;

    // Detect explicit target day counts from the user's message
    let durationRule = "";
    if (isItinerary && lastUserMessage) {
      const text = lastUserMessage.content.toLowerCase();
      if (text.includes("4+ day") || text.includes("4 day") || text.includes("4 days")) {
        durationRule = "\n\nCRITICAL DURATION DIRECTIVE: The user requested 4+ DAYS. The 'days' array in your JSON output MUST contain EXACTLY 4 day objects: Day 1, Day 2, Day 3, and Day 4. Under NO circumstances stop at Day 2 or Day 3! Provide 3 concise stops per day so the JSON completes reliably.";
      } else if (text.includes("3 day") || text.includes("3 days")) {
        durationRule = "\n\nCRITICAL DURATION DIRECTIVE: The user requested 3 DAYS. The 'days' array in your JSON output MUST contain EXACTLY 3 day objects: Day 1, Day 2, and Day 3. Under NO circumstances stop at Day 2! Provide 3 concise stops per day so the JSON completes reliably.";
      } else if (text.includes("2 day") || text.includes("2 days") || text.includes("weekend")) {
        durationRule = "\n\nCRITICAL DURATION DIRECTIVE: The user requested 2 DAYS. The 'days' array in your JSON output MUST contain EXACTLY 2 day objects: Day 1 and Day 2.";
      } else if (text.includes("1 day") || text.includes("day trip") || text.includes("same day")) {
        durationRule = "\n\nCRITICAL DURATION DIRECTIVE: The user requested 1 DAY. The 'days' array in your JSON output MUST contain EXACTLY 1 day object: Day 1.";
      }
    }

    // Generate laser-focused platform knowledge (matching active trek or destination only)
    const websiteGrounding = getWebsiteGroundingContext(
      lastUserMessage?.content || "",
      pageContext,
      pathname
    );

    // Dynamic lean transit context (only 50-80 tokens matching the specific destination/trek)
    const transportContext = getRelevantTransportContext(
      lastUserMessage?.content || "",
      pageContext,
      pathname
    );

    let systemPrompt = "";
    if (isItinerary) {
      systemPrompt = [
        ITINERARY_JSON_PROMPT,
        durationRule,
        transportContext,
        websiteGrounding,
        pageContext ? `CURRENT PAGE CONTEXT: ${pageContext}` : "",
      ]
        .filter(Boolean)
        .join("\n\n");
    } else {
      systemPrompt = [
        KOKAN_SYSTEM_PROMPT,
        websiteGrounding,
        transportContext,
        pageContext ? `CURRENT PAGE CONTEXT: ${pageContext}` : "",
      ]
        .filter(Boolean)
        .join("\n\n");
    }

    // Include only last 2 messages to prevent token accumulation and eliminate TPM / ITPM 413 errors
    const trimmedMessages = messages.slice(-2);

    const groqMessages = [
      {
        role: "system" as const,
        content: systemPrompt,
      },
      ...trimmedMessages
        .filter((_: unknown, i: number) => {
          if (i === 0 && trimmedMessages[0].role === "assistant") return false;
          return true;
        })
        .map((msg: { role: string; content: string }) => ({
          role: msg.role === "assistant"
            ? ("assistant" as const)
            : ("user" as const),
          content: msg.content,
        })),
    ];

    const responseFormat = isItinerary ? { type: "json_object" as const } : undefined;

    let completion;
    try {
      // Primary model: openai/gpt-oss-20b (fast, concise, low reasoning overhead)
      completion = await (groq.chat.completions.create as any)({
        model: "openai/gpt-oss-20b",
        messages: groqMessages,
        temperature: isItinerary ? 0.2 : 0.7,
        max_tokens: isItinerary ? 2048 : 1200,
        reasoning_effort: "low",
        response_format: responseFormat,
      });
    } catch (primaryErr) {
      console.warn("⚠️ Primary model openai/gpt-oss-20b failed, falling back to openai/gpt-oss-120b:", primaryErr);
      try {
        completion = await (groq.chat.completions.create as any)({
          model: "openai/gpt-oss-120b",
          messages: groqMessages,
          temperature: isItinerary ? 0.2 : 0.7,
          max_tokens: isItinerary ? 2048 : 1200,
          reasoning_effort: "low",
          response_format: responseFormat,
        });
      } catch (secErr) {
        console.warn("⚠️ Secondary model openai/gpt-oss-120b failed, falling back to qwen/qwen3.8-27b:", secErr);
        completion = await groq.chat.completions.create({
          model: "qwen/qwen3.8-27b",
          messages: groqMessages,
          temperature: isItinerary ? 0.2 : 0.7,
          max_tokens: isItinerary ? 2048 : 1200,
          response_format: responseFormat,
        });
      }
    }

    const choice = completion.choices[0];
    const raw = choice?.message?.content || (choice?.message as unknown as { reasoning?: string })?.reasoning || "";

    // Always try to parse JSON first
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.type === "itinerary" || parsed.days || parsed.data?.days) {
          const itineraryObj = parsed.data || parsed;
          const sanitizedData = validateAndCorrectTransport(
            itineraryObj,
            `${pageContext || ""} ${pathname || ""} ${lastUserMessage?.content || ""}`
          );
          return NextResponse.json({
            message: parsed.summary || "Here's your Konkan itinerary! 🌊",
            itinerary: sanitizedData,
          });
        }
      }
    } catch {
      console.log("⚠️ JSON parse failed, returning as text");
    }

    // Clean up raw text if it contains JSON artifacts
    let cleanText = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Sanitize any potential hallucinations in conversational trek text
    cleanText = sanitizeTrekText(
      cleanText,
      `${pageContext || ""} ${pathname || ""} ${lastUserMessage?.content || ""}`
    );

    // If text looks like JSON, show friendly message instead
    if (cleanText.startsWith("{") || cleanText.startsWith("[")) {
      return NextResponse.json({
        message: "Here's your Konkan itinerary! 🌊 Tap below to view your full plan.",
        itinerary: null,
      });
    }

    return NextResponse.json({ message: cleanText });

  } catch (error: any) {
    console.error("❌ Groq error:", error);

    // Always provide a graceful, friendly Kokan concierge message so users never see raw JSON or technical errors
    return NextResponse.json({
      message: "🌊 Kokan Mitra is experiencing high demand right now! Please tap send again in a moment, or connect with our local team on WhatsApp (+91 84325 87706) for instant assistance.",
    });
  }
}
