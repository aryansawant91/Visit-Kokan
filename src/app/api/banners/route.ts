import { NextRequest, NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebaseAdmin";

export async function GET(req: NextRequest) {
  const all = req.nextUrl.searchParams.get("all");

  try {
    const snap = await db.collection("banners").get();
    let banners = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    if (all !== "true") {
      banners = banners.filter((b: any) => b.active !== false);
    }

    banners.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));

    return NextResponse.json(banners);
  } catch (err: any) {
    console.error("Banners GET error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const now = new Date().toISOString();

    let order = body.order;
    if (order === undefined) {
      const snap = await db.collection("banners").get();
      order = snap.size;
    }

    const banner = {
      title: body.title ?? "",
      subtitle: body.subtitle ?? "",
      ctaText: body.ctaText ?? "",
      ctaLink: body.ctaLink ?? "",
      imageUrl: body.imageUrl ?? "",
      order,
      active: body.active ?? true,
      createdAt: now,
      updatedAt: now,
    };

    const ref = await db.collection("banners").add(banner);
    return NextResponse.json({ id: ref.id, ...banner }, { status: 201 });
  } catch (err: any) {
    console.error("Banners POST error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await db.collection("banners").doc(id).update({
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Banners PATCH error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    await db.collection("banners").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Banners DELETE error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}