import { adminDb } from "@/lib/firebaseAdmin";
import { db } from "@/lib/firestore";
import { collection, getDocs } from "firebase/firestore";
import { TREK_TRANSIT_GATEWAYS } from "./kokanWebsiteData";

export interface TrainStop {
  station: string;
  code: string;
  arrival: string | null;
  departure: string | null;
}

export interface Train {
  slug: string;
  name: string;
  number: string;
  days: string;
  from: string;
  to: string;
  stops: TrainStop[];
  konkanStops: string[];
}

export interface RoadBreakpoint {
  place: string;
  km: number;
  note: string;
}

export interface Road {
  slug: string;
  from: string;
  to: string;
  distance: string;
  duration: string;
  via: string;
  ferryOption: string | null;
  tip: string;
  tollApprox: string;
  fuelApprox: string;
  mapsQuery: string;
  bestDepartTime: string;
  breakpoints?: RoadBreakpoint[];
}

// Fetch all trains (prefers adminDb on server, falls back to client db)
export async function getAllTrains(): Promise<Train[]> {
  try {
    if (adminDb) {
      const snapshot = await adminDb.collection("trains").get();
      return snapshot.docs.map((d) => d.data() as Train);
    }
    const snapshot = await getDocs(collection(db, "trains"));
    return snapshot.docs.map((d) => d.data() as Train);
  } catch (error) {
    console.error("❌ Failed to fetch trains from Firestore:", error);
    return [];
  }
}

// Fetch all road routes
export async function getAllRoads(): Promise<Road[]> {
  try {
    if (adminDb) {
      const snapshot = await adminDb.collection("routes").get();
      return snapshot.docs.map((d) => d.data() as Road);
    }
    const snapshot = await getDocs(collection(db, "routes"));
    return snapshot.docs.map((d) => d.data() as Road);
  } catch (error) {
    console.error("❌ Failed to fetch routes from Firestore:", error);
    return [];
  }
}

// Find train by name mention
export async function findTrainByName(message: string): Promise<Train | null> {
  const trains = await getAllTrains();
  const lower = message.toLowerCase();

  return (
    trains.find(
      (t) =>
        t.name?.toLowerCase().includes(lower) ||
        t.number?.includes(lower) ||
        t.slug?.replace(/-/g, " ").includes(lower),
    ) || null
  );
}

// Find road route by from/to
export async function findRoadRoute(
  from: string,
  to: string,
): Promise<Road | null> {
  const roads = await getAllRoads();
  const fromLower = from.toLowerCase();
  const toLower = to.toLowerCase();

  return (
    roads.find(
      (r) =>
        r.from?.toLowerCase().includes(fromLower) &&
        r.to?.toLowerCase().includes(toLower),
    ) || null
  );
}

// Get arrival time at a specific station
export function getArrivalAtStation(
  train: Train,
  stationName: string,
): string | null {
  if (!train?.stops) return null;
  const stop = train.stops.find((s) =>
    s.station?.toLowerCase().includes(stationName.toLowerCase()),
  );
  return stop?.arrival || stop?.departure || null;
}

export const KONKAN_DESTINATION_GATEWAYS = `
VERIFIED DESTINATION TO NEAREST RAILWAY STATION & GATEWAY DIRECTORY:
- Raigad: Mangaon (MNG) for Raigad Fort | Roha (ROHA) for Murud | Nagothane (NGTN)/Khopoli for Pali
- North Ratnagiri: Khed (KHED) for Dapoli/Mahipatgad | Chiplun (CHI) for Guhagar
- Central Ratnagiri: Ratnagiri (RN) for Ganpatipule/Jaigad
- Sindhudurg (South): Kankavli (KKW) / Kudal (KUDL) for Malvan/Tarkarli/Devgad | Sawantwadi Road (SWV) for Amboli
- Pune/Lonavala/Karjat: Pune Junction / Lonavala / Panvel / Karjat
`;

/**
 * Returns targeted transit context (only 50-150 tokens) based on the user's current trek or destination.
 * Eliminates input token blowout and guarantees zero 413 rate limit errors on Groq.
 */
export function getRelevantTransportContext(
  query: string,
  pageContext: string = "",
  pathname: string = ""
): string {
  const combined = `${query} ${pageContext} ${pathname}`.toLowerCase();

  // 1. Check if user is looking at or asking about a specific trek
  for (const [slug, transit] of Object.entries(TREK_TRANSIT_GATEWAYS)) {
    const slugKey = slug.replace(/-trek$/, "").replace(/-fort$/, "");
    if (
      combined.includes(slug) ||
      combined.includes(slugKey) ||
      (transit.baseVillage && combined.includes(transit.baseVillage.toLowerCase().split(" ")[0]))
    ) {
      return `
VERIFIED TRANSIT FOR THIS SPECIFIC TREK:
- Trek: ${slug}
- Base Village: ${transit.baseVillage}
- Nearest Railway Station: ${transit.nearestStation}
- Highway Route: ${transit.roadRoute}
⚠️ MANDATORY: When asked how to reach, ALWAYS provide this verified station (${transit.nearestStation}) and route. NEVER recommend Kankavli or any other wrong station!
`.trim();
    }
  }

  // 2. Specific coastal hubs
  if (combined.includes("raigad") || combined.includes("pachad") || combined.includes("mahad") || combined.includes("mangaon")) {
    return `- Raigad Fort / Mahad: Nearest Station is Mangaon (MNG - 45 km, 1 hr auto). Jan Shatabdi dep CSMT 05:25 -> arr 08:05. Tutari arr 02:10. Road via NH66 (140 km, 3.5 hrs).`;
  }
  if (combined.includes("alibaug") || combined.includes("mandwa") || combined.includes("nagaon") || combined.includes("kashid")) {
    return `- Alibaug: Ferry from Gateway of India to Mandwa (1 hr, ₹250) + 20 min local bus/auto. Road via NH66 (95 km, 2.5-3 hrs). NO direct train.`;
  }
  if (combined.includes("murud") || combined.includes("janjira")) {
    return `- Murud-Janjira: Nearest Station is Roha (ROHA - 42 km). Sailboats operate from Rajapuri jetty.`;
  }
  if (combined.includes("dapoli") || combined.includes("harnai") || combined.includes("anjarle") || combined.includes("velas") || combined.includes("khed")) {
    return `- Dapoli / Khed / Harnai: Nearest Station is Khed (KHED - 30 km). Tutari arr 03:30, Jan Shatabdi arr 09:20.`;
  }
  if (combined.includes("chiplun") || combined.includes("guhagar")) {
    return `- Chiplun / Guhagar: Nearest Station is Chiplun (CHI). Tutari arr 04:45, Jan Shatabdi arr 10:20.`;
  }
  if (combined.includes("ganpatipule") || combined.includes("ratnagiri") || combined.includes("jaigad")) {
    return `- Ganpatipule / Ratnagiri: Nearest Station is Ratnagiri (RN - 28 km to Ganpatipule). Tutari arr 06:15, Jan Shatabdi arr 11:45.`;
  }
  if (combined.includes("malvan") || combined.includes("tarkarli") || combined.includes("devbag") || combined.includes("devgad") || combined.includes("kunkeshwar") || combined.includes("sindhudurg")) {
    return `- Sindhudurg (Malvan/Tarkarli/Devgad): Nearest Station is Kankavli (KKW - 48 km) or Kudal (KUDL - 45 km). Tutari arr 07:30 / 08:15. Jan Shatabdi arr 13:55.`;
  }
  if (combined.includes("sawantwadi") || combined.includes("amboli") || combined.includes("vengurla")) {
    return `- Sawantwadi / Amboli: Nearest Station is Sawantwadi Road (SWV - 30 km to Amboli). Tutari arr 08:45, Jan Shatabdi arr 15:07.`;
  }

  // 3. Compact lean overview
  return `
KONKAN RAILWAY GATEWAYS DIRECTORY:
- Raigad: Mangaon (MNG) for Raigad Fort | Roha (ROHA) for Murud | Nagothane/Khopoli for Pali
- North Ratnagiri: Khed (KHED) for Dapoli/Mahipatgad | Chiplun (CHI) for Guhagar
- Central Ratnagiri: Ratnagiri (RN) for Ganpatipule
- Sindhudurg (South ONLY): Kankavli (KKW) / Kudal (KUDL) for Malvan/Tarkarli/Devgad | Sawantwadi Road (SWV) for Amboli
- Pune/Lonavala/Karjat Treks: Pune Junction / Lonavala / Panvel / Karjat
⚠️ Match the closest station to the traveler's specific destination. Never default to Kankavli!
`.trim();
}

// Format transport context for Groq prompt
export function formatTransportContext(trains: Train[], roads: Road[]): string {
  const trainInfo = (trains || [])
    .map(
      (t) => `
TRAIN: ${t.name || "Train"} (Train Number: ${t.number || ""})
Days: ${t.days || "Daily"}
Origin: ${t.from || ""} -> Destination: ${t.to || ""}
Station timings:
${(t.stops || [])
  .map(
    (s) =>
      `  - ${s.station} (${s.code}): arrives ${s.arrival || "origin/start"}, departs ${s.departure || "destination"}`,
  )
  .join("\n")}
`,
    )
    .join("\n---\n");

  const roadInfo = (roads || [])
    .map(
      (r) => `
ROAD ROUTE: ${r.from || ""} -> ${r.to || ""}
Distance: ${r.distance || ""} | Duration: ${r.duration || ""}
Via: ${r.via || ""}
Best depart time: ${r.bestDepartTime || ""}
Toll: ${r.tollApprox || ""} | Fuel: ${r.fuelApprox || ""}
Tip: ${r.tip || ""}
${r.ferryOption ? `Ferry option: ${r.ferryOption}` : ""}
`,
    )
    .join("\n---\n");

  return `
=== VERIFIED KONKAN TRANSPORT DATABASE (USE EXACT VALUES - NEVER HALLUCINATE OR GUESS TIMINGS) ===

${KONKAN_DESTINATION_GATEWAYS}

REAL KONKAN RAILWAY TRAIN TIMINGS:
${trainInfo || "No train data available"}

REAL ROAD ROUTES FROM MAJOR CITIES:
${roadInfo || "No road data available"}
================================================================================================
`;
}

// Deterministic validator & corrector for transport timings & fares
export function validateAndCorrectTransport(itinerary: any, contextText: string = ""): any {
  if (!itinerary) return itinerary;

  const destContext = `${itinerary.title || ""} ${itinerary.subtitle || ""} ${contextText} ${itinerary.destination || ""}`.toLowerCase();

  // 1. Comprehensive Trek Verification & Correction (for all 59 Sahyadri & coastal treks)
  let matchedTrekSlug: string | null = null;
  let matchedTransit: any = null;

  for (const [slug, transit] of Object.entries(TREK_TRANSIT_GATEWAYS)) {
    const slugKey = slug.replace(/-trek$/, "").replace(/-fort$/, "");
    if (
      destContext.includes(slug) ||
      destContext.includes(slugKey) ||
      (transit.baseVillage && destContext.includes(transit.baseVillage.toLowerCase().split(" ")[0]))
    ) {
      matchedTrekSlug = slug;
      matchedTransit = transit;
      break;
    }
  }

  const isAnyTrek =
    Boolean(matchedTrekSlug) ||
    destContext.includes("kalsubai") ||
    destContext.includes("torna") ||
    destContext.includes("rajgad") ||
    destContext.includes("sinhagad") ||
    destContext.includes("harishchandra") ||
    destContext.includes("ratangad") ||
    destContext.includes("kalavantin") ||
    destContext.includes("prabalgad") ||
    destContext.includes("amk") ||
    destContext.includes("sandhan") ||
    destContext.includes("lohagad") ||
    destContext.includes("visapur") ||
    destContext.includes("rajmachi") ||
    destContext.includes("sarasgad") ||
    destContext.includes("sudhagad") ||
    destContext.includes("mahipatgad") ||
    destContext.includes("karnala") ||
    destContext.includes("manikgad") ||
    destContext.includes("rohida") ||
    destContext.includes("purandar") ||
    destContext.includes("shivneri") ||
    destContext.includes("tikona") ||
    destContext.includes("tung") ||
    destContext.includes("trek") ||
    destContext.includes("summit") ||
    destContext.includes("peak");

  const isSindhudurgCoastalTrek =
    destContext.includes("sindhudurg-sea-wall") ||
    destContext.includes("kunkeshwar-cliffside") ||
    destContext.includes("vijaydurg-coastal");

  // For all mountain / Sahyadri treks: NEVER allow Malvani fish curry or coastal seafood!
  if (isAnyTrek && !isSindhudurgCoastalTrek && Array.isArray(itinerary.days)) {
    itinerary.days.forEach((d: any) => {
      if (Array.isArray(d.stops)) {
        d.stops.forEach((s: any) => {
          const desc = (s.description || "").toLowerCase();
          const title = (s.title || "").toLowerCase();
          if (
            s.type === "food" ||
            desc.includes("malvani") ||
            desc.includes("fish curry") ||
            desc.includes("kombdi vade") ||
            desc.includes("seafood") ||
            title.includes("malvani")
          ) {
            s.title = "Authentic Rustic Maharashtrian Meal";
            s.description =
              "Enjoy authentic rustic Maharashtrian food at the base village: piping hot Pithla Bhakri with fiery Thecha, Zunka, and fresh spiced buttermilk (taak).";
          }
        });
      }
    });
  }

  // Programmatic safeguard: For all mountain / Sahyadri treks, guarantee authentic expedition transport!
  if (isAnyTrek && !isSindhudurgCoastalTrek) {
    if (!itinerary.transportSummary) {
      itinerary.transportSummary = {};
    }
    const t = itinerary.transportSummary;
    const isSaturdayNight =
      destContext.includes("saturday") ||
      destContext.includes("night") ||
      destContext.includes("overnight") ||
      destContext.includes("batch") ||
      destContext.includes("weekend") ||
      (t.departs && (t.departs.includes("23:") || t.departs.includes("10:") || t.departs.includes("11:") || t.departs.includes("PM")));

    const baseVillage = matchedTransit?.baseVillage || (destContext.includes("kalsubai") ? "Bari (बारी, Akole)" : destContext.includes("torna") ? "Velhe (वेल्हे, Pune)" : "Base Village");

    // Set genuine trek transport: AC Trekking Bus / Tempo Traveler
    t.type = "bus";
    t.name = "AC Trekking Bus / Tempo Traveler";
    t.number = "Expedition Bus";
    t.from = destContext.includes("from pune")
      ? "Pune (Swargate / Chandani Chowk)"
      : "Mumbai (Borivali / Sion / Thane / Kalyan)";
    t.to = `${baseVillage}`;
    t.departs = isSaturdayNight ? "10:30 PM (Sat Night)" : "05:00 AM (Sun Morning)";
    t.arrives = isSaturdayNight ? "03:30 AM (Sun Morning)" : "08:30 AM (Sun Morning)";
    t.duration = destContext.includes("from pune") ? "2h 30m" : "4h 30m overnight drive";
    t.cost = "Included in ₹1,499 trek package (Advance: ₹750)";

    // Clean up Day 1 stops if it had Tutari Express or 07:30 AM Mumbai CSMT
    if (Array.isArray(itinerary.days) && itinerary.days[0] && Array.isArray(itinerary.days[0].stops)) {
      const stops = itinerary.days[0].stops;
      if (stops[0] && (stops[0].place?.toLowerCase().includes("csmt") || stops[0].place?.toLowerCase().includes("kankavli") || stops[0].description?.toLowerCase().includes("tutari") || stops[0].time?.includes("07:30 AM"))) {
        stops[0].time = isSaturdayNight ? "10:30 PM" : "05:00 AM";
        stops[0].place = "Mumbai Pickups (Borivali, Sion, Thane, Kalyan)";
        stops[0].type = "transport";
        stops[0].description = "Board the AC trekking bus from your selected pickup point. Overnight scenic highway drive towards the base village.";
        stops[0].cost = "Included";
      }
    }

    return itinerary;
  }

  // Programmatic safeguard: Ensure Pali / Sarasgad / Sudhagad treks never get Kankavli
  const isPaliTrek = destContext.includes("pali") || destContext.includes("sarasgad") || destContext.includes("sudhagad");
  if (isPaliTrek && itinerary.transportSummary) {
    const t = itinerary.transportSummary;
    t.type = "bus";
    t.name = "AC Trekking Bus / Khopoli Local";
    t.number = "";
    t.departs = "05:30 AM";
    t.arrives = "08:00 AM";
    t.duration = "2h 30m";
    t.cost = "Included in ₹1,499 trek package";
    t.from = "Mumbai (CSMT / Dadar / Thane)";
    t.to = "Pali Base Village (Nagothane / Khopoli)";
    return itinerary;
  }

  // Programmatic safeguard: Ensure Khed treks (Mahipatgad / Rasalgad / Sumargad) never get Kankavli
  const isKhedTrek = destContext.includes("mahipatgad") || destContext.includes("rasalgad") || destContext.includes("sumargad");
  if (isKhedTrek && itinerary.transportSummary) {
    const t = itinerary.transportSummary;
    t.type = "bus";
    t.name = "AC Trekking Bus / Khed Route";
    t.number = "";
    t.departs = "10:30 PM (Sat Night)";
    t.arrives = "04:00 AM (Sun Morning)";
    t.duration = "5h 30m";
    t.cost = "Included in ₹1,499 trek package";
    t.from = "Mumbai (Borivali / Thane / Vashi)";
    t.to = "Wadi Beldar Base Village (Khed)";
    return itinerary;
  }

  if (!itinerary.transportSummary) return itinerary;
  const transport = itinerary.transportSummary;
  
  const isTrain =
    !transport.type ||
    transport.type.toLowerCase() === "train" ||
    Boolean(transport.number) ||
    Boolean(transport.name?.toLowerCase().includes("express"));
  if (!isTrain) return itinerary;

  const fullTrainContext = `${destContext} ${transport.to || ""}`.toLowerCase();
  const trainName = `${transport.name || ""} ${transport.number || ""}`.toLowerCase();

  const isSindhudurg = fullTrainContext.includes("kankavli") || fullTrainContext.includes("kudal") || fullTrainContext.includes("malvan") || fullTrainContext.includes("tarkarli") || fullTrainContext.includes("sindhudurg") || fullTrainContext.includes("vengurla") || fullTrainContext.includes("devbag");
  const isRatnagiri = !isSindhudurg && (fullTrainContext.includes("ratnagiri") || fullTrainContext.includes("ganpatipule") || fullTrainContext.includes("jaigad") || fullTrainContext.includes("pawas"));
  const isChiplun = !isSindhudurg && !isRatnagiri && (fullTrainContext.includes("chiplun") || fullTrainContext.includes("guhagar") || fullTrainContext.includes("velneshwar"));
  const isKhed = !isSindhudurg && !isRatnagiri && !isChiplun && (fullTrainContext.includes("khed") || fullTrainContext.includes("dapoli") || fullTrainContext.includes("harnai") || fullTrainContext.includes("anjarle"));
  const isRaigad = !isSindhudurg && !isRatnagiri && !isChiplun && !isKhed && (fullTrainContext.includes("raigad") || fullTrainContext.includes("mangaon") || fullTrainContext.includes("mahad") || fullTrainContext.includes("pachad"));
  const isSawantwadi = !isSindhudurg && (fullTrainContext.includes("sawantwadi") || fullTrainContext.includes("amboli"));

  const isJanShatabdi = trainName.includes("jan shatabdi") || trainName.includes("12051");
  const isTutari = trainName.includes("tutari") || trainName.includes("10103");
  const isTejas = trainName.includes("tejas") || trainName.includes("22119");

  if (isSindhudurg) {
    if (isJanShatabdi) {
      // Jan Shatabdi to Kankavli arrives at 13:55 (01:55 PM), takes 8h 30m, fare ₹235 (2S) / ₹810 (CC)
      transport.name = "Jan Shatabdi Express";
      transport.number = "12051";
      transport.departs = "05:25";
      transport.arrives = "13:55 (01:55 PM)";
      transport.duration = "8h 30m";
      transport.cost = "₹235 (2S) / ₹810 (CC)";
      transport.to = transport.to?.toLowerCase().includes("kudal") ? "Kudal (KUDL)" : "Kankavli (KKW)";
      transport.from = "Mumbai CSMT";

      // Also ensure Day 1 Stop 1 doesn't claim 08:05 AM for Kankavli
      if (itinerary.days && itinerary.days[0] && itinerary.days[0].stops && itinerary.days[0].stops[0]) {
        const stop1 = itinerary.days[0].stops[0];
        stop1.time = "01:55 PM";
        stop1.description = `Arrive at Kankavli via Jan Shatabdi Express (12051) at 01:55 PM. Cab to Malvan/Tarkarli (48 km, 1 hr).`;
        stop1.cost = "₹235 (2S) / ₹810 (CC)";
      }
    } else if (isTejas) {
      transport.name = "Tejas Express";
      transport.number = "22119";
      transport.departs = "05:50";
      transport.arrives = "13:30 (01:30 PM)";
      transport.duration = "7h 40m";
      transport.cost = "₹1,250 (CC) / ₹2,400 (EC)";
      transport.to = "Kudal (KUDL)";
      transport.from = "Mumbai CSMT";

      if (itinerary.days && itinerary.days[0] && itinerary.days[0].stops && itinerary.days[0].stops[0]) {
        const stop1 = itinerary.days[0].stops[0];
        stop1.time = "01:30 PM";
        stop1.description = `Arrive at Kudal via Tejas Express (22119) at 01:30 PM. Cab to Malvan/Tarkarli (45 km, 1 hr).`;
        stop1.cost = "₹1,250 (CC) / ₹2,400 (EC)";
      }
    } else {
      // Overnight Tutari Express (Default recommendation for Sindhudurg morning arrival)
      transport.name = "Tutari Express";
      transport.number = "10103";
      transport.departs = "23:05";
      transport.arrives = "07:30";
      transport.duration = "8h 25m";
      transport.cost = "₹285 (2S) / ₹450 (SL) / ₹1,200 (3AC)";
      transport.to = transport.to?.toLowerCase().includes("kudal") ? "Kudal (KUDL)" : "Kankavli (KKW)";
      transport.from = "Mumbai CSMT";

      if (itinerary.days && itinerary.days[0] && itinerary.days[0].stops && itinerary.days[0].stops[0]) {
        const stop1 = itinerary.days[0].stops[0];
        stop1.time = "07:30 AM";
        stop1.description = `Arrive at Kankavli via Tutari Express (10103) at 07:30 AM. Board local auto/cab to Malvan/Tarkarli (48 km, 1 hr).`;
        stop1.cost = "₹285 (2S) / ₹450 (SL)";
      }
    }
  } else if (isRatnagiri) {
    if (isJanShatabdi) {
      transport.name = "Jan Shatabdi Express";
      transport.number = "12051";
      transport.departs = "05:25";
      transport.arrives = "11:45";
      transport.duration = "6h 20m";
      transport.cost = "₹180 (2S) / ₹620 (CC)";
      transport.to = "Ratnagiri (RN)";
      transport.from = "Mumbai CSMT";
    } else if (isTejas) {
      transport.name = "Tejas Express";
      transport.number = "22119";
      transport.departs = "05:50";
      transport.arrives = "11:05";
      transport.duration = "5h 15m";
      transport.cost = "₹950 (CC) / ₹1,850 (EC)";
      transport.to = "Ratnagiri (RN)";
      transport.from = "Mumbai CSMT";
    } else {
      transport.name = "Tutari Express";
      transport.number = "10103";
      transport.departs = "23:05";
      transport.arrives = "06:15";
      transport.duration = "7h 10m";
      transport.cost = "₹220 (2S) / ₹330 (SL) / ₹900 (3AC)";
      transport.to = "Ratnagiri (RN)";
      transport.from = "Mumbai CSMT";
    }
  } else if (isChiplun) {
    if (isJanShatabdi) {
      transport.name = "Jan Shatabdi Express";
      transport.number = "12051";
      transport.departs = "05:25";
      transport.arrives = "10:20";
      transport.duration = "4h 55m";
      transport.cost = "₹150 (2S) / ₹520 (CC)";
      transport.to = "Chiplun (CHI)";
      transport.from = "Mumbai CSMT";
    } else {
      transport.name = "Tutari Express";
      transport.number = "10103";
      transport.departs = "23:05";
      transport.arrives = "04:45";
      transport.duration = "5h 40m";
      transport.cost = "₹180 (SL) / ₹550 (3AC)";
      transport.to = "Chiplun (CHI)";
      transport.from = "Mumbai CSMT";
    }
  } else if (isKhed) {
    if (isJanShatabdi) {
      transport.name = "Jan Shatabdi Express";
      transport.number = "12051";
      transport.departs = "05:25";
      transport.arrives = "09:20";
      transport.duration = "3h 55m";
      transport.cost = "₹135 (2S) / ₹460 (CC)";
      transport.to = "Khed (KHED)";
      transport.from = "Mumbai CSMT";
    } else {
      transport.name = "Tutari Express";
      transport.number = "10103";
      transport.departs = "23:05";
      transport.arrives = "03:30";
      transport.duration = "4h 25m";
      transport.cost = "₹160 (SL) / ₹500 (3AC)";
      transport.to = "Khed (KHED)";
      transport.from = "Mumbai CSMT";
    }
  } else if (isRaigad) {
    if (isJanShatabdi) {
      transport.name = "Jan Shatabdi Express";
      transport.number = "12051";
      transport.departs = "05:25";
      transport.arrives = "08:05";
      transport.duration = "2h 40m";
      transport.cost = "₹120 (2S) / ₹380 (CC)";
      transport.to = "Mangaon (MNG)";
      transport.from = "Mumbai CSMT";
    } else {
      transport.name = "Tutari Express";
      transport.number = "10103";
      transport.departs = "23:05";
      transport.arrives = "02:10";
      transport.duration = "3h 05m";
      transport.cost = "₹160 (SL) / ₹500 (3AC)";
      transport.to = "Mangaon (MNG)";
      transport.from = "Mumbai CSMT";
    }
  } else if (isSawantwadi) {
    if (isJanShatabdi) {
      transport.name = "Jan Shatabdi Express";
      transport.number = "12051";
      transport.departs = "05:25";
      transport.arrives = "15:07";
      transport.duration = "9h 42m";
      transport.cost = "₹245 (2S) / ₹850 (CC)";
      transport.to = "Sawantwadi Road (SWV)";
      transport.from = "Mumbai CSMT";
    } else {
      transport.name = "Tutari Express";
      transport.number = "10103";
      transport.departs = "23:05";
      transport.arrives = "08:45";
      transport.duration = "9h 40m";
      transport.cost = "₹300 (2S) / ₹470 (SL) / ₹1,250 (3AC)";
      transport.to = "Sawantwadi Road (SWV)";
      transport.from = "Mumbai CSMT";
    }
  }

  return itinerary;
}

/**
 * Deterministic text sanitizer for trek conversational responses.
 * Guarantees zero hallucinations for railway stations, base villages, food, and return travel times.
 */
export function sanitizeTrekText(text: string, contextQuery: string = ""): string {
  if (!text) return text;
  const combined = `${contextQuery} ${text}`.toLowerCase();
  let sanitized = text;

  // 1. Correct railway station hallucinations: NEVER allow Kankavli for non-Sindhudurg treks!
  const isPaliTrek = combined.includes("pali") || combined.includes("sarasgad") || combined.includes("sudhagad");
  const isKhedTrek = combined.includes("mahipatgad") || combined.includes("rasalgad") || combined.includes("sumargad");
  const isPuneTrek = combined.includes("torna") || combined.includes("rajgad") || combined.includes("sinhagad") || combined.includes("purandar") || combined.includes("rohida") || combined.includes("kenjalgad");
  const isIgatpuriTrek = combined.includes("kalsubai") || combined.includes("harishchandra") || combined.includes("samrad") || combined.includes("bari") || combined.includes("ratangad") || combined.includes("sandhan");
  const isPanvelKarjatTrek = combined.includes("kalavantin") || combined.includes("prabalgad") || combined.includes("karnala") || combined.includes("manikgad") || combined.includes("kothaligad") || combined.includes("sondai");
  const isLonavalaTrek = combined.includes("lohagad") || combined.includes("visapur") || combined.includes("rajmachi") || combined.includes("tung") || combined.includes("tikona") || combined.includes("korigad");
  const isRaigadFort = combined.includes("raigad fort") || combined.includes("pachad") || combined.includes("heritage-climb");

  if (isPaliTrek) {
    sanitized = sanitized.replace(
      /Take the Konkan Railway \(Mumbai CST\/Dadar\s*->\s*Kankavli\) or a private cab via NH66\.\s*The drive from Kankavli to Pali is about 30 km and takes ~45 min on the coastal road\./gi,
      "Take the Central Railway suburban train to Khopoli (or Konkan Railway to Nagothane/Roha), or drive via Mumbai-Pune Expressway -> Khopoli exit -> Pali (105 km, 2.5 hrs)."
    );
    sanitized = sanitized.replace(
      /Kankavli \(KKW\) - 48 km away \(~1 hr drive\)/gi,
      "Nagothane (NGTN) - 14 km away (~20 min auto) or Khopoli (38 km away)"
    );
    sanitized = sanitized.replace(
      /•\s*From Ratnagiri\s*[-–]\s*A 1-hr drive \(45 km\) from Ratnagiri town to Pali via NH66\.?/gi,
      "• From Navi Mumbai / Thane - Drive via Sion-Panvel Highway -> Mumbai-Pune Expressway -> Khopoli exit -> Pali (90 km, 2 hrs)."
    );
    sanitized = sanitized.replace(/\(Mumbai CST\/Dadar\s*->\s*Kankavli\)/gi, "(Mumbai CSMT -> Khopoli / Nagothane)");
    sanitized = sanitized.replace(/drive from Kankavli to Pali/gi, "drive from Khopoli/Nagothane to Pali");
    sanitized = sanitized.replace(/Kankavli \(KKW\)/gi, "Nagothane (NGTN - 14 km) / Khopoli (38 km)");
    sanitized = sanitized.replace(/\bKankavli\b/gi, "Nagothane / Khopoli");
  } else if (isKhedTrek) {
    sanitized = sanitized.replace(/\(Mumbai CST\/Dadar\s*->\s*Kankavli\)/gi, "(Mumbai CSMT -> Khed (KHED))");
    sanitized = sanitized.replace(/Kankavli \(KKW\)[^,\n.]*/gi, "Khed (KHED - 25 km)");
    sanitized = sanitized.replace(/\bKankavli\b/gi, "Khed (KHED)");
  } else if (isPuneTrek) {
    sanitized = sanitized.replace(/\(Mumbai CST\/Dadar\s*->\s*Kankavli\)/gi, "(Mumbai -> Pune Junction (PUNE) or direct Expressway)");
    sanitized = sanitized.replace(/Kankavli \(KKW\)[^,\n.]*/gi, "Pune Junction (PUNE - 60 km)");
    sanitized = sanitized.replace(/\bKankavli\b/gi, "Pune Junction");
  } else if (isIgatpuriTrek) {
    sanitized = sanitized.replace(/\(Mumbai CST\/Dadar\s*->\s*Kankavli\)/gi, "(Mumbai CSMT -> Kasara / Igatpuri)");
    sanitized = sanitized.replace(/Kankavli \(KKW\)[^,\n.]*/gi, "Igatpuri (IGP - 32 km) / Kasara (60 km)");
    sanitized = sanitized.replace(/\bKankavli\b/gi, "Igatpuri / Kasara");
  } else if (isPanvelKarjatTrek) {
    sanitized = sanitized.replace(/\(Mumbai CST\/Dadar\s*->\s*Kankavli\)/gi, "(Mumbai CSMT -> Panvel / Karjat Suburban Local)");
    sanitized = sanitized.replace(/Kankavli \(KKW\)[^,\n.]*/gi, "Panvel (PNVL - 16 km) / Karjat (KJT)");
    sanitized = sanitized.replace(/\bKankavli\b/gi, "Panvel / Karjat");
  } else if (isLonavalaTrek) {
    sanitized = sanitized.replace(/\(Mumbai CST\/Dadar\s*->\s*Kankavli\)/gi, "(Mumbai CSMT -> Lonavala / Malavli)");
    sanitized = sanitized.replace(/Kankavli \(KKW\)[^,\n.]*/gi, "Malavli (MVL - 2 km) / Lonavala (10 km)");
    sanitized = sanitized.replace(/\bKankavli\b/gi, "Lonavala / Malavli");
  } else if (isRaigadFort) {
    sanitized = sanitized.replace(/Kankavli \(KKW\)[^,\n.]*/gi, "Mangaon (MNG - 45 km)");
    sanitized = sanitized.replace(/\bKankavli\b/gi, "Mangaon (MNG)");
  }

  // 2. Correct seafood hallucination for Sahyadri/Ghat/Pune treks
  const isGhatOrInlandTrek = isPuneTrek || isIgatpuriTrek || isPaliTrek || isPanvelKarjatTrek || isLonavalaTrek;
  if (isGhatOrInlandTrek) {
    sanitized = sanitized.replace(
      /Malvani fish curry with rice at a nearby dhaba/gi,
      "authentic rustic Maharashtrian meal (hot Pithla Bhakri with fiery Thecha & Gavran Chicken Rassa)"
    );
    sanitized = sanitized.replace(
      /Malvani fish curry with rice/gi,
      "hot Pithla Bhakri with fiery Thecha & Indrayani rice"
    );
    sanitized = sanitized.replace(
      /Malvani fish curry/gi,
      "hot Pithla Bhakri & fiery Thecha"
    );
    sanitized = sanitized.replace(
      /fish curry with rice/gi,
      "Pithla Bhakri with Indrayani rice"
    );
    sanitized = sanitized.replace(
      /seafood thali/gi,
      "Gavran chicken thali or rustic Pithla Bhakri"
    );
  }

  // 3. Correct impossible travel times from Velhe/Torna to Mumbai (210 km)
  sanitized = sanitized.replace(
    /02:45 PM\s*[-–]\s*Depart back to Mumbai \(auto-cab or train\)\.?/gi,
    "05:30 PM - Depart Velhe base by private cab or car via NH48 / Mumbai-Pune Expressway."
  );
  sanitized = sanitized.replace(
    /04:30 PM\s*[-–]\s*Arrive in Mumbai;? you'll be back in the city well before nightfall\.?/gi,
    "10:00 PM - Arrive back in Mumbai (210 km, ~4.5 hrs via Expressway) safe and refreshed."
  );
  sanitized = sanitized.replace(
    /\(auto-cab or train\)/gi,
    "(private cab or car via Mumbai-Pune Expressway)"
  );

  // 4. Correct base village hallucinations if any
  sanitized = sanitized.replace(/\bPanchgani\b/gi, "Velhe (वेल्हे, Pune)");
  sanitized = sanitized.replace(/\bKondivade\b/gi, "Velhe (वेल्हे, Pune)");

  // 5. Generic safeguard for all 59 treks: ensure no non-Sindhudurg trek gets Kankavli
  for (const [slug, transit] of Object.entries(TREK_TRANSIT_GATEWAYS)) {
    const slugKey = slug.replace(/-trek$/, "").replace(/-fort$/, "");
    if (combined.includes(slug) || combined.includes(slugKey)) {
      const isSouthSindhudurgTrek = slug.includes("sindhudurg") || slug.includes("vijaydurg") || slug.includes("devgad") || slug.includes("tarkarli") || slug.includes("malvan");
      if (!isSouthSindhudurgTrek && /kankavli/i.test(sanitized)) {
        sanitized = sanitized.replace(/Kankavli\s*\(KKW\)[^,\n.]*/gi, transit.nearestStation);
        sanitized = sanitized.replace(/\bKankavli\b/gi, transit.nearestStation);
      }
      break;
    }
  }

  return sanitized;
}
