import { NextRequest, NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebaseAdmin";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");

  try {
    console.log("=== PRODUCTS API HIT ===");
    console.log("DB instance:", db ? "OK" : "UNDEFINED");
    console.log("ENV PROJECT_ID:", process.env.FIREBASE_ADMIN_PROJECT_ID);
    console.log("ENV CLIENT_EMAIL:", process.env.FIREBASE_ADMIN_CLIENT_EMAIL ? "SET" : "MISSING");
    console.log("ENV PRIVATE_KEY:", process.env.FIREBASE_ADMIN_PRIVATE_KEY ? "SET" : "MISSING");

    if (slug) {
      const snap = await db
        .collection("products")
        .where("slug", "==", slug)
        .where("approved", "==", true)
        .limit(1)
        .get();

      if (snap.empty) return NextResponse.json(null, { status: 404 });
      const doc = snap.docs[0];
      return NextResponse.json({ id: doc.id, ...doc.data() });
    }

    const snap = await db
      .collection("products")
      .where("approved", "==", true)
      .get();

    const products = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log("Products found:", products.length);
    return NextResponse.json(products);

  } catch (err: any) {
    console.error("=== PRODUCTS API ERROR ===");
    console.error("Message:", err.message);
    console.error("Code:", err.code);
    console.error("Details:", err.details);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const now = new Date().toISOString();

    const isAdmin = body.isAdmin === true;

    // strip isAdmin flag — don't store it, use addedByAdmin instead
    const { isAdmin: _, ...rest } = body;

    const product = {
      ...rest,
      addedByAdmin: isAdmin,
      approved: isAdmin,                              // admin → true immediately
      status: isAdmin ? "approved" : "pending",
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