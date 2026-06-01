import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { email, newPassword } = await req.json();
    if (!email || !newPassword) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const user = await adminAuth.getUserByEmail(email.trim().toLowerCase());
    await adminAuth.updateUser(user.uid, { password: newPassword });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("reset-password error:", err.message);
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}