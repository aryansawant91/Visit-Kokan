import { NextRequest, NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebaseAdmin";

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "Missing productId" }, { status: 400 });

  try {
    const snap = await db
      .collection("productReviews")
      .orderBy("createdAt", "desc")
      .get();

    const reviews = snap.docs
      .map((d) => ({ id: d.id, ...d.data() as any }))
      .filter((r) => r.productId === productId); // ← filter in JS

    return NextResponse.json(reviews);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("🔴 REVIEWS GET ERROR:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, userId, userName, rating, comment, images } = body;

    if (!productId || !userId || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const review = {
      productId,
      userId,
      userName,
      rating,
      comment: comment ?? "",
      images: images ?? [],
      createdAt: now,
    };

    const ref = await db.collection("productReviews").add(review);

    // Update product rating — filter in JS here too
    const reviewsSnap = await db
      .collection("productReviews")
      .get();

    const allRatings = reviewsSnap.docs
      .map((d) => d.data())
      .filter((d) => d.productId === productId)
      .map((d) => d.rating as number);

    const avgRating = allRatings.reduce((a, b) => a + b, 0) / allRatings.length;

    await db.collection("products").doc(productId).update({
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: allRatings.length,
      updatedAt: now,
    });

    return NextResponse.json({ id: ref.id, ...review }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("🔴 REVIEWS POST ERROR:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}