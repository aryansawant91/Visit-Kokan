import { NextRequest, NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebaseAdmin";

function isAuthorizedAdmin(req: NextRequest): boolean {
  try {
    const cookie = req.cookies.get("vk_session")?.value;
    if (cookie) {
      const session = JSON.parse(cookie);
      if (session?.role === "admin") return true;
    }
  } catch {}
  return false;
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  const all = req.nextUrl.searchParams.get("all");

  try {
    if (slug) {
      const snap = await db
        .collection("destinations")
        .where("slug", "==", slug)
        .where("approved", "==", true)
        .limit(1)
        .get();

      if (snap.empty) return NextResponse.json(null, { status: 404 });
      const doc = snap.docs[0];
      return NextResponse.json({ id: doc.id, ...doc.data() });
    }

    // admin=all fetches everything regardless of approval
    const query = all === "true"
      ? db.collection("destinations").get()
      : db.collection("destinations").where("approved", "==", true).get();

    const snap = await query;
    const destinations = snap.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a: any, b: any) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

    return NextResponse.json(destinations);
  } catch (err: any) {
    console.error("Destinations GET error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const now = new Date().toISOString();

    const destination = {
      ...body,
      approved: true,   // admin-only feature — always approved immediately
      featured: Boolean(body.featured),
      createdAt: now,
      updatedAt: now,
    };

    const ref = await db.collection("destinations").add(destination);
    return NextResponse.json({ id: ref.id, ...destination }, { status: 201 });
  } catch (err: any) {
    console.error("Destinations POST error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id, featured, approved } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };
    if (typeof featured !== "undefined") updateData.featured = featured;
    if (typeof approved !== "undefined") updateData.approved = approved;

    await db.collection("destinations").doc(id).update(updateData);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Destinations PATCH error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
  }

  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    await db.collection("destinations").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Destinations DELETE error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
