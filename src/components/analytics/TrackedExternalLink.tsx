"use client";

import React from "react";
import { GAKeyEventName, trackGAEvent } from "@/lib/analytics";

interface TrackedExternalLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  eventName: GAKeyEventName;
  eventParams?: Record<string, string | number | boolean | undefined>;
}

export default function TrackedExternalLink({
  eventName,
  eventParams,
  onClick,
  children,
  ...props
}: TrackedExternalLinkProps) {
  return (
    <a
      {...props}
      onClick={(e) => {
        trackGAEvent(eventName, eventParams);
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
