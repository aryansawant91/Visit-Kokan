"use client";
import { useRef } from "react";

export function OTPInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(6, "").split("").slice(0, 6);

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      const arr = [...digits];
      if (arr[i]) {
        arr[i] = "";
        onChange(arr.join(""));
      } else {
        arr[i] = "";
        onChange(arr.join(""));
        if (i > 0) inputs.current[i - 1]?.focus();
      }
    }
  };

  const handleChange = (i: number, val: string) => {
    const char = val.replace(/\D/g, "").slice(-1);
    const arr = [...digits];
    arr[i] = char;
    onChange(arr.join(""));
    if (char && i < 5) inputs.current[i + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    onChange(pasted);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center my-2">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => { inputs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          style={{ width: "44px", height: "52px", minHeight: "52px" }}
          className={`text-center text-xl font-bold rounded-xl border-2 bg-white text-kokan-earth focus:outline-none transition-all ${
            d
              ? "border-kokan-green bg-kokan-green/5 text-kokan-green"
              : "border-kokan-sand/60 focus:border-kokan-green"
          }`}
        />
      ))}
    </div>
  );
}