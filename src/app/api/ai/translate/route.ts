import { NextRequest, NextResponse } from "next/server";

// In-memory cache so identical text is translated once and served in 0ms
const translationCache = new Map<string, string>();

function decodeEntities(str: string): string {
  if (!str) return "";
  return str
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

/**
 * Free dedicated translation engine (MyMemory API)
 * Does NOT consume any Groq API tokens or LLM credits!
 */
async function translateWithFreeEngine(text: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return "";

  // Split into sentences / smaller segments if longer than 250 chars
  if (trimmed.length > 250) {
    const rawSegments = trimmed.match(/[^.!?\n]+[.!?\n]+|\S+/g) || [trimmed];
    const segments: string[] = [];

    // Ensure no individual segment exceeds 250 chars
    for (const seg of rawSegments) {
      if (seg.length > 250) {
        // Subdivide by comma or spaces
        const words = seg.split(" ");
        let subChunk = "";
        for (const w of words) {
          if ((subChunk + " " + w).length > 230) {
            if (subChunk.trim()) segments.push(subChunk.trim());
            subChunk = w;
          } else {
            subChunk = subChunk ? subChunk + " " + w : w;
          }
        }
        if (subChunk.trim()) segments.push(subChunk.trim());
      } else {
        segments.push(seg);
      }
    }

    const results: string[] = [];
    let currentChunk = "";

    for (const segment of segments) {
      if ((currentChunk + " " + segment).length > 240) {
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
  const cleanChunk = chunk.trim();
  if (!cleanChunk) return "";

  const cacheKey = `mr:${cleanChunk}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      cleanChunk
    )}&langpair=en|mr`;

    const res = await fetch(url, {
      headers: { "User-Agent": "VisitKokanApp/1.0 (contact@visitkokan.in)" },
      next: { revalidate: 86400 }, // Cache on edge
    });

    if (res.ok) {
      const json = await res.json();
      const rawTranslated = json.responseData?.translatedText;
      if (
        rawTranslated &&
        typeof rawTranslated === "string" &&
        !rawTranslated.startsWith("MYMEMORY WARNING") &&
        !rawTranslated.includes("QUERY LENGTH LIMIT")
      ) {
        const decoded = decodeEntities(rawTranslated);
        translationCache.set(cacheKey, decoded);
        return decoded;
      }
    }
  } catch (err) {
    console.warn("Free translation engine failed for chunk:", err);
  }

  // Fallback to original chunk if service is unavailable
  return cleanChunk;
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
