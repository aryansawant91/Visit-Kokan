import { NextRequest, NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebaseAdmin";
import { isAuthorizedAdmin } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
  }

  try {
    let leads: any[] = [];
    if (db) {
      try {
        const snap = await db.collection("trek_enquiries").orderBy("createdAt", "desc").get();
        leads = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      } catch {
        const snap = await db.collection("trek_enquiries").get();
        leads = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      }
    }

    // Sort in memory by createdAt desc
    leads.sort((a, b) => {
      const tA = new Date(a.createdAt || 0).getTime();
      const tB = new Date(b.createdAt || 0).getTime();
      return tB - tA;
    });

    const stats = {
      totalLeads: leads.length,
      pending: leads.filter((l) => !l.status || l.status === "pending").length,
      contacted: leads.filter((l) => l.status === "contacted").length,
      converted: leads.filter((l) => l.status === "converted").length,
    };

    return NextResponse.json({ success: true, stats, leads });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("🔴 MARKETING LEADS GET ERROR:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json({ error: "Lead ID is required" }, { status: 400 });
    }

    if (db) {
      const updates: Record<string, any> = {
        updatedAt: new Date().toISOString(),
      };
      if (status !== undefined) updates.status = status;
      if (notes !== undefined) updates.notes = notes;

      await db.collection("trek_enquiries").doc(id).update(updates);
    }

    return NextResponse.json({ success: true, id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("🔴 MARKETING LEADS PATCH ERROR:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
