import { NextRequest, NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebaseAdmin";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");

  try {
    if (slug) {
      const snap = await db
        .collection("products")
        .where("slug", "==", slug)
        .where("approved", "==", true)
        .limit(1)
        .get();

      if (snap.empty) return NextResponse.json(null, { status: 404 });

      const doc = snap.docs[0];
      const data = doc.data();

      // If admin paused this product redirect caller to 404
      if (data.isActive === false) {
        return NextResponse.json(null, { status: 404 });
      }

      return NextResponse.json({ id: doc.id, ...data });
    }

    const snap = await db
      .collection("products")
      .where("approved", "==", true)
      .get();

    // Filter out paused products — isActive === false means hidden
    // isActive undefined means active (existing products without the field)
    const products = snap.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((p: any) => p.isActive !== false);

    return NextResponse.json(products);

  } catch (err: any) {
    console.error("=== PRODUCTS API ERROR ===");
    console.error("Message:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const now = new Date().toISOString();
    const isAdmin = body.isAdmin === true;
    const { isAdmin: _, ...rest } = body;

    const product = {
      ...rest,
      addedByAdmin: isAdmin,
      approved: isAdmin,
      status: isAdmin ? "approved" : "pending",
      isActive: true, // ← all new products start as active
      rating: 0,
      reviewCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    const ref = await db.collection("products").add(product);
    return NextResponse.json({ id: ref.id, ...product }, { status: 201 });
  } catch (err: any) {
    console.error("POST error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}