import { NextRequest, NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebaseAdmin";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  const category = req.nextUrl.searchParams.get("category");
  const authorId = req.nextUrl.searchParams.get("authorId");

  try {
    if (slug) {
      const snap = await db
        .collection("blogs")
        .where("slug", "==", slug)
        .where("approved", "==", true)
        .limit(1)
        .get();
      if (snap.empty) return NextResponse.json(null, { status: 404 });
      const doc = snap.docs[0];
      return NextResponse.json({ id: doc.id, ...doc.data() });
    }

    if (authorId) {
      const snap = await db
        .collection("blogs")
        .where("authorId", "==", authorId)
        .orderBy("createdAt", "desc")
        .get();
      const blogs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      return NextResponse.json(blogs);
    }

    const snap = await db
      .collection("blogs")
      .orderBy("createdAt", "desc")
      .get();

    let blogs = snap.docs
      .map((d) => ({ id: d.id, ...d.data() as any }))
      .filter((b) => b.approved === true);

    if (category) blogs = blogs.filter((b) => b.category === category);

    return NextResponse.json(blogs);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("🔴 BLOGS GET ERROR:", err); // ← added here
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const now = new Date().toISOString();

    const wordCount = body.content?.split(" ").length ?? 0;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    const slug =
      body.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") +
      "-" +
      Date.now();

    const blog = {
      ...body,
      slug,
      approved: body.authorRole === "admin",
      status: body.authorRole === "admin" ? "approved" : "pending",
      readTime,
      views: 0,
      createdAt: now,
      updatedAt: now,
    };

    const ref = await db.collection("blogs").add(blog);
    return NextResponse.json({ id: ref.id, ...blog }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("🔴 BLOGS POST ERROR:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}