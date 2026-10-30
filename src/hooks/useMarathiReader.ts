"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const clientCache = new Map<string, string>();

export function useMarathiReader<T extends Record<string, string | undefined>>(
  fields: T,
  context?: string
) {
  const [isMarathi, setIsMarathi] = useState(false);
  const [loading, setLoading] = useState(false);
  const [marathiFields, setMarathiFields] = useState<Partial<T>>({});
  const isMounted = useRef(true);

  // Restore preferred language from localStorage
  useEffect(() => {
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

  // Fetch translation when isMarathi becomes true
  const translateFields = useCallback(async () => {
    const keys = Object.keys(fields) as (keyof T)[];
    const neededKeys: (keyof T)[] = [];
    const textsToTranslate: string[] = [];
    const currentMarathi: Partial<T> = { ...marathiFields };

    keys.forEach((key) => {
      const val = fields[key];
      if (!val || typeof val !== "string" || val.trim().length === 0) return;

      const cacheKey = `mr:${val.trim()}`;
      if (clientCache.has(cacheKey)) {
        currentMarathi[key] = clientCache.get(cacheKey) as any;
      } else {
        neededKeys.push(key);
        textsToTranslate.push(val);
      }
    });

    if (neededKeys.length === 0) {
      setMarathiFields(currentMarathi);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/ai/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texts: textsToTranslate, context }),
      });

      if (!res.ok) throw new Error("Translation failed");
      const data = await res.json();
      const translations: string[] = data.translations || [];

      neededKeys.forEach((key, idx) => {
        const trans = translations[idx] || fields[key];
        currentMarathi[key] = trans as any;
        const originalVal = fields[key];
        if (originalVal && trans) {
          clientCache.set(`mr:${originalVal.trim()}`, trans);
        }
      });

      if (isMounted.current) {
        setMarathiFields(currentMarathi);
      }
    } catch (err) {
      console.warn("Marathi translation warning:", err);
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [fields, context, marathiFields]);

  useEffect(() => {
    if (isMarathi) {
      translateFields();
    }
  }, [isMarathi]); // eslint-disable-line

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
    if (isMarathi && marathiFields[key]) {
      return marathiFields[key] as string;
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
