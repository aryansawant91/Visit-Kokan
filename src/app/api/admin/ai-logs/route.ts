import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { isAuthorizedAdmin } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
  }

  try {
    const snap = await adminDb
      .collection("ai_chat_logs")
      .orderBy("createdAt", "desc")
      .limit(200)
      .get();

    const logs = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ logs });
  } catch (err: any) {
    console.error("AI Logs GET error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
  }

  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Log id is required" }, { status: 400 });
    }
    await adminDb.collection("ai_chat_logs").doc(id).delete();
    return NextResponse.json({ deleted: true });
  } catch (err: any) {
    console.error("AI Logs DELETE error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
