import { adminDb } from "@/lib/firebaseAdmin";
import { db } from "@/lib/firestore";
import { collection, getDocs } from "firebase/firestore";

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
- Raigad Fort / Mahad / Pachad:
  * Nearest Station: Mangaon (MNG) (approx 45 km, 1 hr by auto/cab to Raigad base at Pachad). NEVER USE Kankavli (which is 350 km south in Sindhudurg)!
  * Jan Shatabdi Express (12051): CSMT dep 05:25 -> Mangaon arr 08:05 (duration 2h 40m, Fare: ₹120 2S / ₹380 CC). Ideal for 1-day or weekend trip!
  * Tutari Express (10103): CSMT dep 23:05 -> Mangaon arr 02:10 (duration 3h 05m, Fare: ₹160 SL / ₹500 3AC).
  * Road: Mumbai to Raigad Fort via NH66 (140 km, 3.5 hrs via Vadkhal-Mangaon-Mahad-Pachad).
  * REALISTIC PACING FOR RAIGAD FORT (CRITICAL):
    - Hill fort at 2,700 ft with 1,737 steep stone steps. Climb takes 2.5-3.5 hrs. Descent takes 1.5-2 hrs.
    - Raigad Ropeway operates 8:00 AM – 5:00 PM (Queue wait is 30–60 mins on weekends, ride is 5 mins).
    - Exploring the vast fort top (Maha Darwaja, Nagarkhana, Rajbhavan, Takmak Tok, Jagdishwar Temple, Shivaji Samadhi) takes MINIMUM 3.5 to 4.5 hours!
    - Total time spent at the fort must be 5 to 6.5 hours. NEVER schedule fort descent after only 1-2 hours or at 11:00 AM!
    - For night arrival (Tutari arr Mangaon 02:10 AM): Travelers rest at Mangaon/Pachad base room till dawn (5:30 AM), start climbing around 06:00 AM in cool weather, reach top ~08:30-09:00 AM, explore till 01:30 PM, have lunch on top, and descend around 02:30-04:00 PM.
- Alibaug / Mandwa / Nagaon / Kashid / Kihim:
  * Gateway: Ferry from Gateway of India to Mandwa Jetty (1 hr, ₹250) then 20 min local auto/bus, OR Road via NH66 (95 km, 2.5-3 hrs). NO direct railway station!
- Murud-Janjira:
  * Nearest Station: Roha (ROHA) (approx 40 km) or Mangaon. Or Road via Alibaug (165 km, 3.5-4 hrs).
  * Realistic Pacing: Sailboat ferry from Rajapuri jetty + boat wait + exploring island fort takes 3 to 3.5 hours.
- Dapoli / Harnai / Anjarle / Velas:
  * Nearest Station: Khed (KHED) (approx 30 km).
  * Tutari Express: arr Khed 03:30 (Fare: ₹220 SL / ₹600 3AC).
  * Jan Shatabdi: arr Khed 09:20 (Fare: ₹160 2S / ₹480 CC).
- Chiplun / Guhagar / Parshuram:
  * Nearest Station: Chiplun (CHI).
  * Tutari Express: arr Chiplun 04:45. Jan Shatabdi: arr Chiplun 10:20.
- Ganpatipule / Ratnagiri / Jaigad:
  * Nearest Station: Ratnagiri (RN) (Ganpatipule is 28 km).
  * Tutari Express: arr Ratnagiri 06:15. Jan Shatabdi: arr Ratnagiri 11:45 (Fare: ₹330 SL / ₹900 3AC).
  * Realistic Pacing: Ganpatipule Mandir Darshan + Pradakshina + beach relaxation takes 3 hours.
- Devgad / Vijaydurg / Kunkeshwar:
  * Nearest Station: Kankavli (KKW) (approx 45-50 km).
  * Tutari Express: arr Kankavli 07:30. Jan Shatabdi: arr Kankavli 13:55.
- Malvan / Tarkarli / Sindhudurg Fort / Devbag:
  * Nearest Station: Kankavli (KKW) (48 km) or Kudal (KUDL) (45 km).
  * Tutari Express: arr Kankavli 07:30 / arr Kudal 08:15 (Fare: ₹450 SL / ₹1,200 3AC).
  * Jan Shatabdi: arr Kankavli 13:55 / arr Kudal 14:35.
  * Realistic Pacing: Scuba diving & watersports take 3.5 to 4.5 hours. Sindhudurg Fort ferry & visit takes 2.5 to 3 hours.
- Sawantwadi / Vengurla / Amboli:
  * Nearest Station: Sawantwadi Road (SWV).
  * Tutari Express: arr Sawantwadi 08:45. Jan Shatabdi: arr Sawantwadi 15:07.
`;

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
  if (!itinerary || !itinerary.transportSummary) return itinerary;
  const transport = itinerary.transportSummary;
  if (transport.type !== "train") return itinerary;

  const destContext = `${itinerary.title || ""} ${itinerary.subtitle || ""} ${contextText} ${transport.to || ""}`.toLowerCase();
  const trainName = `${transport.name || ""} ${transport.number || ""}`.toLowerCase();

  const isSindhudurg = destContext.includes("kankavli") || destContext.includes("kudal") || destContext.includes("malvan") || destContext.includes("tarkarli") || destContext.includes("sindhudurg") || destContext.includes("vengurla") || destContext.includes("devbag");
  const isRatnagiri = !isSindhudurg && (destContext.includes("ratnagiri") || destContext.includes("ganpatipule") || destContext.includes("jaigad") || destContext.includes("pawas"));
  const isChiplun = !isSindhudurg && !isRatnagiri && (destContext.includes("chiplun") || destContext.includes("guhagar") || destContext.includes("velneshwar"));
  const isKhed = !isSindhudurg && !isRatnagiri && !isChiplun && (destContext.includes("khed") || destContext.includes("dapoli") || destContext.includes("harnai") || destContext.includes("anjarle"));
  const isRaigad = !isSindhudurg && !isRatnagiri && !isChiplun && !isKhed && (destContext.includes("raigad") || destContext.includes("mangaon") || destContext.includes("mahad") || destContext.includes("pachad"));
  const isSawantwadi = !isSindhudurg && (destContext.includes("sawantwadi") || destContext.includes("amboli"));

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
        if (stop1.time && (stop1.time.includes("08:") || stop1.time.includes("8:"))) {
          stop1.time = "01:55 PM";
          stop1.description = `Arrive at Kankavli via Jan Shatabdi Express (12051) at 01:55 PM. Cab to Malvan/Tarkarli (48 km, 1 hr).`;
        }
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
        if (stop1.time && (stop1.time.includes("08:05") || stop1.time.includes("13:55"))) {
          stop1.time = "07:30 AM";
          stop1.description = `Arrive at Kankavli via Tutari Express (10103) at 07:30 AM. Board local auto/cab to Malvan/Tarkarli (48 km, 1 hr).`;
        }
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
