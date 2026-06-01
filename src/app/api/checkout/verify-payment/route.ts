import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { adminDb as db } from "@/lib/firebaseAdmin";
import { Resend } from "resend";
import { logProductEvent } from "@/lib/trending";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json();

    // Verify signature
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    // Update order in Firestore
    await db.collection("orders").doc(orderId).update({
      razorpayPaymentId,
      paymentVerified: true,
      status: "confirmed",
      updatedAt: new Date().toISOString(),
    });

    // Fetch order for email + event logging
    const orderSnap = await db.collection("orders").doc(orderId).get();
    const order = orderSnap.data();

    // Log purchase events for trending score
    if (order?.orderType !== "trek" && Array.isArray(order?.items)) {
      await Promise.allSettled(
        order.items.map((item: { productId?: string; product?: { id: string } }) => {
          const productId = item.productId ?? item.product?.id;
          if (!productId) return Promise.resolve();
          return logProductEvent(productId, "purchase", order.userId ?? undefined);
        })
      );
    }

    // Send confirmation email
    if (order?.userEmail) {
      try {
        await resend.emails.send({
          from: "Visit Kokan <noreply@visitkokan.in>",
          to: order.userEmail,
          subject: `Order Confirmed — ₹${order.totalAmount.toLocaleString("en-IN")}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #2d7a4f; padding: 24px; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 24px;">🌿 Visit Kokan</h1>
              </div>
              <div style="background: #f9f5f0; padding: 24px; border-radius: 0 0 12px 12px;">
                <h2 style="color: #3d2b1f;">Order Confirmed! 🎉</h2>
                <p style="color: #6b5344;">Hi ${order.userName},</p>
                <p style="color: #6b5344;">Your ${order.orderType === "trek" ? "trek booking" : "order"} has been confirmed.</p>
                
                <div style="background: white; border-radius: 8px; padding: 16px; margin: 16px 0;">
                  <p style="margin: 0; color: #3d2b1f;"><strong>Order ID:</strong> ${orderId}</p>
                  <p style="margin: 8px 0 0; color: #3d2b1f;"><strong>Amount Paid:</strong> ₹${order.totalAmount.toLocaleString("en-IN")}</p>
                  <p style="margin: 8px 0 0; color: #3d2b1f;"><strong>Payment ID:</strong> ${razorpayPaymentId}</p>
                  ${order.orderType === "trek" ? `
                  <p style="margin: 8px 0 0; color: #3d2b1f;"><strong>Trek:</strong> ${order.trekName}</p>
                  <p style="margin: 8px 0 0; color: #3d2b1f;"><strong>Date:</strong> ${order.trekDate}</p>
                  <p style="margin: 8px 0 0; color: #3d2b1f;"><strong>Persons:</strong> ${order.persons?.length}</p>
                  ` : `
                  <p style="margin: 8px 0 0; color: #3d2b1f;"><strong>Items:</strong> ${order.items?.length} item(s)</p>
                  <p style="margin: 8px 0 0; color: #3d2b1f;"><strong>Delivery to:</strong> ${order.deliveryAddress?.city}, ${order.deliveryAddress?.state}</p>
                  `}
                </div>

                <p style="color: #6b5344; font-size: 14px;">Thank you for choosing Visit Kokan. We'll keep you updated on your order status.</p>
                <a href="https://visitkokan.in/order-confirmation/${orderId}" style="display: inline-block; background: #2d7a4f; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 8px;">View Order Details</a>
              </div>
            </div>
          `,
        });
      } catch (emailErr) {
        console.error("Email send failed:", emailErr);
      }
    }

    return NextResponse.json({ success: true, orderId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Verify payment error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}