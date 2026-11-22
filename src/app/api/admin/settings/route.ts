import { NextRequest, NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebaseAdmin";
import { isAuthorizedAdmin } from "@/lib/apiAuth";

export const dynamic = "force-dynamic";

export interface PlatformSettings {
  platformName: string;
  supportEmail: string;
  supportPhone: string;
  whatsappHelpline: string;
  businessAddress: string;
  websiteUrl: string;
  currency: string;
  defaultAdvancePercent: number;
  defaultMaxBatchSize: number;
  batchCutoffHours: number;
  cancellationPolicy: string;
  enableOfflinePayments: boolean;
  enableCashOnArrival: boolean;
  upiId: string;
  bankDetails: string;
  autoSendWhatsAppConfirmations: boolean;
  bookingAlertEmails: string;
  instagramHandle: string;
  facebookUrl: string;
  youtubeUrl: string;
  metaDescription: string;
  updatedAt?: string;
  updatedBy?: string;
}

const DEFAULT_SETTINGS: PlatformSettings = {
  platformName: "Visit Kokan",
  supportEmail: "info@visitkokan.com",
  supportPhone: "+91 98765 43210",
  whatsappHelpline: "+91 98765 43210",
  businessAddress: "Visit Kokan Expeditions, Dapoli & Chiplun Hub, Maharashtra - 415712",
  websiteUrl: "https://visitkokan.com",
  currency: "INR",
  defaultAdvancePercent: 50,
  defaultMaxBatchSize: 30,
  batchCutoffHours: 12,
  cancellationPolicy:
    "100% refund if cancelled 7+ days before departure. 50% refund if cancelled 3-7 days before departure. No refunds within 48 hours.",
  enableOfflinePayments: true,
  enableCashOnArrival: true,
  upiId: "visitkokan@upi",
  bankDetails:
    "Bank: HDFC Bank\nAccount: Visit Kokan Expeditions\nA/C No: 50200012345678\nIFSC: HDFC0001234\nBranch: Chiplun",
  autoSendWhatsAppConfirmations: true,
  bookingAlertEmails: "bookings@visitkokan.com",
  instagramHandle: "@visitkokan",
  facebookUrl: "https://facebook.com/visitkokan",
  youtubeUrl: "https://youtube.com/@visitkokan",
  metaDescription:
    "Experience thrilling Sahyadri treks, pristine Kokan beaches, and authentic Konkani hospitality with Visit Kokan.",
};

export async function GET(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
  }

  try {
    const docRef = db.collection("settings").doc("platform");
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json({
        success: true,
        settings: DEFAULT_SETTINGS,
        isDefault: true,
      });
    }

    const data = docSnap.data() as Partial<PlatformSettings>;
    return NextResponse.json({
      success: true,
      settings: { ...DEFAULT_SETTINGS, ...data },
      isDefault: false,
    });
  } catch (err: any) {
    console.error("Error reading platform settings:", err);
    // Return default settings gracefully if Firestore is cold
    return NextResponse.json({
      success: true,
      settings: DEFAULT_SETTINGS,
      fallback: true,
    });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const docRef = db.collection("settings").doc("platform");

    const payload: PlatformSettings = {
      ...DEFAULT_SETTINGS,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    await docRef.set(payload, { merge: true });

    return NextResponse.json({
      success: true,
      message: "Platform settings saved successfully",
      settings: payload,
    });
  } catch (err: any) {
    console.error("Error updating platform settings:", err);
    return NextResponse.json(
      { error: "Failed to update platform settings" },
      { status: 500 }
    );
  }
}
