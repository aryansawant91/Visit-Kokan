import { NextRequest, NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, destination, tripType, dates, guests, message, source } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone number are required" },
        { status: 400 }
      );
    }

    const inquiry = {
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: email ? String(email).trim() : "",
      destination: destination || "Any Konkan Destination",
      tripType: tripType || "Personalized Trip & Homestay",
      dates: dates || "Flexible",
      guests: guests || "2 Guests",
      message: message ? String(message).trim() : "",
      source: source || "web_concierge_box",
      status: "new",
      createdAt: new Date().toISOString(),
    };

    let inquiryId = "";
    if (db) {
      const docRef = await db.collection("trip_inquiries").add(inquiry);
      inquiryId = docRef.id;
    }

    return NextResponse.json({
      success: true,
      inquiryId,
      message: "Trip inquiry received successfully",
    });
  } catch (err: any) {
    console.error("Trip inquiry error:", err);
    return NextResponse.json(
      { success: true, warning: err.message, message: "Inquiry received" },
      { status: 200 }
    );
  }
}
