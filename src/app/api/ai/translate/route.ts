import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

// In-memory cache for fast instant response
const translationCache = new Map<string, string>();

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    const { text, texts, context } = await req.json();

    if (!text && (!texts || !Array.isArray(texts) || texts.length === 0)) {
      return NextResponse.json({ error: "Missing text or texts array" }, { status: 400 });
    }

    // Handle single text
    if (text && typeof text === "string") {
      const cacheKey = `mr:${text.trim()}`;
      if (translationCache.has(cacheKey)) {
        return NextResponse.json({ translation: translationCache.get(cacheKey), cached: true });
      }

      const promptContext = context ? `Context: ${context}\n` : "";
      const completion = await (groq.chat.completions.create as any)({
        model: "openai/gpt-oss-20b",
        messages: [
          {
            role: "system",
            content:
              "You are a master Marathi translator and travel historian specializing in Maharashtra, Konkan, and Sahyadri forts. Translate the provided text into natural, culturally rich, and engaging Marathi (शुद्ध, ओघवती आणि प्रमाण मराठी). Maintain all historical proper nouns, fort names, and figures accurately. Return ONLY the Marathi translation without explanations, quotes, or conversational preamble.",
          },
          {
            role: "user",
            content: `${promptContext}Translate this text into Marathi:\n\n${text}`,
          },
        ],
        temperature: 0.2,
        max_tokens: 2500,
        reasoning_effort: "low",
      });

      const translated = completion.choices[0]?.message?.content?.trim() || text;
      translationCache.set(cacheKey, translated);
      return NextResponse.json({ translation: translated, cached: false });
    }

    // Handle batch texts array
    if (Array.isArray(texts)) {
      const results: string[] = [];
      const missingIndices: number[] = [];
      const missingTexts: string[] = [];

      texts.forEach((t: string, idx: number) => {
        const cacheKey = `mr:${t.trim()}`;
        if (translationCache.has(cacheKey)) {
          results[idx] = translationCache.get(cacheKey)!;
        } else {
          missingIndices.push(idx);
          missingTexts.push(t);
        }
      });

      if (missingTexts.length > 0) {
        const batchPrompt = missingTexts
          .map((t, i) => `[ITEM ${i + 1}]\n${t}`)
          .join("\n\n---\n\n");

        const completion = await (groq.chat.completions.create as any)({
          model: "openai/gpt-oss-20b",
          messages: [
            {
              role: "system",
              content:
                "You are an expert Marathi translator for Maharashtra & Konkan tourism. Translate each numbered item into fluent, authentic, and culturally rich Marathi (शुद्ध आणि प्रमाण मराठी). Keep the exact same `[ITEM X]` markers so translations can be mapped back accurately. Return ONLY the translated items.",
            },
            {
              role: "user",
              content: `Translate these items to Marathi:\n\n${batchPrompt}`,
            },
          ],
          temperature: 0.2,
          max_tokens: 3500,
          reasoning_effort: "low",
        });

        const output = completion.choices[0]?.message?.content || "";
        const parts = output.split(/\[ITEM \d+\]/i).map((s: string) => s.trim()).filter(Boolean);

        missingIndices.forEach((origIdx, mIdx) => {
          const trans = parts[mIdx] || missingTexts[mIdx];
          results[origIdx] = trans;
          translationCache.set(`mr:${missingTexts[mIdx].trim()}`, trans);
        });
      }

      return NextResponse.json({ translations: results });
    }

    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  } catch (err: any) {
    console.error("Translation API error:", err);
    return NextResponse.json(
      { error: err.message || "Translation failed" },
      { status: 500 }
    );
  }
}
