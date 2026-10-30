export interface TideInfo {
  fortName: string;
  slug: string;
  currentStatus: "low" | "rising" | "high" | "falling";
  statusTitle: string;
  statusBadgeColor: string;
  isWalkable: boolean;
  isFerryActive: boolean;
  currentWaterLevel: string; // e.g. "Low (0.6m)"
  safeWindow: string; // e.g. "11:30 AM – 3:30 PM"
  nextLowTide: string;
  nextHighTide: string;
  jettyTimings: string;
  safetyTip: string;
  isMonsoonClosed: boolean;
}

export interface FortTidalProfile {
  name: string;
  aliases: string[];
  accessType: "walking_and_boat" | "ferry_only" | "coastal_walk";
  location: string;
  jettyName?: string;
  operatingHours: string;
  baseLowTideHour: number; // approximate astronomical offset for epoch
  description: string;
  safetyRule: string;
}

export const FORT_PROFILES: Record<string, FortTidalProfile> = {
  "kolaba": {
    name: "Kolaba Fort (Alibaug)",
    aliases: ["kolaba", "kolaba-fort", "colaba", "colaba-fort", "alibaug-fort"],
    accessType: "walking_and_boat",
    location: "Alibaug Beach, Raigad",
    operatingHours: "Accessible during low tide (Daylight hours: 7:00 AM – 5:30 PM)",
    baseLowTideHour: 10.5,
    description: "Walkable directly from Alibaug Beach across the exposed sandy sea bed during Low Tide. Submerged by 6–8 ft of sea water during High Tide.",
    safetyRule: "Start returning from the fort at least 1.5 hours before peak high tide. Never try to wade through water when the tide starts rushing in."
  },
  "murud-janjira": {
    name: "Murud-Janjira Fort",
    aliases: ["murud-janjira", "janjira", "murud-janjira-fort", "janjira-fort"],
    accessType: "ferry_only",
    location: "Rajapuri Jetty, Murud, Raigad",
    jettyName: "Rajapuri Jetty (Local Sailboats)",
    operatingHours: "7:00 AM – 5:00 PM (Daily)",
    baseLowTideHour: 10.8,
    description: "Built on an oval rock 2 km off the coast. Reached exclusively by traditional non-motorized sailboat ferries from Rajapuri Jetty.",
    safetyRule: "Wearing life jackets provided on sailboats is mandatory. Ferries halt during monsoon rough seas (June–Sept)."
  },
  "sindhudurg": {
    name: "Sindhudurg Fort",
    aliases: ["sindhudurg-fort", "sindhudurg-killa", "malvan-sindhudurg-fort", "sindhudurg-sea-fort"],
    accessType: "ferry_only",
    location: "Malvan Dandi Jetty, Sindhudurg",
    jettyName: "Malvan Ferry Jetty",
    operatingHours: "8:00 AM – 5:30 PM (Daily)",
    baseLowTideHour: 11.2,
    description: "48-acre island fort built by Chhatrapati Shivaji Maharaj on Kurte Island. Accessible by motorized tourist ferry from Malvan jetty (15 min boat ride).",
    safetyRule: "Early morning boat transfers have the calmest waters and shortest ticket queues. Ferry service closes at sunset."
  },
  "suvarnadurg": {
    name: "Suvarnadurg Fort (Harnai)",
    aliases: ["suvarnadurg", "suvarnadurg-fort", "harnai"],
    accessType: "ferry_only",
    location: "Harnai Harbour, Ratnagiri",
    jettyName: "Harnai Fishing Port",
    operatingHours: "6:30 AM – 4:00 PM (Fishing boats by request)",
    baseLowTideHour: 10.6,
    description: "Golden island fortress 1 km off Harnai coast. Reached by hiring local motor boats from Harnai fishing port.",
    safetyRule: "Morning visits (7 AM – 10 AM) are best before afternoon winds create chop in the bay."
  },
  "vijaydurg": {
    name: "Vijaydurg Fort",
    aliases: ["vijaydurg", "vijaydurg-fort"],
    accessType: "coastal_walk",
    location: "Vijaydurg Creek, Sindhudurg",
    operatingHours: "8:00 AM – 6:00 PM (Daily)",
    baseLowTideHour: 11.0,
    description: "Formidable naval fort flanked by the Arabian sea on three sides and Waghotan creek on the fourth.",
    safetyRule: "Watch your step on wet rocks along the lower ramparts; dolphin safari boats depart from the adjoining jetty in the morning."
  }
};

/**
 * Calculates real-time tide status along the Konkan coast based on lunar phase epoch
 */

export function isSeaFort(slugOrName: string): boolean {
  if (!slugOrName) return false;
  const normalized = slugOrName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return Object.keys(FORT_PROFILES).some((key) => {
    const profile = FORT_PROFILES[key];
    return key === normalized || profile.aliases.some((alias) => normalized === alias || normalized.includes(alias));
  });
}

export function getFortTideStatus(slugOrName: string, date: Date = new Date()): TideInfo | null {
  const normalized = slugOrName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  
  let matchedKey = Object.keys(FORT_PROFILES).find(key => {
    const profile = FORT_PROFILES[key];
    return key === normalized || profile.aliases.some(alias => normalized.includes(alias));
  });

  // NEVER fall back to Kolaba! Only return tide info for verified sea/island forts.
  // Hill forts like Raigad, Pratapgad, Rajmachi, etc. must return null!
  if (!matchedKey) {
    return null;
  }

  const profile = FORT_PROFILES[matchedKey];

  // Konkan tide calculation based on lunar cycle (M2 tidal constituent ~12.42 hours)
  const month = date.getMonth(); // 0-indexed (5 = June, 8 = Sept)
  const isMonsoon = month >= 5 && month <= 8;

  // Days since reference new moon (Jan 11, 2024 reference epoch)
  const epoch = new Date(2024, 0, 11).getTime();
  const diffDays = (date.getTime() - epoch) / (1000 * 60 * 60 * 24);
  const lunarCycleDays = 29.530588853;
  const lunarPhase = (diffDays % lunarCycleDays) / lunarCycleDays; // 0 to 1

  // Semi-diurnal cycle: two tides per day (every 12.42 hrs = 12h 25m)
  // Low tide shifts roughly 50 mins every 24 hours with the moon
  const dailyShiftHours = (diffDays % 1) * 24;
  const lunarTideOffset = (lunarPhase * 24) % 12.42;

  let firstLowTideHour = (profile.baseLowTideHour + lunarTideOffset) % 12.42;
  if (firstLowTideHour < 0) firstLowTideHour += 12.42;

  const lowTide1 = firstLowTideHour;
  const highTide1 = (firstLowTideHour + 6.21) % 24;
  const lowTide2 = (firstLowTideHour + 12.42) % 24;
  const highTide2 = (highTide1 + 12.42) % 24;

  const currentHour = date.getHours() + date.getMinutes() / 60;

  // Determine closest low tide & high tide
  const lowTides = [lowTide1, lowTide2, lowTide1 + 24].filter(h => h >= currentHour);
  const highTides = [highTide1, highTide2, highTide1 + 24].filter(h => h >= currentHour);
  const nextLowH = lowTides[0] % 24;
  const nextHighH = highTides[0] % 24;

  // Determine distance to nearest low tide
  const distLow1 = Math.abs(currentHour - lowTide1);
  const distLow2 = Math.abs(currentHour - lowTide2);
  const distLow = Math.min(distLow1, distLow2);

  // Status mapping
  let currentStatus: "low" | "rising" | "high" | "falling" = "high";
  let statusTitle = "High Tide";
  let statusBadgeColor = "bg-blue-100 text-blue-800 border-blue-200";
  let isWalkable = false;
  let currentWaterLevel = "High (2.4m)";

  if (distLow <= 1.8) {
    currentStatus = "low";
    statusTitle = profile.accessType === "walking_and_boat" ? "Low Tide — Walkway Open" : "Low Tide — Calm Water";
    statusBadgeColor = "bg-emerald-100 text-emerald-800 border-emerald-300";
    isWalkable = true;
    currentWaterLevel = "Low (0.5m – 0.8m)";
  } else if (distLow <= 3.2) {
    if (currentHour > (lowTide1 + lowTide2) / 2) {
      currentStatus = "falling";
      statusTitle = "Ebbing Tide — Water Receding";
      statusBadgeColor = "bg-amber-100 text-amber-800 border-amber-200";
      currentWaterLevel = "Moderate (1.3m)";
    } else {
      currentStatus = "rising";
      statusTitle = "Rising Tide — Caution Advised";
      statusBadgeColor = "bg-orange-100 text-orange-800 border-orange-200";
      currentWaterLevel = "Rising (1.6m)";
    }
  } else {
    currentStatus = "high";
    statusTitle = profile.accessType === "walking_and_boat" ? "High Tide — Path Submerged" : "High Tide — Deep Water";
    statusBadgeColor = "bg-blue-100 text-blue-800 border-blue-200";
    currentWaterLevel = "High (2.2m – 2.8m)";
  }

  const formatH = (h: number) => {
    const totalMins = Math.round(h * 60);
    const hrs = Math.floor(totalMins / 60) % 24;
    const mins = totalMins % 60;
    const period = hrs >= 12 ? "PM" : "AM";
    const displayH = hrs % 12 === 0 ? 12 : hrs % 12;
    return `${displayH}:${mins.toString().padStart(2, "0")} ${period}`;
  };

  const safeStart = Math.max(7, (nextLowH - 2 + 24) % 24);
  const safeEnd = Math.min(17.5, (nextLowH + 1.5) % 24);
  const safeWindow = `${formatH(safeStart)} – ${formatH(safeEnd)}`;

  const isFerryActive = !isMonsoon && currentHour >= 7 && currentHour <= 17.5;

  return {
    fortName: profile.name,
    slug: matchedKey,
    currentStatus,
    statusTitle,
    statusBadgeColor,
    isWalkable,
    isFerryActive,
    currentWaterLevel,
    safeWindow,
    nextLowTide: formatH(nextLowH),
    nextHighTide: formatH(nextHighH),
    jettyTimings: profile.operatingHours,
    safetyTip: profile.safetyRule,
    isMonsoonClosed: isMonsoon
  };
}
