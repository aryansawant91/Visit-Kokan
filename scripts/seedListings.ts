import * as admin from "firebase-admin";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = admin.firestore();

const listings = [
  {
    name: "Tarkarli Beach Resort",
    slug: "tarkarli-beach-resort",
    description: "A premium beachfront resort in Tarkarli with direct access to the crystal-clear waters. Offers AC cottages, a multi-cuisine restaurant, water sports facilities, and stunning sunset views over the Arabian Sea.",
    category: "hotel",
    region: "Sindhudurg",
    address: "Beach Road, Tarkarli, Malvan, Sindhudurg - 416606",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    ],
    price: 4500,
    priceUnit: "per night",
    phone: "+91 9876543210",
    amenities: ["AC", "WiFi", "Sea View", "Pool", "Restaurant", "Water Sports", "Parking"],
    rating: 4.5,
    reviewCount: 128,
    vendorName: "Visit Kokan Team",
    status: "approved",
    approved: true,
    featured: true,
    addedByAdmin: true,
    addedBy: "seed-script",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Malvani Khanaval",
    slug: "malvani-khanaval",
    description: "The most authentic Malvani restaurant in Malvan town. Famous for their Malvani fish curry, bombil fry, crab masala, and sol kadhi. Sitting on a wooden deck overlooking the sea, this is a must-visit for every food lover.",
    category: "restaurant",
    region: "Sindhudurg",
    address: "Near Chivla Beach, Malvan, Sindhudurg - 416606",
    images: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80",
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80",
    ],
    price: 600,
    priceUnit: "per person",
    phone: "+91 9876543211",
    amenities: ["Sea View", "Outdoor Seating", "Parking", "Takeaway"],
    rating: 4.8,
    reviewCount: 342,
    vendorName: "Visit Kokan Team",
    status: "approved",
    approved: true,
    featured: true,
    addedByAdmin: true,
    addedBy: "seed-script",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Kokan Nest Homestay",
    slug: "kokan-nest-homestay",
    description: "A traditional Konkan homestay in a 100-year-old laterite stone house surrounded by mango and cashew orchards in Ratnagiri. Experience authentic Konkan village life, home-cooked meals, and the warm hospitality of a local family.",
    category: "homestay",
    region: "Ratnagiri",
    address: "Village Rd, Pawas, Ratnagiri - 415616",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80",
    ],
    price: 2200,
    priceUnit: "per night",
    phone: "+91 9876543212",
    amenities: ["Home Cooked Meals", "Orchard Walk", "Hot Water", "Parking", "WiFi"],
    rating: 4.9,
    reviewCount: 89,
    vendorName: "Visit Kokan Team",
    status: "approved",
    approved: true,
    featured: true,
    addedByAdmin: true,
    addedBy: "seed-script",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Tarkarli Scuba Diving",
    slug: "tarkarli-scuba-diving",
    description: "Professional scuba diving and snorkeling experiences at the famous Tarkarli coral reef. PADI-certified instructors, all equipment provided. Suitable for beginners and experienced divers. Explore the rich marine biodiversity of the Sindhudurg Marine Sanctuary.",
    category: "activity",
    region: "Sindhudurg",
    address: "Tarkarli Jetty, Near MTDC Resort, Tarkarli, Malvan - 416606",
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
    ],
    price: 1800,
    priceUnit: "per person",
    phone: "+91 9876543213",
    amenities: ["Equipment Provided", "PADI Certified", "Beginners Welcome", "Photography Service"],
    rating: 4.7,
    reviewCount: 215,
    vendorName: "Visit Kokan Team",
    status: "approved",
    approved: true,
    featured: false,
    addedByAdmin: true,
    addedBy: "seed-script",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Alibaug Beach Cottage",
    slug: "alibaug-beach-cottage",
    description: "Charming beachside cottages just 200 metres from Alibaug beach. Perfect for a Mumbai weekend getaway. Each cottage has a private sit-out with garden views, and the property has a swimming pool and barbecue area.",
    category: "homestay",
    region: "Alibaug",
    address: "Alibaug Beach Road, Near Kolaba Fort, Alibaug - 402201",
    images: [
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    ],
    price: 3500,
    priceUnit: "per night",
    phone: "+91 9876543214",
    amenities: ["Pool", "BBQ", "Private Garden", "Breakfast", "AC", "WiFi", "Parking"],
    rating: 4.4,
    reviewCount: 167,
    vendorName: "Visit Kokan Team",
    status: "approved",
    approved: true,
    featured: false,
    addedByAdmin: true,
    addedBy: "seed-script",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Dapoli Mango Farm Stay",
    slug: "dapoli-mango-farm-stay",
    description: "Stay in the middle of a working Alphonso mango farm in Dapoli. During mango season (April-June) guests can pick mangoes directly from trees. The farm also grows coconuts, jackfruit, and cashews. A truly immersive agricultural experience.",
    category: "homestay",
    region: "Dapoli",
    address: "Anjarle Road, Dapoli, Ratnagiri - 415712",
    images: [
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
    ],
    price: 2800,
    priceUnit: "per night",
    phone: "+91 9876543215",
    amenities: ["Mango Picking", "Farm Tour", "Home Cooked Meals", "Bonfire", "Bird Watching"],
    rating: 4.6,
    reviewCount: 94,
    vendorName: "Visit Kokan Team",
    status: "approved",
    approved: true,
    featured: false,
    addedByAdmin: true,
    addedBy: "seed-script",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Konkan Spice Shop",
    slug: "konkan-spice-shop",
    description: "The oldest spice shop in Malvan — selling authentic Malvani masala, kokum, dried fish, cashews, and local pickles directly from producers. Their signature Malvani fish curry masala is shipped across India. A must-visit for anyone who wants to take Konkan's flavours home.",
    category: "shop",
    region: "Sindhudurg",
    address: "Main Bazaar, Malvan, Sindhudurg - 416606",
    images: [
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    ],
    price: null,
    priceUnit: "per item",
    phone: "+91 9876543216",
    amenities: ["Shipping Available", "Bulk Orders", "Custom Packaging"],
    rating: 4.7,
    reviewCount: 203,
    vendorName: "Visit Kokan Team",
    status: "approved",
    approved: true,
    featured: false,
    addedByAdmin: true,
    addedBy: "seed-script",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Ganpatipule MTDC Resort",
    slug: "ganpatipule-mtdc-resort",
    description: "The iconic MTDC resort at Ganpatipule, situated between the Swayambhu Ganesh temple and the pristine beach. One of the best-located resorts on the Konkan coast with direct beach access, a restaurant serving Konkan cuisine, and comfortable AC rooms.",
    category: "hotel",
    region: "Ratnagiri",
    address: "Near Ganpatipule Temple, Ganpatipule, Ratnagiri - 415620",
    images: [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    ],
    price: 3800,
    priceUnit: "per night",
    phone: "+91 9876543217",
    website: "https://mtdcresorts.com",
    amenities: ["Beach Access", "AC", "Restaurant", "WiFi", "Parking", "Temple Nearby"],
    rating: 4.2,
    reviewCount: 312,
    vendorName: "Visit Kokan Team",
    status: "approved",
    approved: true,
    featured: false,
    addedByAdmin: true,
    addedBy: "seed-script",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Murud Janjira Boat Tours",
    slug: "murud-janjira-boat-tours",
    description: "Licensed boat operators running guided tours to the historic Janjira sea fort from Rajpuri jetty. The 30-minute boat ride is an experience in itself, and expert local guides bring the fort's fascinating history to life. The only way to reach the unconquered sea fort.",
    category: "activity",
    region: "Raigad",
    address: "Rajpuri Jetty, Near Murud Beach, Murud, Raigad - 402401",
    images: [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    ],
    price: 350,
    priceUnit: "per person",
    phone: "+91 9876543218",
    amenities: ["Licensed Guides", "Life Jackets", "Group Bookings", "Photography Allowed"],
    rating: 4.5,
    reviewCount: 456,
    vendorName: "Visit Kokan Team",
    status: "approved",
    approved: true,
    featured: false,
    addedByAdmin: true,
    addedBy: "seed-script",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Vengurla Coconut Grove Resort",
    slug: "vengurla-coconut-grove-resort",
    description: "A peaceful resort nestled in a coconut grove near Vengurla beach at the southern tip of Maharashtra. Far from crowds, this eco-friendly property offers cottage accommodation, organic farm-to-table meals, yoga sessions, and guided nature walks.",
    category: "hotel",
    region: "Vengurla",
    address: "Shiroda Road, Near Vengurla Beach, Vengurla, Sindhudurg - 416516",
    images: [
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80",
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
    ],
    price: 3200,
    priceUnit: "per night",
    phone: "+91 9876543219",
    amenities: ["Eco Friendly", "Organic Meals", "Yoga", "Nature Walk", "Beach Nearby", "No Plastic"],
    rating: 4.8,
    reviewCount: 78,
    vendorName: "Visit Kokan Team",
    status: "approved",
    approved: true,
    featured: false,
    addedByAdmin: true,
    addedBy: "seed-script",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

async function seed() {
  console.log("🏡 Seeding Kokan listings...\n");
  console.log("Starting seed...");  // ← add this
  console.log("Project ID:", process.env.FIREBASE_ADMIN_PROJECT_ID);  // ← add this

  const existing = await db.collection("listings").get();
  const existingSlugs = new Set(existing.docs.map((d) => d.data().slug));

  let added = 0;
  let skipped = 0;

  for (const listing of listings) {
    if (existingSlugs.has(listing.slug)) {
      console.log(`⏭️  Skipped (already exists): ${listing.name}`);
      skipped++;
      continue;
    }
    await db.collection("listings").add(listing);
    console.log(`✅ Added: ${listing.name} (${listing.category} — ${listing.region})`);
    added++;
  }

  console.log(`\n🎉 Done! Added ${added}, Skipped ${skipped}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  console.error("Full error:", err);
  process.exit(1);
});