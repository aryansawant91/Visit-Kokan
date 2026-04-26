import { NextRequest, NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebaseAdmin";

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
      .sort((a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    return NextResponse.json(destinations);
  } catch (err: any) {
    console.error("Destinations GET error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const now = new Date().toISOString();

    const destination = {
      ...body,
      approved: true,   // admin-only feature — always approved immediately
      featured: false,
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
  try {
    const { id, featured } = await req.json();

    await db.collection("destinations").doc(id).update({
      featured,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Destinations PATCH error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await db.collection("destinations").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Destinations DELETE error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}