import { KONKAN_MAP_SPOTS } from "@/data/konkanMapLocations";

export interface TravelLogistics {
  fromMumbai: string;
  fromPune: string;
  ferryShortcut?: {
    title: string;
    detail: string;
    href: string;
  };
  lat?: number;
  lng?: number;
}

export function getTravelLogistics(
  slug: string,
  name: string,
  region: string
): TravelLogistics {
  const s = (slug || "").toLowerCase();
  const n = (name || "").toLowerCase();
  const r = (region || "").toLowerCase();

  // 1. Try exact or partial match in curated KONKAN_MAP_SPOTS
  const matchedSpot =
    KONKAN_MAP_SPOTS.find((spot) => spot.slug === s || spot.id === s) ||
    KONKAN_MAP_SPOTS.find(
      (spot) =>
        (s.length > 4 && spot.slug.includes(s)) ||
        (spot.slug.length > 4 && s.includes(spot.slug)) ||
        n.includes(spot.name.toLowerCase().split(" ")[0])
    );

  let ferryShortcut: TravelLogistics["ferryShortcut"] | undefined;

  if (r.includes("raigad") || s.includes("alibaug") || s.includes("kashid") || s.includes("murud") || s.includes("harihareshwar") || s.includes("diveagar")) {
    ferryShortcut = {
      title: "Mumbai ⇄ Mandwa Ro-Pax Ferry Shortcut",
      detail: "Board with your car or bike at Bhaucha Dhakka (Mumbai) and reach Mandwa in 55 mins—saving ~2.5 hrs of NH-66 traffic.",
      href: "/ferry#mumbai-mandwa-roro",
    };
  } else if (s.includes("velas") || s.includes("bankot") || s.includes("kelshi") || s.includes("anjarle")) {
    ferryShortcut = {
      title: "Bagmandla ⇄ Bankot Ro-Ro Ferry Shortcut",
      detail: "Cross Savitri River estuary in 15 mins to connect Harihareshwar directly with Velas & Dapoli—saving 85 km of ghat driving.",
      href: "/ferry#bagmandla-bankot",
    };
  } else if (s.includes("guhagar") || s.includes("dapoli") || s.includes("harnai") || s.includes("velneshwar")) {
    ferryShortcut = {
      title: "Dabhol ⇄ Dhopave Vehicle Ferry",
      detail: "15-minute ferry across Vashishti Creek linking Dapoli & Harnai directly with Guhagar—saving an 80 km Chiplun detour.",
      href: "/ferry#dabhol-dhopave",
    };
  } else if (s.includes("ganpatipule") || s.includes("jaigad") || s.includes("aare") || s.includes("ratnagiri")) {
    ferryShortcut = {
      title: "Jaigad ⇄ Tavsal Coastal Ferry",
      detail: "Cross Shastri Creek in 15 mins between Guhagar and Ganpatipule, bypassing 65 km of inland ghat roads.",
      href: "/ferry#jaigad-tavsal",
    };
  }

  if (matchedSpot) {
    return {
      fromMumbai: matchedSpot.distanceFromMumbai,
      fromPune: matchedSpot.distanceFromPune,
      ferryShortcut,
      lat: matchedSpot.lat,
      lng: matchedSpot.lng,
    };
  }

  // 2. Smart district-level defaults
  if (r.includes("raigad")) {
    return {
      fromMumbai: "95–145 km (2.5–3.5 hrs via Atal Setu / NH-66)",
      fromPune: "135–175 km (3.5–4 hrs via Tamhini / Express Hwy)",
      ferryShortcut,
    };
  }

  if (r.includes("ratnagiri")) {
    return {
      fromMumbai: "230–330 km (5.5–7 hrs via NH-66 / Konkan Railway)",
      fromPune: "200–285 km (5–6.5 hrs via Tamhini or Kumbharli Ghat)",
      ferryShortcut,
    };
  }

  if (r.includes("sindhudurg") || r.includes("malvan") || r.includes("tarkarli")) {
    return {
      fromMumbai: "460–510 km (8.5–10 hrs via NH-66 / Konkan Railway)",
      fromPune: "375–410 km (7–8 hrs via Kolhapur NH-48 & Gaganbawda)",
      ferryShortcut: {
        title: "Coastal Highway (MSH-4) Creek Ferries",
        detail: "Driving down from Mumbai? Use Ratnagiri Ro-Ro ferries at Bagmandla, Dabhol & Jaigad to save hours.",
        href: "/ferry",
      },
    };
  }

  return {
    fromMumbai: "110–180 km (2.5–4.5 hrs via Expressway / NH-66)",
    fromPune: "65–150 km (1.5–3.5 hrs by road)",
    ferryShortcut,
  };
}
