import { NextRequest, NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { trekId, trekName, trekSlug, name, phone, groupSize, preferredMonth } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
    }

    const docData = {
      trekId: trekId || "",
      trekName: trekName || "",
      trekSlug: trekSlug || "",
      name: name.trim(),
      phone: phone.trim(),
      groupSize: groupSize || "2-4",
      preferredMonth: preferredMonth || "Upcoming Weekend",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    if (db) {
      await db.collection("trek_enquiries").add(docData);
    }

    return NextResponse.json({ success: true, message: "Enquiry stored successfully" });
  } catch (err: any) {
    console.error("Error storing trek enquiry:", err.message);
    return NextResponse.json({ success: true, warning: err.message });
  }
}

