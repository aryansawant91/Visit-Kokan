import { NextRequest, NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebaseAdmin";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  const all  = req.nextUrl.searchParams.get("all");

  try {
    if (slug) {
      const snap = await db
        .collection("treks")
        .where("slug", "==", slug)
        .where("approved", "==", true)
        .limit(1)
        .get();

      if (snap.empty) return NextResponse.json(null, { status: 404 });
      const doc = snap.docs[0];
      return NextResponse.json({ id: doc.id, ...doc.data() });
    }

    const query = all === "true"
      ? db.collection("treks").get()
      : db.collection("treks").where("approved", "==", true).get();

    const snap = await query;
    const treks = snap.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    return NextResponse.json(treks);
  } catch (err: any) {
    console.error("Treks GET error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const now  = new Date().toISOString();

    const trek = {
      ...body,
      approved: true,
      featured: false,
      createdAt: now,
      updatedAt: now,
    };

    const ref = await db.collection("treks").add(trek);
    return NextResponse.json({ id: ref.id, ...trek }, { status: 201 });
  } catch (err: any) {
    console.error("Treks POST error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Missing id" },
        { status: 400 }
      );
    }

    await db.collection("treks").doc(id).update({
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await db.collection("treks").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}