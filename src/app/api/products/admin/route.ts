import { NextRequest, NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebaseAdmin";

// GET — all products (no filter, admin sees everything)
export async function GET() {
  try {
    const snap = await db
      .collection("products")
      .orderBy("createdAt", "desc")
      .get();

    const products = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(products);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// PATCH — approve / reject / edit
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

// DELETE — permanent delete
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