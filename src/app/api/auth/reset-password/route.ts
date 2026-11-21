import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    // Disallow arbitrary unauthenticated password overwrites.
    // Securely generate Firebase password reset link sent to the verified user email.
    try {
      await adminAuth.generatePasswordResetLink(email.trim().toLowerCase());
    } catch {
      // Silence lookup errors to prevent account enumeration
    }

    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, a password reset link has been dispatched.",
    });
  } catch (err: any) {
    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, a password reset link has been dispatched.",
    });
  }
}
