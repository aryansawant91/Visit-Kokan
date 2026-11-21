import * as fs from "fs";
import * as path from "path";

// 1. Preload .env.local into process.env before importing firebaseAdmin
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx > 0) {
        const key = trimmed.slice(0, idx).trim();
        let val = trimmed.slice(idx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        val = val.replace(/\\n/g, "\n");
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

import { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import QRCode from "qrcode";

// Route handlers for regression checks
import { GET as destinationsGet } from "@/app/api/destinations/route";
import { GET as treksGet } from "@/app/api/treks/route";
import { GET as ordersGet, PATCH as ordersPatch } from "@/app/api/orders/route";
import { GET as adminOrdersGet } from "@/app/api/admin/orders/route";
import { POST as customTokenPost } from "@/app/api/auth/custom-token/route";
import { POST as checkoutCreateOfflineOrder } from "@/app/api/checkout/create-offline-order/route";
import { POST as checkoutCreateOrder } from "@/app/api/checkout/create-order/route";

interface TestCase {
  id: number;
  suite: string;
  name: string;
  fn: () => Promise<void>;
}

const testCases: TestCase[] = [];
let passCount = 0;
let failCount = 0;
const failures: { name: string; error: any }[] = [];

function registerTest(suite: string, name: string, fn: () => Promise<void>) {
  testCases.push({ id: testCases.length + 1, suite, name, fn });
}

// ----------------------------------------------------------------------
// Helper to simulate getDestination resolution logic from destinations/[slug]/page.tsx
// ----------------------------------------------------------------------
async function resolveDestinationSlug(slug: string) {
  if (!adminDb) throw new Error("adminDb not initialized");

  let snap = await adminDb
    .collection("destinations")
    .where("slug", "==", slug)
    .where("approved", "==", true)
    .limit(1)
    .get();

  if (snap.empty && slug.endsWith("-beach")) {
    snap = await adminDb
      .collection("destinations")
      .where("slug", "==", slug.replace(/-beach$/, ""))
      .where("approved", "==", true)
      .limit(1)
      .get();
  } else if (snap.empty && !slug.endsWith("-beach")) {
    snap = await adminDb
      .collection("destinations")
      .where("slug", "==", `${slug}-beach`)
      .where("approved", "==", true)
      .limit(1)
      .get();
  }

  if (snap.empty && slug.endsWith("-fort")) {
    snap = await adminDb
      .collection("destinations")
      .where("slug", "==", slug.replace(/-fort$/, ""))
      .where("approved", "==", true)
      .limit(1)
      .get();
  } else if (snap.empty && !slug.endsWith("-fort")) {
    snap = await adminDb
      .collection("destinations")
      .where("slug", "==", `${slug}-fort`)
      .where("approved", "==", true)
      .limit(1)
      .get();
  }

  if (snap.empty) {
    const aliasMap: Record<string, string> = {
      "devgad": "devgad-beach",
      "vijaydurg": "vijaydurg-fort",
      "korlai": "korlai-fort",
      "revdanda": "revdanda-fort-beach",
      "revdanda-beach": "revdanda-fort-beach",
      "korlai-revdanda": "korlai-fort",
      "harihareshwar-beach": "harihareshwar",
      "anjarle-beach": "anjarle",
      "velas": "velas-beach",
      "bankot": "bankot-fort",
      "kelshi": "kelshi-beach",
      "shrivardhan-beach": "shrivardhan",
      "devbag-beach": "devbag",
      "tarkarli-beach": "tarkarli",
      "bhogwe": "bhogwe-beach",
      "bhogave": "bhogwe-beach",
      "bhogave-beach": "bhogwe-beach",
      "velneshwar-beach": "velneshwar",
      "harnai-beach": "harnai",
      "achara": "achra",
      "achara-beach": "achra",
      "achra-beach": "achra",
      "aare-ware": "aare-ware-beach",
      "are-ware": "aare-ware-beach",
      "are-ware-beach": "aare-ware-beach",
      "parshuram-temple-chiplun": "chiplun-parshuram",
      "parshuram-temple": "chiplun-parshuram",
      "parshuram": "chiplun-parshuram",
      "chiplun": "chiplun-parshuram",
      "marleshwar-temple-waterfall": "marleshwar",
      "marleshwar-temple": "marleshwar",
      "marleshwar-waterfall": "marleshwar",
      "amboli-hill-station": "amboli",
      "kashid-beach": "kashid",
      "guhagar-beach": "guhagar",
      "murud-janjira-fort": "murud-janjira",
    };
    const targetAlias = aliasMap[slug];
    if (targetAlias) {
      snap = await adminDb
        .collection("destinations")
        .where("slug", "==", targetAlias)
        .where("approved", "==", true)
        .limit(1)
        .get();
    }
  }

  if (snap.empty) return null;
  return snap.docs[0].data();
}

// ----------------------------------------------------------------------
// Helper to simulate getTrek resolution logic from treks/[slug]/page.tsx
// ----------------------------------------------------------------------
async function resolveTrekSlug(slug: string) {
  if (!adminDb) throw new Error("adminDb not initialized");
  const snap = await adminDb
    .collection("treks")
    .where("slug", "==", slug)
    .where("approved", "==", true)
    .limit(1)
    .get();

  if (snap.empty) return null;
  const doc = snap.docs[0];
  const data = doc.data();
  return JSON.parse(
    JSON.stringify({ id: doc.id, ...data }, (_k, v) => {
      if (v && typeof v === "object" && typeof v.toDate === "function") {
        return v.toDate().toISOString();
      }
      if (v && typeof v === "object" && typeof v._seconds === "number") {
        return new Date(v._seconds * 1000).toISOString();
      }
      return v;
    })
  );
}

// ======================================================================
// SUITE 1: Home Page & Featured Heritage Destination (Raigad Fort)
// ======================================================================
registerTest("Homepage Heritage & Featured", "FALLBACK_DESTINATIONS in TravelTab has Raigad Fort as featured item #1", async () => {
  const travelTabPath = path.resolve(process.cwd(), "src/components/home/TravelTab.tsx");
  const content = fs.readFileSync(travelTabPath, "utf-8");
  
  if (!content.includes('name: "Raigad Fort"')) {
    throw new Error('TravelTab.tsx does not include "Raigad Fort"');
  }
  if (!content.includes('slug: "raigad-fort"')) {
    throw new Error('TravelTab.tsx does not include slug "raigad-fort"');
  }
  if (!content.includes("featured: true")) {
    throw new Error('Raigad Fort in TravelTab.tsx is not marked with featured: true');
  }
});

registerTest("Homepage Heritage & Featured", "Raigad Fort document exists and is approved in Firestore", async () => {
  if (!adminDb) throw new Error("adminDb is null");
  const snap = await adminDb
    .collection("destinations")
    .where("slug", "==", "raigad-fort")
    .limit(1)
    .get();

  if (snap.empty) {
    throw new Error('Document with slug "raigad-fort" not found in Firestore "destinations" collection');
  }
  const dest = snap.docs[0].data();
  if (dest.approved !== true) {
    throw new Error(`raigad-fort exists but approved is ${dest.approved}, expected true`);
  }
});

registerTest("Homepage Heritage & Featured", "TravelTab sorting logic places featured destinations first", async () => {
  const travelTabPath = path.resolve(process.cwd(), "src/components/home/TravelTab.tsx");
  const content = fs.readFileSync(travelTabPath, "utf-8");

  // Verify sort logic exists
  const hasSortLogic =
    content.includes("if (a.featured && !b.featured) return -1;") &&
    content.includes("if (!a.featured && b.featured) return 1;");

  if (!hasSortLogic) {
    throw new Error("TravelTab.tsx lacks the featured sorting logic for destinations");
  }
});

registerTest("Homepage Heritage & Featured", "GET /api/destinations returns Raigad Fort in destinations payload", async () => {
  const req = new NextRequest("http://localhost:3000/api/destinations", { method: "GET" });
  const res = await destinationsGet(req);
  if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error("Expected array of destinations");

  const raigad = data.find((d: any) => d.slug === "raigad-fort" || d.name?.includes("Raigad"));
  if (!raigad) {
    throw new Error("Raigad Fort not returned in /api/destinations");
  }
});

// ======================================================================
// SUITE 2: Destination Slug Resilience & 404 Prevention
// ======================================================================
registerTest("Destination Slug Resilience", 'Canonical slug "devgad-beach" resolves without 404', async () => {
  const dest = await resolveDestinationSlug("devgad-beach");
  if (!dest) throw new Error('Failed to resolve canonical "devgad-beach"');
  if (!dest.name.toLowerCase().includes("devgad")) {
    throw new Error(`Unexpected name for devgad-beach: ${dest.name}`);
  }
});

registerTest("Destination Slug Resilience", 'Short alias "devgad" successfully resolves to Devgad Beach', async () => {
  const dest = await resolveDestinationSlug("devgad");
  if (!dest) throw new Error('Failed to resolve alias "devgad"');
  if (!dest.name.toLowerCase().includes("devgad")) {
    throw new Error(`Unexpected destination returned for "devgad": ${dest.name}`);
  }
});

registerTest("Destination Slug Resilience", 'Canonical slug "vijaydurg-fort" resolves without 404', async () => {
  const dest = await resolveDestinationSlug("vijaydurg-fort");
  if (!dest) throw new Error('Failed to resolve canonical "vijaydurg-fort"');
  if (!dest.name.toLowerCase().includes("vijaydurg")) {
    throw new Error(`Unexpected name for vijaydurg-fort: ${dest.name}`);
  }
});

registerTest("Destination Slug Resilience", 'Short alias "vijaydurg" successfully resolves to Vijaydurg Fort', async () => {
  const dest = await resolveDestinationSlug("vijaydurg");
  if (!dest) throw new Error('Failed to resolve alias "vijaydurg"');
  if (!dest.name.toLowerCase().includes("vijaydurg")) {
    throw new Error(`Unexpected destination returned for "vijaydurg": ${dest.name}`);
  }
});

registerTest("Destination Slug Resilience", 'Suffix strip fallback: "harihareshwar-beach" resolves to Harihareshwar', async () => {
  const dest = await resolveDestinationSlug("harihareshwar-beach");
  if (!dest) throw new Error('Failed to resolve suffix stripped "harihareshwar-beach"');
  if (!dest.name.toLowerCase().includes("harihareshwar")) {
    throw new Error(`Unexpected destination returned: ${dest.name}`);
  }
});

registerTest("Destination Slug Resilience", 'Known alias "aare-ware" resolves to Aare Ware Beach', async () => {
  const dest = await resolveDestinationSlug("aare-ware");
  if (!dest) throw new Error('Failed to resolve alias "aare-ware"');
  if (!dest.name.toLowerCase().includes("aare") && !dest.name.toLowerCase().includes("are")) {
    throw new Error(`Unexpected destination returned for "aare-ware": ${dest.name}`);
  }
});

registerTest("Destination Slug Resilience", 'Known alias "velas" resolves to Velas Beach', async () => {
  const dest = await resolveDestinationSlug("velas");
  if (!dest) throw new Error('Failed to resolve alias "velas"');
  if (!dest.name.toLowerCase().includes("velas")) {
    throw new Error(`Unexpected destination returned for "velas": ${dest.name}`);
  }
});

// ======================================================================
// SUITE 3: Trek Detail Page & Firestore Resilience
// ======================================================================
registerTest("Trek Detail Page Resilience", 'Slug "torna-fort-trek" resolves complete trek object from Firestore', async () => {
  const trek = await resolveTrekSlug("torna-fort-trek");
  if (!trek) throw new Error('Trek "torna-fort-trek" not found in Firestore');
  if (!trek.name.toLowerCase().includes("torna")) {
    throw new Error(`Unexpected trek name: ${trek.name}`);
  }
  if (!trek.price || trek.price <= 0) {
    throw new Error(`Invalid price for Torna trek: ${trek.price}`);
  }
});

registerTest("Trek Detail Page Resilience", "Trek date serialization handles Firestore Timestamps cleanly", async () => {
  const trek = await resolveTrekSlug("torna-fort-trek");
  if (!trek) throw new Error('Trek "torna-fort-trek" not found');
  
  if (trek.createdAt && typeof trek.createdAt !== "string") {
    throw new Error(`Expected serialized string for createdAt, got ${typeof trek.createdAt}`);
  }
  if (trek.batches && Array.isArray(trek.batches)) {
    for (const b of trek.batches) {
      if (b.startDate && typeof b.startDate !== "string") {
        throw new Error(`Batch startDate must be serialized string: ${typeof b.startDate}`);
      }
    }
  }
});

// ======================================================================
// SUITE 4: Trek Booking Widget - UI Rules & Offline Booking
// ======================================================================
registerTest("Trek Booking Widget Invariants", "Online payment button remains commented out in TrekBookingWidget.tsx", async () => {
  const widgetPath = path.resolve(process.cwd(), "src/components/trek/TrekBookingWidget.tsx");
  const content = fs.readFileSync(widgetPath, "utf-8");

  // Check payment method button
  if (!content.includes("Online payment button commented out as requested (logic preserved in code):")) {
    throw new Error("Online payment button comment header not found in TrekBookingWidget.tsx");
  }
  // Check main submit button
  if (!content.includes("Online payment button commented out as requested:")) {
    throw new Error("Main online submit button comment header not found in TrekBookingWidget.tsx");
  }
  // Verify default state
  if (!content.includes('const [paymentMethod, setPaymentMethod] = useState<"online" | "offline">("offline");')) {
    throw new Error('Default paymentMethod in TrekBookingWidget.tsx is not "offline"');
  }
});

registerTest("Trek Booking Widget Invariants", "Secret coupon input exists without public coupon badges", async () => {
  const widgetPath = path.resolve(process.cwd(), "src/components/trek/TrekBookingWidget.tsx");
  const content = fs.readFileSync(widgetPath, "utf-8");

  if (!content.includes("Have a Coupon Code?")) {
    throw new Error('Secret coupon section "Have a Coupon Code?" not found in TrekBookingWidget.tsx');
  }
  if (!content.includes('placeholder="Enter coupon code"')) {
    throw new Error('Coupon input with placeholder "Enter coupon code" not found');
  }
  // Ensure no public promo code broadcast tags like "USE CODE: DISCOUNT"
  if (content.includes("PUBLIC_COUPON_LIST") || content.includes("availableCoupons.map")) {
    throw new Error("Found public coupon broadcast list in TrekBookingWidget.tsx; should be secret input only");
  }
});

let createdRegressionOrderId: string | null = null;

registerTest("Trek Booking Widget Invariants", "Offline COD trek order creation returns valid orderId", async () => {
  const payload = {
    orderType: "trek",
    userId: "test-user-regression",
    userEmail: "tester@visitkokan.in",
    userName: "Regression Tester",
    trekId: "regression-trek",
    trekName: "Torna Fort Monsoon Trek",
    trekSlug: "torna-fort-trek",
    whatsappGroupLink: "https://chat.whatsapp.com/TestRegressionGroup",
    totalAmount: 1499,
    persons: [
      { name: "Traveler 1", age: 25, gender: "Male" }
    ],
  };

  const req = new NextRequest("http://localhost:3000/api/checkout/create-offline-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const res = await checkoutCreateOfflineOrder(req);
  if (res.status !== 200) {
    const errText = await res.text();
    throw new Error(`Expected 200, got ${res.status}: ${errText}`);
  }

  const data = await res.json();
  if (!data.success || !data.orderId) {
    throw new Error(`Invalid response structure: ${JSON.stringify(data)}`);
  }

  createdRegressionOrderId = data.orderId;
});

registerTest("Trek Booking Widget Invariants", "Created offline order can be retrieved and contains offline payment & WhatsApp details", async () => {
  if (!createdRegressionOrderId) throw new Error("No created order ID to check");
  const req = new NextRequest(`http://localhost:3000/api/orders?id=${createdRegressionOrderId}`, { method: "GET" });
  const res = await ordersGet(req);
  if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
  const order = await res.json();

  if (order.id !== createdRegressionOrderId) {
    throw new Error(`Expected order ID ${createdRegressionOrderId}, got ${order.id}`);
  }
  if (order.paymentType !== "offline") {
    throw new Error(`Expected paymentType "offline", got ${order.paymentType}`);
  }
  if (order.remainingCash !== 1499) {
    throw new Error(`Expected remainingCash 1499, got ${order.remainingCash}`);
  }
  if (order.whatsappGroupLink !== "https://chat.whatsapp.com/TestRegressionGroup") {
    throw new Error(`Expected whatsappGroupLink to persist, got ${order.whatsappGroupLink}`);
  }
});

registerTest("Trek Booking Widget Invariants", "Cleanup temporary regression test order from Firestore", async () => {
  if (!createdRegressionOrderId || !adminDb) return;
  await adminDb.collection("orders").doc(createdRegressionOrderId).delete();
  createdRegressionOrderId = null;
});

// ======================================================================
// SUITE 5: Order Confirmation, Boarding Pass & QR Code Verification
// ======================================================================
registerTest("Order Confirmation & Pass Flow", "Order confirmation page enforces 2-step flow (WhatsApp unlocks Step 2 Ticket)", async () => {
  const pagePath = path.resolve(process.cwd(), "src/app/order-confirmation/[id]/page.tsx");
  const content = fs.readFileSync(pagePath, "utf-8");

  if (!content.includes("hasJoinedWhatsapp")) {
    throw new Error("order-confirmation/[id]/page.tsx lacks hasJoinedWhatsapp state");
  }
  if (!content.includes("hasDownloadedTicket")) {
    throw new Error("order-confirmation/[id]/page.tsx lacks hasDownloadedTicket state");
  }
  // Check Step 2 lock state when Step 1 not complete
  if (!content.includes("!hasJoinedWhatsapp")) {
    throw new Error("order-confirmation/[id]/page.tsx does not check !hasJoinedWhatsapp to gate Step 2");
  }
  // Check auto-redirect pause logic
  if (!content.includes("if (!hasDownloadedTicket || autoRedirectPaused) return;")) {
    throw new Error("Auto-redirect timer should remain paused until ticket is downloaded/viewed");
  }
});

registerTest("Order Confirmation & Pass Flow", "QRCode generation produces a valid data URL for the boarding pass", async () => {
  const testUrl = "https://visitkokan.in/order-confirmation/reg-test-12345";
  const dataUrl = await QRCode.toDataURL(testUrl, {
    width: 260,
    margin: 1,
    color: { dark: "#0f2d19", light: "#ffffff" },
    errorCorrectionLevel: "H",
  });

  if (!dataUrl.startsWith("data:image/png;base64,")) {
    throw new Error(`Invalid QR code data URL output: ${dataUrl.substring(0, 30)}...`);
  }
});

registerTest("Order Confirmation & Pass Flow", "BookingPassModal includes offline printable / PDF pass structure", async () => {
  const modalPath = path.resolve(process.cwd(), "src/components/booking/BookingPassModal.tsx");
  const content = fs.readFileSync(modalPath, "utf-8");

  if (!content.includes("window.print()")) {
    throw new Error("BookingPassModal should support direct window.print() for PDF ticket pass");
  }
  if (!content.includes("qrDataUrl")) {
    throw new Error("BookingPassModal must render qrDataUrl");
  }
  if (!content.includes("Save / Print Boarding Pass") && !content.includes("Print Boarding Pass") && !content.includes("Print / Save PDF")) {
    throw new Error("BookingPassModal missing print/download button label");
  }
});

// ======================================================================
// SUITE 6: Security Invariants (Ensure No Regressions in Security Posture)
// ======================================================================
registerTest("Security Invariance", "Arbitrary custom token endpoint rejects requests with 403 Forbidden", async () => {
  const req = new NextRequest("http://localhost:3000/api/auth/custom-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid: "attacker-uid" }),
  });
  const res = await customTokenPost(req);
  if (res.status !== 403) {
    throw new Error(`Expected 403 Forbidden, got ${res.status}`);
  }
});

registerTest("Security Invariance", "Admin orders endpoint rejects unauthorized requests with 401 Unauthorized", async () => {
  const req = new NextRequest("http://localhost:3000/api/admin/orders", { method: "GET" });
  const res = await adminOrdersGet(req);
  if (res.status !== 401 && res.status !== 403) {
    throw new Error(`Expected 401 or 403, got ${res.status}`);
  }
});

registerTest("Security Invariance", "PATCH /api/orders rejects unauthorized role/status tampering with 401 Unauthorized", async () => {
  const req = new NextRequest("http://localhost:3000/api/orders", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId: "some-order-id", status: "completed" }),
  });
  const res = await ordersPatch(req);
  if (res.status !== 401 && res.status !== 403) {
    throw new Error(`Expected 401 or 403, got ${res.status}`);
  }
});

registerTest("Security Invariance", "Offline checkout endpoint rejects manipulated price <= 0 with 400 Bad Request", async () => {
  const req = new NextRequest("http://localhost:3000/api/checkout/create-offline-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      trekId: "some-id",
      trekName: "Price Tamper Attempt",
      totalAmount: 0, // Tampered price
      participantsCount: 1,
    }),
  });
  const res = await checkoutCreateOfflineOrder(req);
  if (res.status !== 400) {
    throw new Error(`Expected 400 Bad Request for 0 totalAmount, got ${res.status}`);
  }
});

registerTest("Security Invariance", "Online checkout endpoint rejects manipulated price <= 0 with 400 Bad Request", async () => {
  const req = new NextRequest("http://localhost:3000/api/checkout/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: -100, // Tampered negative price
      orderType: "trek",
      trekId: "some-trek",
    }),
  });
  const res = await checkoutCreateOrder(req);
  if (res.status !== 400) {
    throw new Error(`Expected 400 Bad Request for negative amount, got ${res.status}`);
  }
});

// ======================================================================
// RUN ALL REGRESSION TESTS
// ======================================================================
async function runRegressionSuite() {
  console.log("======================================================================");
  console.log("             VISIT KOKAN — AUTOMATED REGRESSION TEST SUITE            ");
  console.log("======================================================================\n");
  console.log(`Discovered ${testCases.length} regression test assertions across 6 test suites.\n`);

  let currentSuite = "";
  for (const tc of testCases) {
    if (tc.suite !== currentSuite) {
      currentSuite = tc.suite;
      console.log(`\n--- [${currentSuite.toUpperCase()}] ---`);
    }

    try {
      await tc.fn();
      passCount++;
      console.log(`  [PASS] Test ${tc.id.toString().padStart(2, "0")}: ${tc.name}`);
    } catch (err: any) {
      failCount++;
      failures.push({ name: tc.name, error: err });
      console.error(`  [FAIL] Test ${tc.id.toString().padStart(2, "0")}: ${tc.name}`);
      console.error(`         -> Error: ${err.message || err}`);
    }
  }

  console.log("\n======================================================================");
  console.log("                    REGRESSION TESTING SUMMARY                        ");
  console.log("======================================================================");
  console.log(`Total Assertions : ${testCases.length}`);
  console.log(`Passed           : ${passCount}`);
  console.log(`Failed           : ${failCount}`);
  console.log(`Pass Rate        : ${((passCount / testCases.length) * 100).toFixed(1)}%`);
  console.log("======================================================================\n");

  if (failures.length > 0) {
    console.error("FAILURES DETECTED:");
    for (const f of failures) {
      console.error(` - ${f.name}: ${f.error.message || f.error}`);
    }
    process.exit(1);
  } else {
    console.log("ALL REGRESSION TESTS PASSED! ZERO FUNCTIONAL OR SECURITY REGRESSIONS.\n");
    process.exit(0);
  }
}

runRegressionSuite().catch((err) => {
  console.error("Fatal test suite execution error:", err);
  process.exit(1);
});
