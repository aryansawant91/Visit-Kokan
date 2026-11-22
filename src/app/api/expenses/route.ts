import { NextRequest, NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebaseAdmin";
import { isAuthorizedAdmin } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
  }

  try {
    const snap = await db.collection("expenses").get();
    const batchKey = req.nextUrl.searchParams.get("batchKey");
    let expenses = snap.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (batchKey) {
      expenses = expenses.filter((e: any) => e.batchKey === batchKey);
    }
    return NextResponse.json(expenses);
  } catch (err: any) {
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
    const expense = {
      description: body.description,
      amount: Number(body.amount),
      category: body.category || "general",
      trekId: body.trekId || null,
      trekName: body.trekName || null,
      batchKey: body.batchKey || null,
      batchName: body.batchName || null,
      date: body.date || now,
      createdAt: now,
    };
    const ref = await db.collection("expenses").add(expense);
    return NextResponse.json({ id: ref.id, ...expense }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
  }

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await db.collection("expenses").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
