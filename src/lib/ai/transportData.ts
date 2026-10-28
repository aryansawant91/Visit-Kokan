import { adminDb } from "@/lib/firebaseAdmin";

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

// Fetch all trains
export async function getAllTrains(): Promise<Train[]> {
  try {
    if (!adminDb) return [];
    const snapshot = await adminDb.collection("trains").get();
    return snapshot.docs.map((d) => d.data() as Train);
  } catch (error) {
    console.error("❌ Failed to fetch trains from Firestore:", error);
    return [];
  }
}

// Fetch all road routes
export async function getAllRoads(): Promise<Road[]> {
  try {
    if (!adminDb) return [];
    const snapshot = await adminDb.collection("routes").get();
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
  * Nearest Station: Mangaon (MNG) (approx 45 km, 1 hr by auto/cab to Raigad base). NEVER USE Kankavli (which is 350 km south in Sindhudurg)!
  * Jan Shatabdi Express (12051): CSMT dep 05:25 -> Mangaon arr 08:05 (duration 2h 40m, Fare: ₹120 2S / ₹380 CC). Ideal for 1-day or weekend trip!
  * Tutari Express (10103): CSMT dep 23:05 -> Mangaon arr 02:10 (duration 3h 05m, Fare: ₹160 SL / ₹500 3AC).
  * Road: Mumbai to Raigad Fort via NH66 (140 km, 3.5 hrs via Vadkhal-Mangaon-Mahad-Pachad).
- Alibaug / Mandwa / Nagaon / Kashid / Kihim:
  * Gateway: Ferry from Gateway of India to Mandwa Jetty (1 hr, ₹250) then 20 min local auto/bus, OR Road via NH66 (95 km, 2.5-3 hrs). NO direct railway station!
- Murud-Janjira:
  * Nearest Station: Roha (ROHA) (approx 40 km) or Mangaon. Or Road via Alibaug (165 km, 3.5-4 hrs).
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
- Devgad / Vijaydurg / Kunkeshwar:
  * Nearest Station: Kankavli (KKW) (approx 45-50 km).
  * Tutari Express: arr Kankavli 07:30. Jan Shatabdi: arr Kankavli 13:55.
- Malvan / Tarkarli / Sindhudurg Fort / Devbag:
  * Nearest Station: Kankavli (KKW) (48 km) or Kudal (KUDL) (45 km).
  * Tutari Express: arr Kankavli 07:30 / arr Kudal 08:15 (Fare: ₹450 SL / ₹1,200 3AC).
  * Jan Shatabdi: arr Kankavli 13:55 / arr Kudal 14:35.
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
