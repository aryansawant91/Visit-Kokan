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

REAL KONKAN RAILWAY TRAIN TIMINGS:
${trainInfo || "No train data available"}

REAL ROAD ROUTES FROM MAJOR CITIES:
${roadInfo || "No road data available"}
================================================================================================
`;
}
