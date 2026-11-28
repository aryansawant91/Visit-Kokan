import { sendGAEvent } from "@next/third-parties/google";

export type GAKeyEventName =
  | "whatsapp_enquiry_click"
  | "map_route_calculated"
  | "trip_planner_generated"
  | "ferry_schedule_view";

export function trackGAEvent(
  eventName: GAKeyEventName,
  params?: Record<string, string | number | boolean | undefined>
) {
  if (typeof window === "undefined") return;
  try {
    const cleanParams: Record<string, string | number | boolean> = {};
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v !== undefined) cleanParams[k] = v;
      }
    }
    sendGAEvent("event", eventName, cleanParams);
  } catch {
    // Never block user interaction if analytics is unavailable or blocked
  }
}
