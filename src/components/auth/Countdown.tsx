"use client";
import { useEffect, useRef, useState } from "react";

export function Countdown({ seconds, onEnd }: { seconds: number; onEnd: () => void }) {
  const [left, setLeft] = useState(seconds);
  const onEndRef = useRef(onEnd);

  useEffect(() => { onEndRef.current = onEnd; }, [onEnd]);

  useEffect(() => {
    setLeft(seconds);
    if (seconds <= 0) return;
    const id = setInterval(() => {
      setLeft((p) => {
        if (p <= 1) { clearInterval(id); onEndRef.current(); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [seconds]);

  if (left <= 0) return null;
  const m = Math.floor(left / 60), s = left % 60;
  return <span className="text-kokan-earth/50">{m > 0 ? `${m}m ` : ""}{s}s</span>;
}