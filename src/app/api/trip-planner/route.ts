import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { adminDb as db } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

// ── Input ─────────────────────────────────────────────────────────────────────

const InputSchema = z.object({
    startDate: z.string().regex(/^(\d{4}-\d{2}-\d{2})?$/).default(""),
    days: z.coerce.number().int().min(1).max(7),
    persons: z.coerce.number().int().min(1).max(50),
    budget: z.enum(["budget", "medium", "luxury"]),
    interests: z.array(z.string()).max(12).default([]),
    region: z.enum(["all", "ratnagiri", "sindhudurg", "raigad"]).default("all"),
});
type Input = z.infer<typeof InputSchema>;
type Tier = Input["budget"];

// ── Firestore doc shapes (only the fields we use) ─────────────────────────────

interface Dest {
    id: string; slug: string; name: string;
    description?: string; shortDescription?: string;
    category?: string; region?: string;
    images?: string[]; coverImage?: string;
    highlights?: string[]; bestSeason?: string;
    featured?: boolean; rating?: number;
}
interface TrekDoc {
    id: string; slug: string; name: string;
    category?: string; region?: string; difficulty?: string;
    duration?: string; distance?: string;
    images?: string[]; highlights?: string[]; bestSeason?: string;
    price?: number; scheduledDate?: string | null; featured?: boolean;
}

// ── Output shapes ─────────────────────────────────────────────────────────────

interface PlanStop {
    kind: "destination" | "trek";
    slot: string;
    name: string;
    href: string;
    image: string | null;
    tag: string;
    blurb: string;
    extras?: string[];
    price?: string;
    note?: string;
    bookable?: boolean;
}
interface PlanDay {
    day: number;
    date: string | null;
    title: string;
    area: string;
    notes: string[];
    stops: PlanStop[];
    stay: { area: string; type: string; estimate: string; note?: string } | null;
    food: { estimate: string; hints: string[] };
}

// ── Approximate prices (EDIT THESE to match real Kokan rates) ─────────────────

type Range = [number, number];

const STAY_PER_ROOM_NIGHT: Record<Tier, Range> = {
    budget: [1200, 2000],
    medium: [2500, 4500],
    luxury: [6000, 12000],
};
const STAY_TYPE: Record<Tier, string> = {
    budget: "Homestay or basic lodge",
    medium: "Mid-range hotel or beach cottage",
    luxury: "Resort or premium stay",
};
const FOOD_PER_PERSON_DAY: Record<Tier, Range> = {
    budget: [500, 800],
    medium: [800, 1400],
    luxury: [1500, 2500],
};
const TRANSPORT_PER_VEHICLE_DAY: Record<Tier, Range> = {
    budget: [800, 1200],
    medium: [1200, 2000],
    luxury: [2000, 3500],
};

// ── Districts ─────────────────────────────────────────────────────────────────

type District = "raigad" | "ratnagiri" | "sindhudurg";
const DISTRICT_ORDER: District[] = ["raigad", "ratnagiri", "sindhudurg"]; // north → south
const DISTRICT_LABEL: Record<District, string> = {
    raigad: "Raigad", ratnagiri: "Ratnagiri", sindhudurg: "Sindhudurg",
};
const DISTRICT_KEYWORDS: Record<District, string[]> = {
    raigad: ["raigad", "alibaug", "murud", "kashid", "harihareshwar", "shrivardhan", "srivardhan", "mahad", "roha", "diveagar", "revdanda"],
    ratnagiri: ["ratnagiri", "dapoli", "guhagar", "ganpatipule", "chiplun", "anjarle", "velneshwar", "ladghar"],
    sindhudurg: ["sindhudurg", "vengurla", "malvan", "tarkarli", "sawantwadi", "amboli", "kudal", "devgad"],
};
const FOOD_HINTS: Record<District, string[]> = {
    raigad: ["Fresh fish and prawn thali", "Coastal seafood at beachside eateries"],
    ratnagiri: ["Alphonso mangoes (in season Apr–Jun)", "Kokum sherbet and sol kadhi", "Fish thali"],
    sindhudurg: ["Malvani fish curry thali", "Sol kadhi", "Kombdi vade"],
};

function toDistrict(text?: string): District | null {
    const t = (text ?? "").toLowerCase();
    if (!t) return null;
    for (const d of DISTRICT_ORDER) {
        if (DISTRICT_KEYWORDS[d].some((k) => t.includes(k))) return d;
    }
    return null;
}
function districtOf(x: { region?: string; name?: string }): District | null {
    return toDistrict(x.region) ?? toDistrict(x.name);
}
const dIdx = (d: District) => DISTRICT_ORDER.indexOf(d);

// ── Interest rules ────────────────────────────────────────────────────────────

interface Rule { destCats?: string[]; trekCats?: string[]; keywords?: string[] }
const RULES: Record<string, Rule> = {
    Beaches: { destCats: ["beach"], keywords: ["beach"] },
    Trekking: {},
    Food: { keywords: ["cuisine", "seafood", "mango", "cashew", "spice", "food"] },
    History: { destCats: ["fort"], trekCats: ["fort"], keywords: ["fort", "palace", "museum"] },
    Nature: {
        destCats: ["waterfall", "village", "island"],
        trekCats: ["forest", "waterfall", "village", "coastal"],
        keywords: ["wildlife", "orchard", "backwater", "bird", "forest", "mist", "reef"],
    },
    "Water Sports": { keywords: ["water sport", "scuba", "snorkel", "boat", "dolphin", "diving"] },
    Photography: { keywords: ["sunset", "sunrise", "view", "palace", "cliff"] },
    Temples: { destCats: ["temple"], keywords: ["temple"] },
};

// ── Small helpers ─────────────────────────────────────────────────────────────

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_KEYS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const rangeLabel = (r: Range) => `${inr(r[0])}–${inr(r[1])}`;
const truncate = (t: string | undefined, max: number) =>
    !t ? "" : t.length > max ? t.slice(0, max - 1).trimEnd() + "…" : t;
const imgOf = (x: { images?: string[]; coverImage?: string }) => x.coverImage || x.images?.[0] || null;
const tagOf = (cat?: string, region?: string) => [cat ? cap(cat) : "", region ?? ""].filter(Boolean).join(" · ");

const fmtDate = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    return `${d} ${MONTH_NAMES[m - 1]} ${y}`;
};
const addDays = (iso: string, n: number) => {
    const d = new Date(`${iso}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
};
const diffDays = (a: string, b: string) =>
    Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000);

function normDate(v?: string | null): string | null {
    if (!v) return null;
    const m = /^(\d{4}-\d{2}-\d{2})/.exec(v);
    if (m) return m[1];
    const t = Date.parse(v);
    return isNaN(t) ? null : new Date(t).toISOString().slice(0, 10);
}

function hayOf(...parts: (string | string[] | undefined | null)[]): string {
    return parts.map((p) => (Array.isArray(p) ? p.join(" ") : p ?? "")).join(" ").toLowerCase();
}

function trekDaysOf(t: TrekDoc): number {
    const m = /(\d+)\s*day/i.exec(t.duration ?? "");
    return m ? Math.min(Number(m[1]), 7) : 1;
}

/** true = in season, false = out of season, null = unknown */
function seasonFit(season: string | undefined, month: number | null): boolean | null {
    if (month === null || !season) return null;
    const s = season.toLowerCase();
    if (s.includes("year") || s.includes("all season")) return true;
    const found: number[] = [];
    const re = /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*/gi;
    let mt: RegExpExecArray | null;
    while ((mt = re.exec(s)) !== null) found.push(MONTH_KEYS.indexOf(mt[1].toLowerCase()));
    if (found.length === 0) return null;
    const start = found[0];
    const end = found.length > 1 ? found[1] : found[0];
    return start <= end ? month >= start && month <= end : month >= start || month <= end;
}

// ── Planner ───────────────────────────────────────────────────────────────────

interface TrekPlacement {
    trek: TrekDoc;
    part: number;
    total: number;
    scheduledInRange: boolean;
    nextDate: string | null;
}

function buildPlan(input: Input, dests: Dest[], treks: TrekDoc[]) {
    const { days, persons, budget: tier, interests, region } = input;
    const startDate = input.startDate || null;
    const month = startDate ? Number(startDate.slice(5, 7)) - 1 : null;
    const today = new Date().toISOString().slice(0, 10);
    const wantTreks = interests.includes("Trekking");
    const rules = interests.map((i) => RULES[i]).filter((r): r is Rule => !!r);

    const inRegion = (x: { region?: string; name?: string }) =>
        region === "all" || districtOf(x) === region;
    // Items whose region we can't map are wildcards when planning "All of Konkan"
    const matches = (x: { region?: string; name?: string }, d: District) => {
        const dx = districtOf(x);
        return dx === d || (dx === null && region === "all");
    };
    const kwHit = (hay: string, r: Rule) => !!r.keywords && r.keywords.some((k) => hay.includes(k));

    // ── Scoring ──
    const scoreDest = (d: Dest) => {
        let s = (d.featured ? 1 : 0) + (d.rating ?? 0) * 0.2;
        const hay = hayOf(d.name, d.highlights);
        for (const r of rules) {
            if (r.destCats && r.destCats.indexOf(d.category ?? "") >= 0) s += 3;
            if (kwHit(hay, r)) s += 1.5;
        }
        const fit = seasonFit(d.bestSeason, month);
        if (fit === true) s += 2;
        else if (fit === false) s -= 3;
        return s;
    };
    const scoreTrek = (t: TrekDoc) => {
        let s = 3 + (t.featured ? 1 : 0);
        const hay = hayOf(t.name, t.highlights);
        for (const r of rules) {
            if (r.trekCats && r.trekCats.indexOf(t.category ?? "") >= 0) s += 2;
            if (kwHit(hay, r)) s += 1;
        }
        const fit = seasonFit(t.bestSeason, month);
        if (fit === true) s += 2;
        else if (fit === false) s -= 3;
        return s;
    };

    const destScored = dests.filter(inRegion).map((item) => ({ item, score: scoreDest(item) }));
    const trekScored = wantTreks ? treks.filter(inRegion).map((item) => ({ item, score: scoreTrek(item) })) : [];
    if (destScored.length === 0 && trekScored.length === 0) return null;

    // ── Pick base district ──
    const districts: District[] = region === "all" ? DISTRICT_ORDER : [region as District];
    const distScore = (d: District) => {
        const ds = destScored.filter((x) => matches(x.item, d)).map((x) => x.score).sort((a, b) => b - a);
        const ts = trekScored.filter((x) => matches(x.item, d)).map((x) => x.score);
        return ds.slice(0, days).reduce((a, b) => a + b, 0) + ts.reduce((a, b) => Math.max(a, b), 0);
    };
    const base = districts.reduce((best, d) => (distScore(d) > distScore(best) ? d : best), districts[0]);
    const ordered = districts.slice().sort(
        (a, b) => Math.abs(dIdx(a) - dIdx(base)) - Math.abs(dIdx(b) - dIdx(base)) || dIdx(a) - dIdx(b)
    );

    // ── Place treks ──
    const slots: (TrekPlacement | null)[] = new Array<TrekPlacement | null>(days).fill(null);
    const trekTarget = wantTreks ? (days === 1 ? 1 : Math.min(days >= 4 ? 2 : 1, days - 1)) : 0;

    const trekInfo = trekScored
        .map(({ item, score }) => {
            const sd = normDate(item.scheduledDate);
            const upcoming = sd && sd >= today ? sd : null;
            const at = upcoming && startDate ? diffDays(startDate, upcoming) : null;
            const inRange = at !== null && at >= 0 && at < days;
            const dd = districtOf(item) ?? base;
            return {
                item, score, upcoming, at, inRange,
                tdays: trekDaysOf(item),
                dist: Math.abs(dIdx(dd) - dIdx(base)),
            };
        })
        .sort((a, b) => Number(b.inRange) - Number(a.inRange) || a.dist - b.dist || b.score - a.score);

    const freeRun = (start: number, len: number) => {
        if (start < 0 || start + len > days) return false;
        for (let k = 0; k < len; k++) if (slots[start + k]) return false;
        return true;
    };
    const mid: number[] = [];
    const edge: number[] = [];
    for (let i = 0; i < days; i++) (days >= 3 && (i === 0 || i === days - 1) ? edge : mid).push(i);
    const prefOrder = mid.concat(edge);

    let placed = 0;
    for (const t of trekInfo) {
        if (placed >= trekTarget) break;
        if (t.tdays > days) continue;
        let start = -1;
        if (t.inRange) {
            if (freeRun(t.at as number, t.tdays)) start = t.at as number;
            else continue;
        } else {
            for (const s of prefOrder) {
                if (freeRun(s, t.tdays)) { start = s; break; }
            }
        }
        if (start < 0) continue;
        for (let k = 0; k < t.tdays; k++) {
            slots[start + k] = {
                trek: t.item, part: k + 1, total: t.tdays,
                scheduledInRange: t.inRange, nextDate: t.upcoming,
            };
        }
        placed++;
    }

    // ── Fill remaining days with destinations ──
    const freeIdx: number[] = [];
    slots.forEach((s, i) => { if (!s) freeIdx.push(i); });

    const taken = new Set<string>();
    const pool: { item: Dest; score: number }[] = [];
    for (const d of ordered) {
        destScored
            .filter((x) => matches(x.item, d) && !taken.has(x.item.id))
            .sort((a, b) => b.score - a.score)
            .forEach((x) => { taken.add(x.item.id); pool.push(x); });
    }
    const chosen = pool
        .slice(0, freeIdx.length)
        .sort((a, b) => dIdx(districtOf(a.item) ?? base) - dIdx(districtOf(b.item) ?? base));
    const destAt: Record<number, Dest | undefined> = {};
    freeIdx.forEach((slot, n) => { destAt[slot] = chosen[n] ? chosen[n].item : undefined; });

    // ── Build days ──
    const warnings: string[] = [];
    const planDays: PlanDay[] = [];
    const visited: District[] = [];
    const rooms = Math.ceil(persons / 2);
    const vehicles = Math.ceil(persons / 4);
    let trekCost = 0, nightsPaid = 0, foodDays = 0;
    let prevAnchor: District = base;
    let usedTrek = false;

    for (let i = 0; i < days; i++) {
        const date = startDate ? addDays(startDate, i) : null;
        const slot = slots[i];
        const dest = destAt[i];
        const stops: PlanStop[] = [];
        const notes: string[] = [];
        let title = "";
        let area = "";
        let placeName = "";
        let anchor: District = prevAnchor;

        if (slot) {
            usedTrek = true;
            const t = slot.trek;
            anchor = districtOf(t) ?? prevAnchor;
            placeName = t.region || t.name;
            title = slot.total > 1 ? `${t.name} — Day ${slot.part} of ${slot.total}` : t.name;
            area = t.region ?? "";

            let note: string | undefined;
            let bookable = false;
            if (slot.part === 1) {
                if (slot.scheduledInRange && slot.nextDate) {
                    note = `Batch scheduled on ${fmtDate(slot.nextDate)} — you can book now`;
                    bookable = true;
                } else if (slot.nextDate) {
                    note = `Next scheduled batch: ${fmtDate(slot.nextDate)}`;
                    if (startDate) warnings.push(`${t.name} has its next batch on ${fmtDate(slot.nextDate)}, outside your travel dates. Shift your dates to join it.`);
                } else {
                    note = "No batch scheduled yet — open the trek page to get notified or enquire for a private group";
                    if (startDate) warnings.push(`${t.name} has no scheduled batch yet, so it can't be booked for your dates right now.`);
                }
                trekCost += (t.price ?? 0) * persons;
            } else {
                note = "Continuation of your trek";
            }
            const meta = [t.difficulty ? cap(t.difficulty) : "", t.duration ?? "", t.distance ?? ""].filter(Boolean).join(" · ");
            stops.push({
                kind: "trek", slot: slot.part === 1 ? "Morning" : "All day",
                name: t.name, href: `/treks/${t.slug}`, image: imgOf(t),
                tag: tagOf(t.category, t.region),
                blurb: meta,
                extras: (t.highlights ?? []).slice(0, 4),
                price: slot.part === 1 && t.price ? `${inr(t.price)} per person` : undefined,
                note, bookable: slot.part === 1 ? bookable : undefined,
            });
            if (seasonFit(t.bestSeason, month) === false) {
                notes.push(`This trek is best done ${t.bestSeason}`);
                warnings.push(`${t.name} is best done ${t.bestSeason} — conditions may be tough on your dates.`);
            }
            notes.push("Carry water and wear proper trekking shoes.");
        } else if (dest) {
            anchor = districtOf(dest) ?? prevAnchor;
            placeName = dest.name;
            title = dest.name;
            area = dest.region ?? "";
            stops.push({
                kind: "destination", slot: "Day plan",
                name: dest.name, href: `/destinations/${dest.slug}`, image: imgOf(dest),
                tag: tagOf(dest.category, dest.region),
                blurb: dest.shortDescription || truncate(dest.description, 170),
                extras: (dest.highlights ?? []).slice(0, 5),
            });
            if (seasonFit(dest.bestSeason, month) === false) {
                notes.push(`Best visited ${dest.bestSeason}`);
                warnings.push(`${dest.name} is best visited ${dest.bestSeason}, so it may not be at its best on your dates.`);
            }
        } else {
            anchor = prevAnchor;
            placeName = DISTRICT_LABEL[anchor];
            title = "Leisure day";
            area = DISTRICT_LABEL[anchor];
            notes.push("Free day — relax, revisit a favourite spot, or shop for local specialities.");
        }
        prevAnchor = anchor;
        if (visited.indexOf(anchor) < 0) visited.push(anchor);

        // ── Stay (approximate) ──
        const isLast = i === days - 1;
        let stay: PlanDay["stay"] = null;
        if (!isLast) {
            if (slot && slot.part < slot.total) {
                stay = {
                    area: "On the trek",
                    type: "Overnight is part of the trek",
                    estimate: "Check the trek page for what's covered",
                };
            } else {
                nightsPaid++;
                stay = {
                    area: `Near ${placeName}`,
                    type: STAY_TYPE[tier],
                    estimate: `${rangeLabel(STAY_PER_ROOM_NIGHT[tier])} per room per night`,
                    note: rooms > 1 ? `${rooms} rooms assumed for ${persons} travellers` : undefined,
                };
            }
        }

        // ── Food (approximate) ──
        let food: PlanDay["food"];
        if (slot) {
            food = { estimate: "Meals on the trek are covered by the trek price", hints: [] };
        } else {
            foodDays++;
            food = {
                estimate: `${rangeLabel(FOOD_PER_PERSON_DAY[tier])} per person`,
                hints: FOOD_HINTS[anchor],
            };
        }

        if (i === 0 && days > 1) notes.unshift("Arrive, check in and ease into the trip.");
        if (i === 0 && days === 1) notes.unshift("Day trip — start early to make the most of it.");
        if (isLast && days > 1) notes.push("Check out in the morning and head home after your last stop.");

        planDays.push({ day: i + 1, date, title, area, notes, stops, stay, food });
    }

    // ── Budget (ranges) ──
    const items: { label: string; min: number; max: number }[] = [];
    const sR = STAY_PER_ROOM_NIGHT[tier];
    const fR = FOOD_PER_PERSON_DAY[tier];
    const tR = TRANSPORT_PER_VEHICLE_DAY[tier];

    if (nightsPaid > 0) {
        items.push({
            label: `Stay (${nightsPaid} night${nightsPaid > 1 ? "s" : ""}, ${rooms} room${rooms > 1 ? "s" : ""})`,
            min: nightsPaid * rooms * sR[0], max: nightsPaid * rooms * sR[1],
        });
    }
    if (foodDays > 0) {
        items.push({
            label: `Food (${foodDays} day${foodDays > 1 ? "s" : ""})`,
            min: foodDays * persons * fR[0], max: foodDays * persons * fR[1],
        });
    }
    items.push({
        label: `Local transport (${vehicles} vehicle${vehicles > 1 ? "s" : ""}, ${days} day${days > 1 ? "s" : ""})`,
        min: days * vehicles * tR[0], max: days * vehicles * tR[1],
    });
    if (trekCost > 0) items.push({ label: "Treks (exact price)", min: trekCost, max: trekCost });

    const totalMin = items.reduce((s, x) => s + x.min, 0);
    const totalMax = items.reduce((s, x) => s + x.max, 0);

    // ── Tips ──
    const tips: string[] = [];
    if (month !== null) {
        if (month >= 5 && month <= 8) tips.push("Monsoon (Jun–Sep): beach water sports are usually shut, but waterfalls and forts are at their greenest. Carry rain gear.");
        else if (month >= 10 || month === 0) tips.push("Peak season (Nov–Jan): book stays well in advance, as prices rise and rooms fill up fast.");
        else if (month === 3 || month === 4) tips.push("Summer (Apr–May): it's hot and humid — plan outings for early morning and evening. It's also Alphonso mango season.");
    } else {
        tips.push("Add a start date to get season warnings and see which treks have a batch on your dates.");
    }
    tips.push("Stay and food prices here are approximate — confirm rates before booking.");
    tips.push("Carry some cash — many local spots don't accept cards.");
    tips.push("Renting a local vehicle gives you the most flexibility between stops.");
    if (usedTrek) tips.push("Start treks early to avoid the afternoon heat.");

    const areas = visited.map((d) => DISTRICT_LABEL[d]);
    const summary =
        `A ${days}-day ${areas.join(" & ")} itinerary for ${persons} ${persons === 1 ? "traveller" : "travellers"}` +
        (interests.length ? `, focused on ${interests.join(", ")}.` : ".");

    return {
        summary,
        startDate,
        endDate: startDate ? addDays(startDate, days - 1) : null,
        areas,
        days: planDays,
        budget: {
            items,
            totalMin,
            totalMax,
            perPersonMin: Math.round(totalMin / persons),
            perPersonMax: Math.round(totalMax / persons),
            note: "Approximate estimate. Stay, food and local transport use typical ranges for your budget level and vary by season and property; trek prices are exact. Excludes travel to/from Kokan, entry fees, activities and shopping.",
        },
        tips,
        warnings: warnings.filter((w, i) => warnings.indexOf(w) === i),
    };
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
    try {
        const raw = await req.json().catch(() => null);
        const parsed = InputSchema.safeParse(raw);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid trip details. Please check the form and try again." },
                { status: 400 }
            );
        }

        const [dSnap, tSnap] = await Promise.all([
            db.collection("destinations").where("approved", "==", true).get(),
            db.collection("treks").where("approved", "==", true).get(),
        ]);

        const dests = dSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as Dest);
        const treks = tSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as TrekDoc);

        const plan = buildPlan(parsed.data, dests, treks);
        if (!plan) {
            return NextResponse.json(
                { error: "We don't have places for that region yet. Try \"All of Konkan\"." },
                { status: 404 }
            );
        }
        return NextResponse.json(plan);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("Trip planner error:", message);
        return NextResponse.json({ error: "Could not build your plan. Please try again." }, { status: 500 });
    }
}