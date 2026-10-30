import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import {
  KOKAN_SYSTEM_PROMPT,
  ITINERARY_JSON_PROMPT,
  detectItineraryIntent,
} from "@/lib/ai/tripPlanner";
import {
  getAllTrains,
  getAllRoads,
  formatTransportContext,
  KONKAN_DESTINATION_GATEWAYS,
  validateAndCorrectTransport,
} from "@/lib/ai/transportData";

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

    const { messages, pageContext } = await req.json();

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
        durationRule = "\n\nCRITICAL DURATION DIRECTIVE: The user requested 4+ DAYS. The 'days' array in your JSON output MUST contain EXACTLY 4 day objects: Day 1, Day 2, Day 3, and Day 4. Under NO circumstances stop at Day 2 or Day 3!";
      } else if (text.includes("3 day") || text.includes("3 days")) {
        durationRule = "\n\nCRITICAL DURATION DIRECTIVE: The user requested 3 DAYS. The 'days' array in your JSON output MUST contain EXACTLY 3 day objects: Day 1, Day 2, and Day 3. Under NO circumstances stop at Day 2!";
      } else if (text.includes("2 day") || text.includes("2 days") || text.includes("weekend")) {
        durationRule = "\n\nCRITICAL DURATION DIRECTIVE: The user requested 2 DAYS. The 'days' array in your JSON output MUST contain EXACTLY 2 day objects: Day 1 and Day 2.";
      } else if (text.includes("1 day") || text.includes("day trip") || text.includes("same day")) {
        durationRule = "\n\nCRITICAL DURATION DIRECTIVE: The user requested 1 DAY. The 'days' array in your JSON output MUST contain EXACTLY 1 day object: Day 1.";
      }
    }

    // Use lean, focused prompt for itinerary generation
    let systemPrompt = "";
    if (isItinerary) {
      systemPrompt = [
        ITINERARY_JSON_PROMPT,
        durationRule,
        KONKAN_DESTINATION_GATEWAYS,
        pageContext ? `CONTEXT: ${pageContext}` : "",
      ]
        .filter(Boolean)
        .join("\n\n");
    } else {
      let transportContext = "";
      try {
        const [trains, roads] = await Promise.all([
          getAllTrains(),
          getAllRoads(),
        ]);
        if (trains.length > 0 || roads.length > 0) {
          transportContext = formatTransportContext(trains, roads);
        }
      } catch (err) {
        console.error("⚠️ Could not fetch transport data:", err);
      }

      systemPrompt = [
        KOKAN_SYSTEM_PROMPT,
        transportContext,
        pageContext ? `CURRENT PAGE CONTEXT: ${pageContext}` : "",
      ]
        .filter(Boolean)
        .join("\n\n");
    }

    // Only include last 4 messages to save context tokens
    const trimmedMessages = messages.slice(-4);

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
      // Primary model: openai/gpt-oss-20b (high OTPM token limit, fast ~2s completion with low reasoning effort)
      completion = await (groq.chat.completions.create as any)({
        model: "openai/gpt-oss-20b",
        messages: groqMessages,
        temperature: isItinerary ? 0.2 : 0.7,
        max_tokens: 3500,
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
          max_tokens: 3500,
          reasoning_effort: "low",
          response_format: responseFormat,
        });
      } catch (secErr) {
        console.warn("⚠️ Secondary model openai/gpt-oss-120b failed, falling back to qwen/qwen3.8-27b:", secErr);
        completion = await groq.chat.completions.create({
          model: "qwen/qwen3.8-27b",
          messages: groqMessages,
          temperature: isItinerary ? 0.2 : 0.7,
          max_tokens: 1800,
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
        if (parsed.type === "itinerary" && parsed.data) {
          const sanitizedData = validateAndCorrectTransport(parsed.data, lastUserMessage?.content || "");
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
    const cleanText = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // If text looks like JSON, show friendly message instead
    if (cleanText.startsWith("{") || cleanText.startsWith("[")) {
      return NextResponse.json({
        message: "Here's your Konkan itinerary! 🌊 Tap below to view your full plan.",
        itinerary: null,
      });
    }

    return NextResponse.json({ message: cleanText });

  } catch (error: unknown) {
    console.error("❌ Groq error:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Unknown error" },
      { status: 500 }
    );
  }
}
