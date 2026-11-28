import { NextRequest, NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebaseAdmin";
import { isAuthorizedAdmin } from "@/lib/apiAuth";

export async function GET(req: NextRequest) {
  const all = req.nextUrl.searchParams.get("all");

  try {
    const snap = await db.collection("banners").get();
    let banners = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    if (all !== "true") {
      const yesterdayMs = Date.now() - 86_400_000;
      banners = banners.filter((b: any) => {
        if (b.active === false) return false;
        if (b.expiresAt) {
          const expMs = new Date(b.expiresAt).getTime();
          if (!Number.isNaN(expMs) && expMs < yesterdayMs) return false;
        }
        return true;
      });
    }

    banners.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));

    return NextResponse.json(banners);
  } catch (err: any) {
    console.error("Banners GET error:", err.message);
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

    // Upsert if batchKey already exists so toggling/updating a batch banner never duplicates
    if (body.batchKey) {
      const existingSnap = await db
        .collection("banners")
        .where("batchKey", "==", body.batchKey)
        .limit(1)
        .get();

      if (!existingSnap.empty) {
        const doc = existingSnap.docs[0];
        const updates: Record<string, any> = {
          title: body.title ?? "",
          subtitle: body.subtitle ?? "",
          ctaText: body.ctaText ?? "Book Seat Now",
          ctaLink: body.ctaLink ?? "/treks",
          imageUrl: body.imageUrl ?? "",
          badgeText: body.badgeText ?? "UPCOMING BATCH",
          active: body.active ?? true,
          updatedAt: now,
        };
        if (body.seatsLeft !== undefined) updates.seatsLeft = body.seatsLeft;
        if (body.expiresAt !== undefined) updates.expiresAt = body.expiresAt;

        await doc.ref.update(updates);
        return NextResponse.json({ id: doc.id, ...doc.data(), ...updates }, { status: 200 });
      }
    }

    let order = body.order;
    if (order === undefined) {
      const snap = await db.collection("banners").get();
      order = snap.size;
    }

    const banner: Record<string, any> = {
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

    if (body.batchKey) banner.batchKey = body.batchKey;
    if (body.badgeText) banner.badgeText = body.badgeText;
    if (body.seatsLeft !== undefined && body.seatsLeft !== null) {
      banner.seatsLeft = Number(body.seatsLeft);
    }
    if (body.expiresAt) banner.expiresAt = body.expiresAt;

    const ref = await db.collection("banners").add(banner);
    return NextResponse.json({ id: ref.id, ...banner }, { status: 201 });
  } catch (err: any) {
    console.error("Banners POST error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
  }

  try {
    const { id, batchKey, ...updates } = await req.json();

    if (id) {
      await db.collection("banners").doc(id).update({
        ...updates,
        updatedAt: new Date().toISOString(),
      });
      return NextResponse.json({ success: true });
    }

    if (batchKey) {
      const snap = await db
        .collection("banners")
        .where("batchKey", "==", batchKey)
        .get();
      const batch = db.batch();
      snap.docs.forEach((d) => {
        batch.update(d.ref, { ...updates, updatedAt: new Date().toISOString() });
      });
      await batch.commit();
      return NextResponse.json({ success: true, updated: snap.size });
    }

    return NextResponse.json({ error: "Missing id or batchKey" }, { status: 400 });
  } catch (err: any) {
    console.error("Banners PATCH error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
  }

  try {
    const { id, batchKey } = await req.json();
    if (id) {
      await db.collection("banners").doc(id).delete();
      return NextResponse.json({ success: true });
    }
    if (batchKey) {
      const snap = await db
        .collection("banners")
        .where("batchKey", "==", batchKey)
        .get();
      const batch = db.batch();
      snap.docs.forEach((d) => batch.delete(d.ref));
      await batch.commit();
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Missing id or batchKey" }, { status: 400 });
  } catch (err: any) {
    console.error("Banners DELETE error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
