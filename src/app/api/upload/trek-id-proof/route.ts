import { NextRequest, NextResponse } from "next/server";
import { adminStorage } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const rawOwnerId = (formData.get("ownerId") as string) || "unknown";
    const rawTrekId = (formData.get("trekId") as string) || "unknown-trek";
    const rawPersonIndex = (formData.get("personIndex") as string) || "0";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Sanitize path parameters to prevent directory traversal
    const ownerId = rawOwnerId.replace(/[^a-zA-Z0-9_-]/g, "");
    const trekId = rawTrekId.replace(/[^a-zA-Z0-9_-]/g, "");
    const personIndex = rawPersonIndex.replace(/[^0-9]/g, "");

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPG, PNG, WEBP, PDF" },
        { status: 400 }
      );
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const path = `trek-id-proofs/${ownerId || "user"}/${trekId || "trek"}/p${personIndex || "0"}-${Date.now()}-${safeName}`;

    const bucket = adminStorage.bucket();
    const fileRef = bucket.file(path);

    await fileRef.save(buffer, {
      metadata: { contentType: file.type },
    });

    // Long-lived signed URL so admins/staff can view the ID proof later
    const [url] = await fileRef.getSignedUrl({
      action: "read",
      expires: "03-01-2500",
    });

    return NextResponse.json({ url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("trek-id-proof upload error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
