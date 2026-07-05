import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function GET(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get("uid");
  if (!uid) return NextResponse.json([], { status: 400 });
  const snap = await adminDb
    .collection("users").doc(uid)
    .collection("addresses")
    .orderBy("createdAt", "desc")
    .get();
  return NextResponse.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
}

export async function POST(req: NextRequest) {
  try {
    const { uid, address } = await req.json();
    if (!uid || !address) return NextResponse.json({ error: "Missing data" }, { status: 400 });

    const ref  = adminDb.collection("users").doc(uid).collection("addresses");
    const snap = await ref.get();

    // If first address, mark as default
    const isDefault = snap.empty;
    const docRef = await ref.add({
      ...address,
      isDefault,
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json({ id: docRef.id, ...address, isDefault });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { uid, addressId, updates } = await req.json();
    if (!uid || !addressId) return NextResponse.json({ error: "Missing data" }, { status: 400 });

    const ref = adminDb.collection("users").doc(uid).collection("addresses");

    // If setting as default, unset all others first
    if (updates.isDefault) {
      const snap = await ref.get();
      const batch = adminDb.batch();
      snap.docs.forEach(d => batch.update(d.ref, { isDefault: false }));
      await batch.commit();
    }

    await ref.doc(addressId).update({ ...updates, updatedAt: new Date().toISOString() });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { uid, addressId } = await req.json();
    await adminDb.collection("users").doc(uid).collection("addresses").doc(addressId).delete();
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}