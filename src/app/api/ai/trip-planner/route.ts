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

    // Use lean, focused prompt for itinerary generation to stay well under TPM rate limits (6,000 TPM)
    let systemPrompt = "";
    if (isItinerary) {
      systemPrompt = [
        ITINERARY_JSON_PROMPT,
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

    // Only include last 4 messages to save tokens and avoid TPM limit
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
      completion = await groq.chat.completions.create({
        model: "qwen/qwen3.8-27b",
        messages: groqMessages,
        temperature: isItinerary ? 0.3 : 0.7,
        max_tokens: 2000,
        response_format: responseFormat,
      });
    } catch (primaryErr) {
      console.warn("⚠️ Primary model qwen/qwen3.8-27b failed, falling back to openai/gpt-oss-20b:", primaryErr);
      try {
        completion = await groq.chat.completions.create({
          model: "openai/gpt-oss-20b",
          messages: groqMessages,
          temperature: isItinerary ? 0.3 : 0.7,
          max_tokens: 2000,
          response_format: responseFormat,
        });
      } catch (secErr) {
        console.warn("⚠️ Secondary model openai/gpt-oss-20b failed, falling back to openai/gpt-oss-120b:", secErr);
        completion = await groq.chat.completions.create({
          model: "openai/gpt-oss-120b",
          messages: groqMessages,
          temperature: isItinerary ? 0.3 : 0.7,
          max_tokens: 2000,
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
          return NextResponse.json({
            message: parsed.summary || "Here's your Konkan itinerary! 🌊",
            itinerary: parsed.data,
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
