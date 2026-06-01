import { NextRequest, NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebaseAdmin";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  try {
    if (id) {
      const doc = await db.collection("products").doc(id).get();
      if (!doc.exists)
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json({ id: doc.id, ...doc.data() });
    }
    const snap = await db
      .collection("products")
      .orderBy("createdAt", "desc")
      .get();
    const products = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json(products);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    await db
      .collection("products")
      .doc(id)
      .update({ ...updates, updatedAt: new Date().toISOString() });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    await db.collection("products").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}