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
      const data = doc.data();
      return NextResponse.json(
        { id: doc.id, ...data },
        { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=1800" } }
      );
    }

    const query = all === "true"
      ? db.collection("treks").get()
      : db.collection("treks").where("approved", "==", true).get();

    const snap = await query;
    const treks = snap.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a: any, b: any) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

    const headers = all === "true"
      ? undefined
      : { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=1800" };

    return NextResponse.json(treks, headers ? { headers } : undefined);
  } catch (err: any) {
    console.error("Treks GET error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const now  = new Date().toISOString();

    const trek = {
      ...body,
      approved: true,
      featured: Boolean(body.featured),
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
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
  }

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
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
  }

  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    await db.collection("treks").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
