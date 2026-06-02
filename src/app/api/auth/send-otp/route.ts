import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { email, purpose } = await req.json();

    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    // Check if email exists for login
    if (purpose === "login") {
      const snap = await adminDb
        .collection("users")
        .where("email", "==", email.trim().toLowerCase())
        .limit(1)
        .get();
      if (snap.empty) {
        return NextResponse.json({ error: "No account found with this email." }, { status: 404 });
      }
    }

    // Rate limit: max 3 OTPs per 15 minutes
    const windowStart = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const recentSnap = await adminDb
      .collection("otps")
      .where("email", "==", email.trim().toLowerCase())
      .where("createdAt", ">=", windowStart)
      .get();

    if (recentSnap.size >= 3) {
      return NextResponse.json(
        { error: "Too many OTP requests. Please wait 15 minutes." },
        { status: 429 }
      );
    }

    const otp    = generateOTP();
    const expiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    const now    = new Date().toISOString();

    // Save OTP to Firestore
    await adminDb.collection("otps").add({
      email:     email.trim().toLowerCase(),
      otp,
      purpose,
      expiresAt: expiry,
      createdAt: now,
      used:      false,
    });

    const isLogin = purpose === "login";

    // Send email via Gmail SMTP
    await transporter.sendMail({
      from:    `"Visit Kokan" <${process.env.GMAIL_USER}>`,
      to:      email.trim(),
      subject: isLogin ? "Your Visit Kokan login code" : "Verify your Visit Kokan account",
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
        <body style="margin:0;padding:0;background:#f5f0e8;font-family:'Segoe UI',sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:40px 16px;">
            <tr><td align="center">
              <table width="100%" style="max-width:480px;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                <tr>
                  <td style="background:linear-gradient(135deg,#2d7a4f,#1a5c38);padding:32px 32px 24px;text-align:center;">
                    <div style="font-size:28px;margin-bottom:8px;">🌿</div>
                    <div style="color:#fff;font-size:22px;font-weight:700;">Visit Kokan</div>
                    <div style="color:rgba(255,255,255,0.65);font-size:12px;margin-top:4px;letter-spacing:1px;text-transform:uppercase;">
                      ${isLogin ? "Sign In" : "Email Verification"}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:32px;">
                    <p style="margin:0 0 8px;color:#3d2b1f;font-size:16px;font-weight:600;">
                      ${isLogin ? "Your login code" : "Verify your email"}
                    </p>
                    <p style="margin:0 0 28px;color:#8a7060;font-size:14px;line-height:1.6;">
                      ${isLogin
                        ? "Use this code to sign in to your Visit Kokan account. It expires in 10 minutes."
                        : "Enter this code to verify your email and complete your registration."}
                    </p>
                    <div style="background:#f5f0e8;border:2px dashed #c8b89a;border-radius:16px;padding:24px;text-align:center;margin-bottom:24px;">
                      <div style="font-size:40px;font-weight:800;letter-spacing:12px;color:#2d7a4f;font-family:monospace;">
                        ${otp}
                      </div>
                      <div style="color:#8a7060;font-size:12px;margin-top:8px;">Expires in 10 minutes</div>
                    </div>
                    <div style="background:#fff8ed;border:1px solid #f0d9b0;border-radius:12px;padding:14px 16px;margin-bottom:24px;">
                      <p style="margin:0;color:#9a6c2e;font-size:12px;line-height:1.6;">
                        🔒 <strong>Never share this code</strong> with anyone. Visit Kokan will never ask for your OTP.
                      </p>
                    </div>
                    <p style="margin:0;color:#b0a090;font-size:12px;text-align:center;">
                      Didn't request this? You can safely ignore this email.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background:#f5f0e8;padding:16px 32px;text-align:center;border-top:1px solid #e8ddd0;">
                    <p style="margin:0;color:#b0a090;font-size:11px;">© 2025 Visit Kokan · The Konkan Coast, Maharashtra</p>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("send-otp error:", err.message);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
console.log("GMAIL_USER:", process.env.GMAIL_USER);
console.log("GMAIL_PASS length:", process.env.GMAIL_APP_PASSWORD?.length);