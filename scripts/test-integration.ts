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

process.env.IS_TEST = "true";

// 2. Now import NextRequest and route handlers
import { NextRequest } from "next/server";
import {
  createSignedSessionCookie,
  verifySessionCookie,
} from "@/lib/apiAuth";

import { POST as setRolePost } from "@/app/api/users/set-role/route";
import { POST as customTokenPost } from "@/app/api/auth/custom-token/route";
import { POST as resetPasswordPost } from "@/app/api/auth/reset-password/route";
import { GET as adminOrdersGet, PATCH as adminOrdersPatch, DELETE as adminOrdersDelete } from "@/app/api/admin/orders/route";
import { GET as expensesGet, POST as expensesPost, DELETE as expensesDelete } from "@/app/api/expenses/route";
import { GET as vendorsGet, PATCH as vendorsPatch } from "@/app/api/vendors/route";
import { POST as treksPost, PATCH as treksPatch, DELETE as treksDelete } from "@/app/api/treks/route";
import { POST as destinationsPost, PATCH as destinationsPatch, DELETE as destinationsDelete } from "@/app/api/destinations/route";
import { POST as listingsPost, PATCH as listingsPatch, DELETE as listingsDelete } from "@/app/api/listings/route";
import { GET as ordersGet, PATCH as ordersPatch } from "@/app/api/orders/route";
import { POST as checkoutCreateOrder } from "@/app/api/checkout/create-order/route";
import { POST as checkoutCreateOfflineOrder } from "@/app/api/checkout/create-offline-order/route";
import { GET as addressesGet } from "@/app/api/addresses/route";
import { POST as mobileLookupPost } from "@/app/api/auth/mobile-lookup/route";
import { POST as sendOtpPost } from "@/app/api/auth/send-otp/route";
import { checkIpRateLimit } from "@/lib/rateLimit";

interface TestResult {
  name: string;
  category: string;
  expected: number | string;
  actual: number | string;
  status: "PASS" | "FAIL";
  notes?: string;
}

const results: TestResult[] = [];

function record(name: string, category: string, expected: number | string, actual: number | string, passed: boolean, notes?: string) {
  results.push({
    name,
    category,
    expected,
    actual,
    status: passed ? "PASS" : "FAIL",
    notes,
  });
  const color = passed ? "\x1b[32m[PASS]\x1b[0m" : "\x1b[31m[FAIL]\x1b[0m";
  console.log(`${color} ${category} -> ${name} (Expected: ${expected}, Got: ${actual})`);
}

function makeReq(url: string, method: string, body?: any, cookies?: Record<string, string>, customHeaders?: Record<string, string>): NextRequest {
  const headers = new Headers();
  headers.set("content-type", "application/json");

  if (cookies) {
    const cookieHeader = Object.entries(cookies)
      .map(([k, v]) => `${k}=${v}`)
      .join("; ");
    headers.set("cookie", cookieHeader);
  }

  if (customHeaders) {
    for (const [k, v] of Object.entries(customHeaders)) {
      headers.set(k, v);
    }
  }

  const init: any = {
    method,
    headers,
  };

  if (body && method !== "GET" && method !== "HEAD") {
    init.body = JSON.stringify(body);
  }

  return new NextRequest(url, init);
}

async function runTests() {
  console.log("\x1b[36m====================================================\x1b[0m");
  console.log("\x1b[36m  STARTING INTEGRATION TESTS FOR SECURITY FIXES    \x1b[0m");
  console.log("\x1b[36m====================================================\x1b[0m\n");

  // 1. Session Cookie Cryptographic Signing & Verification Tests
  console.log("\x1b[33m--- Testing Session Cookie Signature Verification ---\x1b[0m");

  const validAdminPayload = { uid: "admin_uid_123", role: "admin" };
  const validSignedCookie = createSignedSessionCookie(validAdminPayload);
  const verified = verifySessionCookie(validSignedCookie);
  record(
    "Valid Signed Cookie Verification",
    "Session Auth",
    "admin",
    verified?.role || "null",
    verified?.role === "admin"
  );

  // Tampered cookie test
  const [b64, signature] = validSignedCookie.split(".");
  const tamperedB64 = Buffer.from(JSON.stringify({ uid: "admin_uid_123", role: "admin", hacked: true })).toString("base64url");
  const tamperedCookie = `${tamperedB64}.${signature}`;
  const tamperedResult = verifySessionCookie(tamperedCookie);
  record(
    "Tampered Cookie Signature Rejection",
    "Session Auth",
    "null",
    tamperedResult ? "valid" : "null",
    tamperedResult === null
  );

  // Unsigned raw cookie pretending to be admin
  const unsignedAdmin = JSON.stringify({ uid: "hacker", role: "admin" });
  const unsignedResult = verifySessionCookie(unsignedAdmin);
  record(
    "Unsigned Raw Admin Cookie Rejection",
    "Session Auth",
    "null",
    unsignedResult ? "valid" : "null",
    unsignedResult === null
  );

  // 2. Privilege Escalation & Auth Endpoint Tests
  console.log("\n\x1b[33m--- Testing Role Escalation & Auth Protections ---\x1b[0m");

  const reqEscalate = makeReq("http://localhost/api/users/set-role", "POST", { uid: "test-user", role: "admin" });
  const resEscalate = await setRolePost(reqEscalate);
  record(
    "Block Admin Role Self-Assignment",
    "Privilege Escalation",
    403,
    resEscalate.status,
    resEscalate.status === 403
  );

  const reqInvalidRole = makeReq("http://localhost/api/users/set-role", "POST", { uid: "test-user", role: "superadmin" });
  const resInvalidRole = await setRolePost(reqInvalidRole);
  record(
    "Reject Invalid Roles in set-role",
    "Privilege Escalation",
    400,
    resInvalidRole.status,
    resInvalidRole.status === 400
  );

  const reqCustomToken = makeReq("http://localhost/api/auth/custom-token", "POST", { email: "admin@visitkokan.in" });
  const resCustomToken = await customTokenPost(reqCustomToken);
  record(
    "Arbitrary Custom Token Endpoint Disabled",
    "Authentication",
    403,
    resCustomToken.status,
    resCustomToken.status === 403
  );

  const reqResetPass = makeReq("http://localhost/api/auth/reset-password", "POST", { email: "test@example.com", newPassword: "hackedPassword123!" });
  const resResetPass = await resetPasswordPost(reqResetPass);
  const resetPassBody = await resResetPass.json();
  record(
    "Password Overwrite Replaced with Safe Reset Dispatch",
    "Authentication",
    200,
    resResetPass.status,
    resResetPass.status === 200 && (resetPassBody.message?.includes("dispatched") || resetPassBody.success === true)
  );

  // 3. Admin API Route Lockdowns (without session -> 403)
  console.log("\n\x1b[33m--- Testing Admin Endpoints Lockdown ---\x1b[0m");

  const unauthReq = (url: string, method: string = "GET", body?: any) => makeReq(url, method, body);

  const resAdminOrdersGet = await adminOrdersGet(unauthReq("http://localhost/api/admin/orders"));
  record("Block Unauthenticated /api/admin/orders GET", "Access Control", 403, resAdminOrdersGet.status, resAdminOrdersGet.status === 403);

  const resAdminOrdersPatch = await adminOrdersPatch(unauthReq("http://localhost/api/admin/orders", "PATCH", { id: "123", status: "confirmed" }));
  record("Block Unauthenticated /api/admin/orders PATCH", "Access Control", 403, resAdminOrdersPatch.status, resAdminOrdersPatch.status === 403);

  const resAdminOrdersDelete = await adminOrdersDelete(unauthReq("http://localhost/api/admin/orders", "DELETE", { id: "123" }));
  record("Block Unauthenticated /api/admin/orders DELETE", "Access Control", 403, resAdminOrdersDelete.status, resAdminOrdersDelete.status === 403);

  const resExpensesGet = await expensesGet(unauthReq("http://localhost/api/expenses"));
  record("Block Unauthenticated /api/expenses GET", "Access Control", 403, resExpensesGet.status, resExpensesGet.status === 403);

  const resExpensesPost = await expensesPost(unauthReq("http://localhost/api/expenses", "POST", { description: "fake", amount: 500 }));
  record("Block Unauthenticated /api/expenses POST", "Access Control", 403, resExpensesPost.status, resExpensesPost.status === 403);

  const resExpensesDelete = await expensesDelete(unauthReq("http://localhost/api/expenses", "DELETE", { id: "exp_123" }));
  record("Block Unauthenticated /api/expenses DELETE", "Access Control", 403, resExpensesDelete.status, resExpensesDelete.status === 403);

  const resVendorsGet = await vendorsGet(unauthReq("http://localhost/api/vendors"));
  record("Block Unauthenticated /api/vendors GET", "Access Control", 403, resVendorsGet.status, resVendorsGet.status === 403);

  const resVendorsPatch = await vendorsPatch(unauthReq("http://localhost/api/vendors", "PATCH", { uid: "vendor_1", status: "approved" }));
  record("Block Unauthenticated /api/vendors PATCH", "Access Control", 403, resVendorsPatch.status, resVendorsPatch.status === 403);

  const resTreksPost = await treksPost(unauthReq("http://localhost/api/treks", "POST", { name: "Hack Trek" }));
  record("Block Unauthenticated /api/treks POST", "Access Control", 403, resTreksPost.status, resTreksPost.status === 403);

  const resTreksPatch = await treksPatch(unauthReq("http://localhost/api/treks", "PATCH", { id: "trek_1", price: 10 }));
  record("Block Unauthenticated /api/treks PATCH", "Access Control", 403, resTreksPatch.status, resTreksPatch.status === 403);

  const resTreksDelete = await treksDelete(unauthReq("http://localhost/api/treks", "DELETE", { id: "trek_1" }));
  record("Block Unauthenticated /api/treks DELETE", "Access Control", 403, resTreksDelete.status, resTreksDelete.status === 403);

  const resDestPost = await destinationsPost(unauthReq("http://localhost/api/destinations", "POST", { name: "Hack Beach" }));
  record("Block Unauthenticated /api/destinations POST", "Access Control", 403, resDestPost.status, resDestPost.status === 403);

  const resDestPatch = await destinationsPatch(unauthReq("http://localhost/api/destinations", "PATCH", { id: "dest_1", featured: true }));
  record("Block Unauthenticated /api/destinations PATCH", "Access Control", 403, resDestPatch.status, resDestPatch.status === 403);

  const resDestDelete = await destinationsDelete(unauthReq("http://localhost/api/destinations", "DELETE", { id: "dest_1" }));
  record("Block Unauthenticated /api/destinations DELETE", "Access Control", 403, resDestDelete.status, resDestDelete.status === 403);

  const resListingsPatch = await listingsPatch(unauthReq("http://localhost/api/listings", "PATCH", { id: "list_1", featured: true }));
  record("Block Unauthenticated /api/listings PATCH", "Access Control", 403, resListingsPatch.status, resListingsPatch.status === 403);

  const resListingsDelete = await listingsDelete(unauthReq("http://localhost/api/listings", "DELETE", { id: "list_1" }));
  record("Block Unauthenticated /api/listings DELETE", "Access Control", 403, resListingsDelete.status, resListingsDelete.status === 403);

  // 4. Orders Protection & IDOR Tests
  console.log("\n\x1b[33m--- Testing Orders Access Control & IDOR ---\x1b[0m");

  const resOrdersPatch = await ordersPatch(unauthReq("http://localhost/api/orders", "PATCH", { id: "ord_1", status: "confirmed" }));
  record("Block Unauthenticated /api/orders PATCH", "Orders Access", 403, resOrdersPatch.status, resOrdersPatch.status === 403);

  const resOrdersType = await ordersGet(unauthReq("http://localhost/api/orders?orderType=trek"));
  record("Block Unauthenticated /api/orders?orderType=... (Finance)", "Orders Access", 403, resOrdersType.status, resOrdersType.status === 403);

  const userCookie = createSignedSessionCookie({ uid: "user_alice", role: "user" });
  const resCrossUserOrders = await ordersGet(makeReq("http://localhost/api/orders?userId=user_bob", "GET", null, { vk_session: userCookie }));
  record("Block Cross-User Order IDOR Query", "IDOR Protection", 403, resCrossUserOrders.status, resCrossUserOrders.status === 403);

  // 5. Price & Amount Tampering Tests
  console.log("\n\x1b[33m--- Testing Price Tampering Prevention ---\x1b[0m");

  const resZeroCheckout = await checkoutCreateOrder(unauthReq("http://localhost/api/checkout/create-order", "POST", { amount: 0, orderType: "trek" }));
  record("Block Zero Amount in /api/checkout/create-order", "Business Logic", 400, resZeroCheckout.status, resZeroCheckout.status === 400);

  const resNegCheckout = await checkoutCreateOrder(unauthReq("http://localhost/api/checkout/create-order", "POST", { amount: -100, orderType: "trek" }));
  record("Block Negative Amount in /api/checkout/create-order", "Business Logic", 400, resNegCheckout.status, resNegCheckout.status === 400);

  const resZeroOffline = await checkoutCreateOfflineOrder(unauthReq("http://localhost/api/checkout/create-offline-order", "POST", { totalAmount: 0, orderType: "trek" }));
  record("Block Zero Amount in /api/checkout/create-offline-order", "Business Logic", 400, resZeroOffline.status, resZeroOffline.status === 400);

  // 6. Input Sanitization & IDOR Tests
  console.log("\n\x1b[33m--- Testing Input Sanitization & UID Validation ---\x1b[0m");

  const resAddressesBadUid = await addressesGet(unauthReq("http://localhost/api/addresses?uid=invalid/path/traversal.."));
  record("Block Path Traversal UID in /api/addresses", "Input Validation", 400, resAddressesBadUid.status, resAddressesBadUid.status === 400);

  const resMobileBadFormat = await mobileLookupPost(unauthReq("http://localhost/api/auth/mobile-lookup", "POST", { mobile: "123" }));
  record("Block Short Mobile in /api/auth/mobile-lookup", "Input Validation", 400, resMobileBadFormat.status, resMobileBadFormat.status === 400);

  // 7. Rate Limiting Tests (IP-Based Anti-Spam)
  console.log("\n\x1b[33m--- Testing Rate Limiting Protections ---\x1b[0m");

  const burstIp = "198.51.100.99";
  // 1st request initiates cooldown
  const firstBurstCheck = await checkIpRateLimit("burst_test", burstIp, 5, 60_000, 20_000);
  // Immediate 2nd request violates 20s rapid-fire cooldown
  const secondBurstCheck = await checkIpRateLimit("burst_test", burstIp, 5, 60_000, 20_000);
  record("Enforce Rapid Burst Cooldown between Requests", "Rate Limiting", "blocked", secondBurstCheck.allowed ? "allowed" : "blocked", !secondBurstCheck.allowed);

  const cappedIp = "198.51.100.42";
  // Pre-seed max 5 requests to simulate reaching the threshold
  for (let i = 0; i < 5; i++) {
    await checkIpRateLimit("otp", cappedIp, 5, 15 * 60 * 1000, 0);
  }

  // The 6th request hitting /api/auth/send-otp must be blocked immediately with HTTP 429
  const resOtpBlocked = await sendOtpPost(makeReq("http://localhost/api/auth/send-otp", "POST", { email: "attacker@example.com", purpose: "signup" }, undefined, { "x-forwarded-for": cappedIp }));
  record("Block /api/auth/send-otp when IP Rate Limit Exceeded", "Rate Limiting", 429, resOtpBlocked.status, resOtpBlocked.status === 429);

  // Summary
  console.log("\n\x1b[36m====================================================\x1b[0m");
  console.log("\x1b[36m               INTEGRATION TEST SUMMARY             \x1b[0m");
  console.log("\x1b[36m====================================================\x1b[0m");

  const passCount = results.filter((r) => r.status === "PASS").length;
  const failCount = results.filter((r) => r.status === "FAIL").length;

  console.table(
    results.map((r) => ({
      Category: r.category,
      "Test Name": r.name,
      Expected: r.expected,
      Actual: r.actual,
      Result: r.status,
    }))
  );

  console.log(`\n\x1b[32mTests Passed: ${passCount} / ${results.length}\x1b[0m`);
  if (failCount > 0) {
    console.log(`\x1b[31mTests Failed: ${failCount}\x1b[0m`);
    process.exit(1);
  } else {
    console.log(`\x1b[32mALL ${passCount} INTEGRATION TESTS PASSED SUCCESSFULLY!\x1b[0m\n`);
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
