import { NextRequest, NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebaseAdmin";
import { isAuthorizedAdmin } from "@/lib/apiAuth";

export interface SocialMediaPost {
  id: string;
  title: string;
  platform: "instagram" | "facebook" | "youtube" | "whatsapp" | "other";
  postType: "reel" | "post" | "carousel" | "story" | "video" | "status";
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  caption: string;
  hashtags: string;
  mediaUrl?: string;
  status: "draft" | "scheduled" | "published";
  targetTrek?: string;
  assignedTo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const DEFAULT_POSTS: Omit<SocialMediaPost, "id">[] = [
  {
    title: "Kalsubai Peak Sunrise Reel 🌅",
    platform: "instagram",
    postType: "reel",
    scheduledDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
    scheduledTime: "18:30",
    caption:
      "Standing above the clouds at 5,400 ft! ☁️✨ The sunrise from Maharashtra's highest peak is pure magic. Next weekend batch is live — book your slot before the bus fills up! 🥾⛰️",
    hashtags: "#KalsubaiPeak #SahyadriTreks #VisitKokan #MaharashtraTreks #SunriseTrek #TrekWithUs #WeekendEscape",
    status: "scheduled",
    targetTrek: "Kalsubai Peak Sunrise Trek",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    title: "Top 5 Waterfall Treks in Kokan 💦",
    platform: "instagram",
    postType: "carousel",
    scheduledDate: new Date(Date.now() + 86400000 * 4).toISOString().split("T")[0],
    scheduledTime: "12:00",
    caption:
      "Swipe to find your next weekend escape! 🌊 From Devkund's turquoise plunge pool to secret Western Ghat cascades. Which one are you adding to your wishlist? Save this for your weekend planning! 📌",
    hashtags: "#DevkundWaterfall #KokanTourism #WaterfallTreks #MonsoonVibes #MaharashtraTourism #WeekendGetaway",
    status: "scheduled",
    targetTrek: "Devkund Secret Waterfall Trek",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    title: "Harihar Fort Vertical Rock Stairs Video 🧗",
    platform: "youtube",
    postType: "video",
    scheduledDate: new Date(Date.now() + 86400000 * 7).toISOString().split("T")[0],
    scheduledTime: "19:00",
    caption:
      "Conquering the thrilling 80-degree stone-cut stairs of Harihar Fort! Full guide on difficulty, best season, bus pickups from Mumbai & Pune. Watch till the end for safety tips! 🎒",
    hashtags: "#HariharFort #SahyadriTrekkers #AdventureTravel #TrekDocumentary #VisitKokan",
    status: "draft",
    targetTrek: "Harihar Fort Adventure Trek",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    title: "Weekend Batch WhatsApp Broadcast Announcement 📢",
    platform: "whatsapp",
    postType: "status",
    scheduledDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    scheduledTime: "10:00",
    caption:
      "🚨 Alert: Only 6 seats left for this Saturday night departure! AC bus pickup from Borivali, Sion, Vashi & Panvel. Homecooked meals included. DM us to lock your group slot now! 🚌🥗",
    hashtags: "#WeekendTrek #VisitKokanGroup #BatchClosingSoon",
    status: "scheduled",
    targetTrek: "All Active Weekend Batches",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function GET(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
  }

  try {
    let posts: SocialMediaPost[] = [];

    if (db) {
      try {
        const snap = await db.collection("marketing_calendar").orderBy("scheduledDate", "asc").get();
        posts = snap.docs.map((d) => ({ id: d.id, ...d.data() } as SocialMediaPost));
      } catch {
        const snap = await db.collection("marketing_calendar").get();
        posts = snap.docs.map((d) => ({ id: d.id, ...d.data() } as SocialMediaPost));
      }
    }

    // If no posts yet, return defaults and optionally seed
    if (posts.length === 0) {
      posts = DEFAULT_POSTS.map((p, idx) => ({ id: `default_${idx + 1}`, ...p }));
      if (db) {
        try {
          const batch = db.batch();
          DEFAULT_POSTS.forEach((p) => {
            const ref = db.collection("marketing_calendar").doc();
            batch.set(ref, p);
          });
          await batch.commit();
        } catch {}
      }
    }

    return NextResponse.json({ success: true, posts });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("🔴 MARKETING CALENDAR GET ERROR:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      title,
      platform = "instagram",
      postType = "post",
      scheduledDate,
      scheduledTime = "12:00",
      caption = "",
      hashtags = "",
      mediaUrl = "",
      status = "scheduled",
      targetTrek = "",
      assignedTo = "",
      notes = "",
    } = body;

    if (!title || !scheduledDate) {
      return NextResponse.json({ error: "Title and scheduledDate are required" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const docData = {
      title: String(title).trim(),
      platform,
      postType,
      scheduledDate: String(scheduledDate).trim(),
      scheduledTime: String(scheduledTime).trim(),
      caption: String(caption).trim(),
      hashtags: String(hashtags).trim(),
      mediaUrl: String(mediaUrl).trim(),
      status,
      targetTrek: String(targetTrek).trim(),
      assignedTo: String(assignedTo).trim(),
      notes: String(notes).trim(),
      createdAt: now,
      updatedAt: now,
    };

    let id = `post_${Date.now()}`;
    if (db) {
      const ref = await db.collection("marketing_calendar").add(docData);
      id = ref.id;
    }

    return NextResponse.json({ success: true, id, post: { id, ...docData } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("🔴 MARKETING CALENDAR POST ERROR:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    if (db) {
      await db
        .collection("marketing_calendar")
        .doc(id)
        .update({
          ...updates,
          updatedAt: new Date().toISOString(),
        });
    }

    return NextResponse.json({ success: true, id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("🔴 MARKETING CALENDAR PATCH ERROR:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    if (db) {
      await db.collection("marketing_calendar").doc(id).delete();
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("🔴 MARKETING CALENDAR DELETE ERROR:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
