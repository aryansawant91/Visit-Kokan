import { NextRequest, NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebaseAdmin";
import { isAuthorizedAdmin } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  const slug   = req.nextUrl.searchParams.get("slug");
  const region = req.nextUrl.searchParams.get("region");
  const limit  = req.nextUrl.searchParams.get("limit");
  const all    = req.nextUrl.searchParams.get("all");

  try {
    if (slug) {
      const snap = await db
        .collection("listings")
        .where("slug", "==", slug)
        .where("approved", "==", true)
        .limit(1)
        .get();

      if (snap.empty) return NextResponse.json(null, { status: 404 });
      const doc = snap.docs[0];
      const data = doc.data();

      // Never show dummy seed listings to public users
      if (data.addedBy === "seed-script" && req.nextUrl.searchParams.get("includeSeed") !== "true") {
        return NextResponse.json(null, { status: 404 });
      }

      return NextResponse.json({ id: doc.id, ...data });
    }

    const vendorId = req.nextUrl.searchParams.get("vendorId");
    if (vendorId) {
      const snap = await db
        .collection("listings")
        .where("vendorId", "==", vendorId)
        .get();
      const listings = snap.docs
        .map((doc: any) => ({ id: doc.id, ...doc.data() }))
        .sort((a: any, b: any) =>
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
      return NextResponse.json(listings);
    }

    let query: any = db.collection("listings");

    if (all !== "true") {
      query = query.where("approved", "==", true);
    }

    const snap = await query.get();
    let listings = snap.docs
      .map((doc: any) => ({ id: doc.id, ...doc.data() }))
      .sort((a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    // Strictly exclude dummy seed listings so fake data is never shown to public users
    if (req.nextUrl.searchParams.get("includeSeed") !== "true") {
      listings = listings.filter((l: any) => l.addedBy !== "seed-script");
    }

    // Filter by region if provided
    if (region) {
      listings = listings.filter((l: any) =>
        l.region.toLowerCase() === region.toLowerCase()
      );
    }

    // Limit results if provided
    if (limit) {
      listings = listings.slice(0, parseInt(limit));
    }

    return NextResponse.json(listings);
  } catch (err: any) {
    console.error("Listings GET error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const now  = new Date().toISOString();
    const isAdmin = isAuthorizedAdmin(req);
    const { isAdmin: _, approved: __, status: ___, ...rest } = body;

    const listing = {
      ...rest,
      addedByAdmin: isAdmin,
      approved: isAdmin,
      status: isAdmin ? "approved" : "pending",
      rating: 0,
      reviewCount: 0,
      featured: false,
      createdAt: now,
      updatedAt: now,
    };

    const ref = await db.collection("listings").add(listing);
    return NextResponse.json({ id: ref.id, ...listing }, { status: 201 });
  } catch (err: any) {
    console.error("Listings POST error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
  }

  try {
    const { id, featured } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await db.collection("listings").doc(id).update({
      featured,
      updatedAt: new Date().toISOString(),
    });
    return NextResponse.json({ success: true });
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

    await db.collection("listings").doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
