import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

// In-memory cache so identical text is translated once and served in 0ms
const translationCache = new Map<string, string>();

/**
 * Free dedicated translation engine (MyMemory API)
 * Does NOT consume any Groq API tokens or LLM credits!
 */
async function translateWithFreeEngine(text: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return "";

  // Split into chunks if longer than 400 chars to avoid URL length limits
  if (trimmed.length > 400) {
    const segments = trimmed.match(/[^.!?\n]+[.!?\n]+|\S+/g) || [trimmed];
    const results: string[] = [];
    let currentChunk = "";

    for (const segment of segments) {
      if ((currentChunk + " " + segment).length > 380) {
        if (currentChunk.trim()) {
          const trans = await fetchChunk(currentChunk.trim());
          results.push(trans);
        }
        currentChunk = segment;
      } else {
        currentChunk = currentChunk ? currentChunk + " " + segment : segment;
      }
    }

    if (currentChunk.trim()) {
      const trans = await fetchChunk(currentChunk.trim());
      results.push(trans);
    }

    return results.join(" ");
  }

  return await fetchChunk(trimmed);
}

async function fetchChunk(chunk: string): Promise<string> {
  const cacheKey = `mr:${chunk}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      chunk
    )}&langpair=en|mr`;

    const res = await fetch(url, {
      headers: { "User-Agent": "VisitKokanApp/1.0 (contact@visitkokan.in)" },
      next: { revalidate: 86400 }, // Cache on edge
    });

    if (res.ok) {
      const json = await res.json();
      const translated = json.responseData?.translatedText;
      if (translated && typeof translated === "string" && !translated.startsWith("MYMEMORY WARNING")) {
        translationCache.set(cacheKey, translated);
        return translated;
      }
    }
  } catch (err) {
    console.warn("Free translation engine failed for chunk:", err);
  }

  // Fallback to original chunk if service is unavailable
  return chunk;
}

export async function POST(req: NextRequest) {
  try {
    const { text, texts } = await req.json();

    if (!text && (!texts || !Array.isArray(texts) || texts.length === 0)) {
      return NextResponse.json({ error: "Missing text or texts array" }, { status: 400 });
    }

    // ── 1. Single Text Translation ──
    if (text && typeof text === "string") {
      const cacheKey = `mr:${text.trim()}`;
      if (translationCache.has(cacheKey)) {
        return NextResponse.json({
          translation: translationCache.get(cacheKey),
          source: "cache",
          creditsUsed: 0,
        });
      }

      // Translate using FREE engine (0 Groq credits)
      const translated = await translateWithFreeEngine(text);
      translationCache.set(cacheKey, translated);

      return NextResponse.json({
        translation: translated,
        source: "free-engine",
        creditsUsed: 0,
      });
    }

    // ── 2. Batch Texts Translation ──
    if (Array.isArray(texts)) {
      const results: string[] = [];

      for (let i = 0; i < texts.length; i++) {
        const item = texts[i];
        if (!item || typeof item !== "string") {
          results.push("");
          continue;
        }

        const cacheKey = `mr:${item.trim()}`;
        if (translationCache.has(cacheKey)) {
          results.push(translationCache.get(cacheKey)!);
        } else {
          const trans = await translateWithFreeEngine(item);
          translationCache.set(cacheKey, trans);
          results.push(trans);
        }
      }

      return NextResponse.json({
        translations: results,
        source: "free-engine",
        creditsUsed: 0,
      });
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
