"use client";

import { useEffect, useState } from "react";

interface Props {
  onResend: () => void;
  disabled?: boolean;
  cooldownSeconds?: number;
}

export default function ResendTimer({ onResend, disabled, cooldownSeconds = 90 }: Props) {
  const [seconds, setSeconds] = useState(cooldownSeconds);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    setSeconds(cooldownSeconds);
    setCanResend(false);

    const timer = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  const handleResend = () => {
    if (!canResend || disabled) return;
    setSeconds(cooldownSeconds);
    setCanResend(false);
    onResend();

    const timer = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timeLabel = mins > 0
    ? `${mins}:${secs.toString().padStart(2, "0")}`
    : `${secs}s`;

  return (
    <div className="text-center text-sm text-kokan-earth/50">
      {canResend ? (
        <button
          onClick={handleResend}
          disabled={disabled}
          className="text-kokan-green font-semibold hover:underline disabled:opacity-50"
        >
          Resend OTP
        </button>
      ) : (
        <span>
          Resend OTP in{" "}
          <span className="text-kokan-earth font-medium">{timeLabel}</span>
        </span>
      )}
    </div>
  );
}