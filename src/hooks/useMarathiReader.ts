"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getMarathiTrek } from "@/constants/marathiTrekData";
import { getMarathiDestination } from "@/constants/marathiDestinationData";

const clientCache = new Map<string, string>();

function decodeHtmlEntities(str: string): string {
  if (!str) return "";
  return str
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function hasDevanagari(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

export function useMarathiReader<T extends Record<string, string | undefined>>(
  fields: T,
  context?: string
) {
  const [isMarathi, setIsMarathi] = useState(false);
  const [loading, setLoading] = useState(false);
  const [marathiFields, setMarathiFields] = useState<Partial<T>>({});
  const isMounted = useRef(true);

  // Read curated content from local dictionaries for instant 0ms response
  const getCuratedVal = useCallback(
    (key: string): string | null => {
      if (!context) return null;
      const trekMatch = getMarathiTrek(context);
      if (trekMatch && (trekMatch as any)[key]) {
        return (trekMatch as any)[key];
      }
      const destMatch = getMarathiDestination(context);
      if (destMatch && (destMatch as any)[key]) {
        return (destMatch as any)[key];
      }
      return null;
    },
    [context]
  );

  // Restore preferred language from localStorage
  useEffect(() => {
    isMounted.current = true;
    try {
      const saved = localStorage.getItem("visitkokan_lang");
      if (saved === "mr") {
        setIsMarathi(true);
      }
    } catch {
      // Ignore in private browsing
    }

    const handleLangChange = (e: any) => {
      const newLang = e.detail?.lang;
      if (newLang === "mr") setIsMarathi(true);
      else if (newLang === "en") setIsMarathi(false);
    };

    window.addEventListener("visitkokan_lang_change", handleLangChange);
    return () => {
      isMounted.current = false;
      window.removeEventListener("visitkokan_lang_change", handleLangChange);
    };
  }, []);

  // Synchronously seed curated strings as soon as isMarathi is active
  useEffect(() => {
    if (!isMarathi) return;

    const initialCurated: Partial<T> = {};
    let hasCurated = false;

    for (const key of Object.keys(fields) as (keyof T)[]) {
      const curated = getCuratedVal(key as string);
      if (curated) {
        initialCurated[key] = curated as any;
        hasCurated = true;
      }
    }

    if (hasCurated) {
      setMarathiFields((prev) => ({ ...prev, ...initialCurated }));
    }
  }, [isMarathi, context, getCuratedVal]); // eslint-disable-line

  // Fetch translation for non-curated fields
  const fieldsSignature = JSON.stringify(fields);

  useEffect(() => {
    if (!isMarathi) return;

    let cancel = false;
    const currentMarathi: Partial<T> = { ...marathiFields };
    const neededKeys: (keyof T)[] = [];
    const textsToTranslate: string[] = [];

    const keys = Object.keys(fields) as (keyof T)[];
    for (const key of keys) {
      const val = fields[key];
      if (!val || typeof val !== "string" || val.trim().length === 0) continue;

      // 1. Curated match
      const curated = getCuratedVal(key as string);
      if (curated) {
        currentMarathi[key] = curated as any;
        continue;
      }

      // 2. Client-side memory cache
      const cacheKey = `mr:${val.trim()}`;
      if (clientCache.has(cacheKey)) {
        currentMarathi[key] = clientCache.get(cacheKey) as any;
        continue;
      }

      // 3. Needs remote translation
      neededKeys.push(key);
      textsToTranslate.push(val);
    }

    if (neededKeys.length === 0) {
      setMarathiFields(currentMarathi);
      return;
    }

    setLoading(true);
    fetch("/api/ai/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts: textsToTranslate, context }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Translation failed");
        return res.json();
      })
      .then((data) => {
        if (cancel || !isMounted.current) return;
        const translations: string[] = data.translations || [];

        neededKeys.forEach((key, idx) => {
          const rawTrans = translations[idx];
          const decoded = decodeHtmlEntities(rawTrans || "");

          if (decoded && hasDevanagari(decoded)) {
            currentMarathi[key] = decoded as any;
            const originalVal = fields[key];
            if (originalVal) {
              clientCache.set(`mr:${originalVal.trim()}`, decoded);
            }
          }
        });

        setMarathiFields({ ...currentMarathi });
      })
      .catch((err) => {
        console.warn("Marathi translation warning:", err);
      })
      .finally(() => {
        if (!cancel && isMounted.current) {
          setLoading(false);
        }
      });

    return () => {
      cancel = true;
    };
  }, [isMarathi, fieldsSignature, context, getCuratedVal]); // eslint-disable-line

  const toggleLanguage = () => {
    const next = !isMarathi;
    setIsMarathi(next);
    try {
      localStorage.setItem("visitkokan_lang", next ? "mr" : "en");
    } catch {
      // Ignore
    }
    window.dispatchEvent(
      new CustomEvent("visitkokan_lang_change", { detail: { lang: next ? "mr" : "en" } })
    );
  };

  // Get active text: returns Marathi version if active & available, else English
  const getField = (key: keyof T): string => {
    if (isMarathi) {
      if (marathiFields[key]) {
        return marathiFields[key] as string;
      }
      const curated = getCuratedVal(key as string);
      if (curated) return curated;

      const original = fields[key];
      if (original && typeof original === "string") {
        const cached = clientCache.get(`mr:${original.trim()}`);
        if (cached) return cached;
      }
    }
    return (fields[key] as string) || "";
  };

  return {
    isMarathi,
    loading,
    toggleLanguage,
    getField,
  };
}
