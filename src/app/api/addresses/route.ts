import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

function getSession(req: NextRequest): { uid?: string; role?: string } | null {
  try {
    const cookie = req.cookies.get("vk_session")?.value;
    if (cookie) {
      return JSON.parse(cookie);
    }
  } catch {}
  return null;
}

function isValidUid(uid: unknown): uid is string {
  return typeof uid === "string" && /^[a-zA-Z0-9_\-\.]{1,128}$/.test(uid);
}

export async function GET(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get("uid");
  if (!isValidUid(uid)) return NextResponse.json([], { status: 400 });

  const session = getSession(req);
  if (session?.uid && session.role !== "admin" && session.uid !== uid) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

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
    if (!isValidUid(uid) || !address) return NextResponse.json({ error: "Missing data" }, { status: 400 });

    const session = getSession(req);
    if (session?.uid && session.role !== "admin" && session.uid !== uid) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

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
    if (!isValidUid(uid) || !addressId) return NextResponse.json({ error: "Missing data" }, { status: 400 });

    const session = getSession(req);
    if (session?.uid && session.role !== "admin" && session.uid !== uid) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

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
    if (!isValidUid(uid) || !addressId) return NextResponse.json({ error: "Missing data" }, { status: 400 });

    const session = getSession(req);
    if (session?.uid && session.role !== "admin" && session.uid !== uid) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await adminDb.collection("users").doc(uid).collection("addresses").doc(addressId).delete();
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
