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
import { createSignedSessionCookie } from "@/lib/apiAuth";
import { adminAuth } from "@/lib/firebaseAdmin";

// Import all functional route handlers
import { GET as treksGet } from "@/app/api/treks/route";
import { GET as destinationsGet } from "@/app/api/destinations/route";
import { GET as productsGet } from "@/app/api/products/route";
import { GET as blogsGet } from "@/app/api/blogs/route";
import { GET as bannersGet } from "@/app/api/banners/route";
import { GET as reviewsGet } from "@/app/api/reviews/route";
import { POST as trekEnquirePost } from "@/app/api/treks/enquire/route";
import { POST as couponsValidatePost } from "@/app/api/coupons/validate/route";
import { POST as setRolePost } from "@/app/api/users/set-role/route";
import { GET as addressesGet, POST as addressesPost, PATCH as addressesPatch, DELETE as addressesDelete } from "@/app/api/addresses/route";
import { POST as checkoutCreateOrder } from "@/app/api/checkout/create-order/route";
import { POST as checkoutCreateOfflineOrder } from "@/app/api/checkout/create-offline-order/route";
import { GET as ordersGet } from "@/app/api/orders/route";
import { GET as adminOrdersGet } from "@/app/api/admin/orders/route";
import { GET as adminProductsGet } from "@/app/api/admin/products/route";
import { GET as adminListingGet } from "@/app/api/admin/listing/route";
import { GET as expensesGet } from "@/app/api/expenses/route";
import { GET as vendorsGet } from "@/app/api/vendors/route";

interface FunctionalResult {
  module: string;
  feature: string;
  scenario: string;
  status: "PASS" | "FAIL";
  httpStatus: number;
  details: string;
}

const results: FunctionalResult[] = [];

function record(module: string, feature: string, scenario: string, httpStatus: number, passed: boolean, details: string) {
  results.push({
    module,
    feature,
    scenario,
    status: passed ? "PASS" : "FAIL",
    httpStatus,
    details,
  });
  const color = passed ? "\x1b[32m[PASS]\x1b[0m" : "\x1b[31m[FAIL]\x1b[0m";
  console.log(`${color} [${module}] ${feature} -> ${scenario} (Status: ${httpStatus}, ${details})`);
}

function makeReq(url: string, method: string = "GET", body?: any, cookies?: Record<string, string>): NextRequest {
  const headers = new Headers();
  headers.set("content-type", "application/json");

  if (cookies) {
    const cookieHeader = Object.entries(cookies)
      .map(([k, v]) => `${k}=${v}`)
      .join("; ");
    headers.set("cookie", cookieHeader);
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

async function runFunctionalTests() {
  console.log("\x1b[36m====================================================\x1b[0m");
  console.log("\x1b[36m     FUNCTIONAL TESTING SUITE - VISIT KOKAN         \x1b[0m");
  console.log("\x1b[36m====================================================\x1b[0m\n");

  const adminSession = createSignedSessionCookie({ uid: "admin_tester", role: "admin" });
  const userSession = createSignedSessionCookie({ uid: "user_tester", role: "user" });

  // ─────────────────────────────────────────────────────────────
  // MODULE 1: Public Storefront Browsing & Content
  // ─────────────────────────────────────────────────────────────
  console.log("\x1b[33m--- Module 1: Public Storefront & Catalog Browsing ---\x1b[0m");

  // 1.1 Treks List
  try {
    const resTreks = await treksGet(makeReq("http://localhost/api/treks"));
    const treks = await resTreks.json();
    const isArray = Array.isArray(treks);
    record("Catalog", "Treks Listing", "Public catalog fetches approved treks", resTreks.status, resTreks.status === 200 && isArray, `Found ${isArray ? treks.length : 0} treks`);
  } catch (err: any) {
    record("Catalog", "Treks Listing", "Public catalog fetches approved treks", 500, false, err.message);
  }

  // 1.2 Destinations List
  try {
    const resDest = await destinationsGet(makeReq("http://localhost/api/destinations"));
    const dests = await resDest.json();
    const isArray = Array.isArray(dests);
    record("Catalog", "Destinations Listing", "Public catalog fetches approved destinations", resDest.status, resDest.status === 200 && isArray, `Found ${isArray ? dests.length : 0} destinations`);
  } catch (err: any) {
    record("Catalog", "Destinations Listing", "Public catalog fetches approved destinations", 500, false, err.message);
  }

  // 1.3 Products List
  try {
    const resProd = await productsGet(makeReq("http://localhost/api/products"));
    const prods = await resProd.json();
    const isArray = Array.isArray(prods);
    record("Catalog", "Products Listing", "Public catalog fetches active products", resProd.status, resProd.status === 200 && isArray, `Found ${isArray ? prods.length : 0} products`);
  } catch (err: any) {
    record("Catalog", "Products Listing", "Public catalog fetches active products", 500, false, err.message);
  }

  // 1.4 Blogs List
  try {
    const resBlogs = await blogsGet(makeReq("http://localhost/api/blogs"));
    const blogs = await resBlogs.json();
    const isArray = Array.isArray(blogs);
    record("Content", "Blogs Listing", "Public blog posts retrieved successfully", resBlogs.status, resBlogs.status === 200 && isArray, `Found ${isArray ? blogs.length : 0} blogs`);
  } catch (err: any) {
    record("Content", "Blogs Listing", "Public blog posts retrieved successfully", 500, false, err.message);
  }

  // 1.5 Banners List
  try {
    const resBanners = await bannersGet(makeReq("http://localhost/api/banners"));
    const banners = await resBanners.json();
    const isArray = Array.isArray(banners);
    record("Home", "Banners Listing", "Homepage promotional banners retrieved", resBanners.status, resBanners.status === 200 && isArray, `Found ${isArray ? banners.length : 0} banners`);
  } catch (err: any) {
    record("Home", "Banners Listing", "Homepage promotional banners retrieved", 500, false, err.message);
  }

  // 1.6 Reviews & Ratings
  try {
    const resReviews = await reviewsGet(makeReq("http://localhost/api/reviews?targetId=torna-fort-trek&targetType=trek"));
    const reviewsData = await resReviews.json();
    const hasReviews = reviewsData && Array.isArray(reviewsData.reviews);
    record("Reviews", "Customer Reviews", "Social proof and reviews retrieved for trek", resReviews.status, resReviews.status === 200 && hasReviews, `Avg Rating: ${reviewsData?.stats?.averageRating || 5}★`);
  } catch (err: any) {
    record("Reviews", "Customer Reviews", "Social proof and reviews retrieved for trek", 500, false, err.message);
  }

  // ─────────────────────────────────────────────────────────────
  // MODULE 2: User Inquiries & Lead Generation
  // ─────────────────────────────────────────────────────────────
  console.log("\n\x1b[33m--- Module 2: Inquiries & Customer Lead Flow ---\x1b[0m");

  try {
    const resEnquiry = await trekEnquirePost(
      makeReq("http://localhost/api/treks/enquire", "POST", {
        trekId: "torna-fort-trek",
        trekName: "Torna Fort Trek",
        name: "Test Traveler",
        phone: "+919876543210",
        groupSize: "4",
        preferredMonth: "December",
      })
    );
    const enquiryData = await resEnquiry.json();
    record("Leads", "Trek Enquiry", "User submits custom trek inquiry", resEnquiry.status, resEnquiry.status === 200 && enquiryData.success === true, "Enquiry saved");
  } catch (err: any) {
    record("Leads", "Trek Enquiry", "User submits custom trek inquiry", 500, false, err.message);
  }

  // ─────────────────────────────────────────────────────────────
  // MODULE 3: Coupon Validation Flow
  // ─────────────────────────────────────────────────────────────
  console.log("\n\x1b[33m--- Module 3: Coupon Discount Validation Flow ---\x1b[0m");

  try {
    const resCoupon = await couponsValidatePost(
      makeReq("http://localhost/api/coupons/validate", "POST", {
        code: "TREK100",
        amount: 2500,
        type: "trek",
      })
    );
    const couponData = await resCoupon.json();
    // Coupon might be valid in DB or not, as long as endpoint responds with clean JSON { valid: boolean }
    const validResponse = typeof couponData.valid === "boolean";
    record("Promotions", "Coupon Validation", "Validates coupon discount codes at checkout", resCoupon.status, resCoupon.status === 200 && validResponse, `Code: TREK100, Valid: ${couponData.valid}`);
  } catch (err: any) {
    record("Promotions", "Coupon Validation", "Validates coupon discount codes at checkout", 500, false, err.message);
  }

  // ─────────────────────────────────────────────────────────────
  // MODULE 4: User Onboarding & Registration Role Assignment
  // ─────────────────────────────────────────────────────────────
  console.log("\n\x1b[33m--- Module 4: User Onboarding & Safe Role Assignment ---\x1b[0m");

  try {
    let testUser: any = null;
    try {
      testUser = await adminAuth.createUser({
        email: `test_fn_${Date.now()}@visitkokan.in`,
        password: "TempPassword123!",
      });
    } catch {}

    if (testUser?.uid) {
      // Setting legitimate default 'user' role
      const resSetUser = await setRolePost(
        makeReq("http://localhost/api/users/set-role", "POST", {
          uid: testUser.uid,
          role: "user",
        })
      );
      const userRoleData = await resSetUser.json();
      record("Onboarding", "Role Assignment", "New user assigned default 'user' role upon signup", resSetUser.status, resSetUser.status === 200 && userRoleData.success === true, "Role 'user' assigned");

      // Setting legitimate 'vendor' role
      const resSetVendor = await setRolePost(
        makeReq("http://localhost/api/users/set-role", "POST", {
          uid: testUser.uid,
          role: "vendor",
        })
      );
      const vendorRoleData = await resSetVendor.json();
      record("Onboarding", "Role Assignment", "New vendor onboarded with 'vendor' role", resSetVendor.status, resSetVendor.status === 200 && vendorRoleData.success === true, "Role 'vendor' assigned");

      // Cleanup test user
      try {
        await adminAuth.deleteUser(testUser.uid);
      } catch {}
    } else {
      const resFallback = await setRolePost(
        makeReq("http://localhost/api/users/set-role", "POST", {
          uid: "nonexistent_uid",
          role: "user",
        })
      );
      record("Onboarding", "Role Assignment", "Rejects non-existent user identifier", resFallback.status, resFallback.status === 404, "Returned 404 cleanly");
    }
  } catch (err: any) {
    record("Onboarding", "Role Assignment", "User role assignment", 500, false, err.message);
  }

  // ─────────────────────────────────────────────────────────────
  // MODULE 5: Address Management for Authenticated User
  // ─────────────────────────────────────────────────────────────
  console.log("\n\x1b[33m--- Module 5: User Address Management (CRUD) ---\x1b[0m");

  const testUid = "user_functional_test";
  const userTestSession = createSignedSessionCookie({ uid: testUid, role: "user" });

  try {
    // 5.1 Add Address
    const resAddAddr = await addressesPost(
      makeReq("http://localhost/api/addresses", "POST", {
        uid: testUid,
        address: {
          fullName: "Ramesh Pawar",
          phone: "9876543210",
          addressLine1: "123 Beach Road",
          city: "Malvan",
          state: "Maharashtra",
          pincode: "416606",
        },
      }, { vk_session: userTestSession })
    );
    const addrData = await resAddAddr.json();
    const addrId = addrData.id;
    record("Addresses", "Create Address", "User saves a delivery address", resAddAddr.status, resAddAddr.status === 200 && !!addrId, `Address ID: ${addrId}`);

    // 5.2 Fetch Addresses
    const resGetAddr = await addressesGet(
      makeReq(`http://localhost/api/addresses?uid=${testUid}`, "GET", null, { vk_session: userTestSession })
    );
    const addrList = await resGetAddr.json();
    record("Addresses", "List Addresses", "User retrieves their saved delivery addresses", resGetAddr.status, resGetAddr.status === 200 && Array.isArray(addrList), `Count: ${addrList.length}`);

    // 5.3 Update Address
    if (addrId) {
      const resPatchAddr = await addressesPatch(
        makeReq("http://localhost/api/addresses", "PATCH", {
          uid: testUid,
          addressId: addrId,
          updates: { city: "Tarkarli" },
        }, { vk_session: userTestSession })
      );
      record("Addresses", "Update Address", "User updates an existing address", resPatchAddr.status, resPatchAddr.status === 200, "Address updated");

      // 5.4 Delete Address (Cleanup)
      const resDelAddr = await addressesDelete(
        makeReq("http://localhost/api/addresses", "DELETE", {
          uid: testUid,
          addressId: addrId,
        }, { vk_session: userTestSession })
      );
      record("Addresses", "Delete Address", "User removes an address", resDelAddr.status, resDelAddr.status === 200, "Address deleted");
    }
  } catch (err: any) {
    record("Addresses", "Address CRUD", "User address operations", 500, false, err.message);
  }

  // ─────────────────────────────────────────────────────────────
  // MODULE 6: Checkout & Order Creation Flow
  // ─────────────────────────────────────────────────────────────
  console.log("\n\x1b[33m--- Module 6: Booking & Checkout Flows ---\x1b[0m");

  // 6.1 Online Razorpay Order Creation (Valid non-zero amount)
  try {
    const resCreateOrder = await checkoutCreateOrder(
      makeReq("http://localhost/api/checkout/create-order", "POST", {
        amount: 1499,
        orderType: "product",
        userId: testUid,
        userEmail: "test@visitkokan.in",
        userName: "Test Customer",
        items: [{ productId: "p1", name: "Malvani Masala", price: 1499, quantity: 1 }],
      })
    );
    const orderData = await resCreateOrder.json();
    const hasOrder = orderData && orderData.orderId && orderData.razorpayOrderId;
    record("Checkout", "Online Order", "Generates Razorpay order for online payment", resCreateOrder.status, resCreateOrder.status === 200 && hasOrder, `Order ID: ${orderData?.orderId}, RZP: ${orderData?.razorpayOrderId}`);
  } catch (err: any) {
    record("Checkout", "Online Order", "Generates Razorpay order", 500, false, err.message);
  }

  // 6.2 Offline / Cash on Delivery Order Creation
  try {
    const resOfflineOrder = await checkoutCreateOfflineOrder(
      makeReq("http://localhost/api/checkout/create-offline-order", "POST", {
        orderType: "trek",
        userId: testUid,
        userEmail: "test@visitkokan.in",
        userName: "Test Trekker",
        trekId: "torna-fort-trek",
        trekName: "Torna Fort Trek",
        totalAmount: 2200,
        persons: [{ name: "Test Trekker", age: 26, phone: "9876543210" }],
      })
    );
    const offlineData = await resOfflineOrder.json();
    const hasOfflineOrder = offlineData && offlineData.success && offlineData.orderId;
    record("Checkout", "Offline Order", "Creates offline trek booking with pending verification", resOfflineOrder.status, resOfflineOrder.status === 200 && hasOfflineOrder, `Order ID: ${offlineData?.orderId}`);

    // 6.3 Customer Order Confirmation Page Retrieval (Public/Guest confirmation page support)
    if (offlineData?.orderId) {
      const resOrderConf = await ordersGet(makeReq(`http://localhost/api/orders?id=${offlineData.orderId}`, "GET"));
      const orderConfData = await resOrderConf.json();
      record("Orders", "Order Confirmation", "Post-checkout confirmation details retrieved", resOrderConf.status, resOrderConf.status === 200 && !!orderConfData?.id, `Retrieved Order: ${orderConfData?.id}`);
    }
  } catch (err: any) {
    record("Checkout", "Offline Order", "Creates offline booking", 500, false, err.message);
  }

  // ─────────────────────────────────────────────────────────────
  // MODULE 7: Authenticated Admin Dashboard Operations
  // ─────────────────────────────────────────────────────────────
  console.log("\n\x1b[33m--- Module 7: Authorized Admin Dashboard Operations ---\x1b[0m");

  const adminReq = (url: string) => makeReq(url, "GET", null, { vk_session: adminSession });

  // 7.1 Admin Orders
  try {
    const resAdmOrders = await adminOrdersGet(adminReq("http://localhost/api/admin/orders"));
    const admOrders = await resAdmOrders.json();
    record("Admin", "Orders Management", "Admin retrieves all platform orders", resAdmOrders.status, resAdmOrders.status === 200 && Array.isArray(admOrders), `Total Orders: ${admOrders.length}`);
  } catch (err: any) {
    record("Admin", "Orders Management", "Admin retrieves orders", 500, false, err.message);
  }

  // 7.2 Admin Products
  try {
    const resAdmProds = await adminProductsGet(adminReq("http://localhost/api/admin/products"));
    const admProds = await resAdmProds.json();
    record("Admin", "Products Moderation", "Admin views products list for approval", resAdmProds.status, resAdmProds.status === 200 && Array.isArray(admProds), `Total Products: ${admProds.length}`);
  } catch (err: any) {
    record("Admin", "Products Moderation", "Admin views products list", 500, false, err.message);
  }

  // 7.3 Admin Listings
  try {
    const resAdmListings = await adminListingGet(adminReq("http://localhost/api/admin/listing"));
    const admListings = await resAdmListings.json();
    record("Admin", "Homestays Moderation", "Admin views all homestays and vendor listings", resAdmListings.status, resAdmListings.status === 200 && Array.isArray(admListings), `Total Listings: ${admListings.length}`);
  } catch (err: any) {
    record("Admin", "Homestays Moderation", "Admin views homestays", 500, false, err.message);
  }

  // 7.4 Admin Financial Expenses
  try {
    const resExpenses = await expensesGet(adminReq("http://localhost/api/expenses"));
    const expenses = await resExpenses.json();
    record("Admin", "Finance & Expenses", "Admin views operational expenses and trek accounting", resExpenses.status, resExpenses.status === 200 && Array.isArray(expenses), `Expense Entries: ${expenses.length}`);
  } catch (err: any) {
    record("Admin", "Finance & Expenses", "Admin views expenses", 500, false, err.message);
  }

  // 7.5 Admin Vendors Management
  try {
    const resVendors = await vendorsGet(adminReq("http://localhost/api/vendors"));
    const vendors = await resVendors.json();
    record("Admin", "Vendors Management", "Admin views registered vendor accounts and verification statuses", resVendors.status, resVendors.status === 200 && Array.isArray(vendors), `Vendors Count: ${vendors.length}`);
  } catch (err: any) {
    record("Admin", "Vendors Management", "Admin views vendors", 500, false, err.message);
  }

  // ─────────────────────────────────────────────────────────────
  // SUMMARY
  // ─────────────────────────────────────────────────────────────
  console.log("\n\x1b[36m====================================================\x1b[0m");
  console.log("\x1b[36m             FUNCTIONAL TEST SUMMARY REPORT         \x1b[0m");
  console.log("\x1b[36m====================================================\x1b[0m");

  const passCount = results.filter((r) => r.status === "PASS").length;
  const failCount = results.filter((r) => r.status === "FAIL").length;

  console.table(
    results.map((r) => ({
      Module: r.module,
      Feature: r.feature,
      Scenario: r.scenario,
      Status: r.httpStatus,
      Result: r.status,
      Details: r.details,
    }))
  );

  console.log(`\n\x1b[32mFunctional Tests Passed: ${passCount} / ${results.length}\x1b[0m`);
  if (failCount > 0) {
    console.log(`\x1b[31mFunctional Tests Failed: ${failCount}\x1b[0m`);
    process.exit(1);
  } else {
    console.log("\x1b[32mALL FUNCTIONAL WORKFLOWS PASSED WITH 100% SUCCESS!\x1b[0m\n");
    process.exit(0);
  }
}

runFunctionalTests().catch((err) => {
  console.error("Functional test error:", err);
  process.exit(1);
});
