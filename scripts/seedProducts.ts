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

const products = [
  {
    name: "Alphonso Mango Box",
    slug: "alphonso-mango-box",
    description: "Premium grade A Alphonso mangoes from Ratnagiri — the king of mangoes. Each box contains 12 carefully handpicked mangoes with rich saffron colour, creamy texture, and the signature sweet aroma that makes Ratnagiri Hapus world-famous. GI tagged and certified.",
    category: "fruits",
    region: "Ratnagiri",
    price: 1200,
    unit: "per box",
    stock: 50,
    images: [
      "https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&q=80",
      "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800&q=80",
    ],
    approved: true,
    status: "approved",
    addedByAdmin: true,
    vendorName: "Visit Kokan Team",
    vendorId: null,
    rating: 4.8,
    reviewCount: 234,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Malvani Fish Curry Masala",
    slug: "malvani-fish-curry-masala",
    description: "Authentic Malvani masala made from a secret blend of 16 spices including kokum, dried coconut, and Kashmiri chilies. Stone-ground in small batches using traditional methods. The only masala you need to make restaurant-quality Malvani fish curry at home.",
    category: "spices",
    region: "Sindhudurg",
    price: 280,
    unit: "per kg",
    stock: 100,
    images: [
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80",
      "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=800&q=80",
    ],
    approved: true,
    status: "approved",
    addedByAdmin: true,
    vendorName: "Visit Kokan Team",
    vendorId: null,
    rating: 4.9,
    reviewCount: 567,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Konkan Cashew Nuts W180",
    slug: "konkan-cashew-nuts-w180",
    description: "Premium whole cashews (W180 grade — 180 nuts per pound) sourced directly from cashew farms in Sindhudurg and Ratnagiri. Sun-dried and minimally processed to retain natural oils and flavour. No added salt, preservatives, or artificial coatings.",
    category: "nuts",
    region: "Sindhudurg",
    price: 850,
    unit: "per kg",
    stock: 75,
    images: [
      "https://images.unsplash.com/photo-1509912522825-9f468cb27dd4?w=800&q=80",
      "https://images.unsplash.com/photo-1543168256-418811576931?w=800&q=80",
    ],
    approved: true,
    status: "approved",
    addedByAdmin: true,
    vendorName: "Visit Kokan Team",
    vendorId: null,
    rating: 4.7,
    reviewCount: 189,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Kokum Sherbet Concentrate",
    slug: "kokum-sherbet-concentrate",
    description: "Pure kokum sherbet concentrate made from handpicked Garcinia indica (kokum) from Sindhudurg forests. No sugar added — just pure kokum extract with natural rock salt. Mix with water or soda for the most refreshing summer drink. Known for cooling properties and digestive benefits.",
    category: "beverages",
    region: "Sindhudurg",
    price: 180,
    unit: "per bottle",
    stock: 120,
    images: [
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80",
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&q=80",
    ],
    approved: true,
    status: "approved",
    addedByAdmin: true,
    vendorName: "Visit Kokan Team",
    vendorId: null,
    rating: 4.6,
    reviewCount: 312,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Raw Mango Pickle",
    slug: "raw-mango-pickle",
    description: "Traditional Konkan-style raw mango pickle made with raw Ratnagiri mangoes, cold-pressed sesame oil, and a blend of 8 spices. Prepared in earthen pots following a recipe passed down three generations. Perfectly spiced with a tangy punch that pairs with everything from dal-rice to parathas.",
    category: "pickles",
    region: "Ratnagiri",
    price: 220,
    unit: "per kg",
    stock: 60,
    images: [
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&q=80",
      "https://images.unsplash.com/photo-1606166325683-e6deb697d301?w=800&q=80",
    ],
    approved: true,
    status: "approved",
    addedByAdmin: true,
    vendorName: "Visit Kokan Team",
    vendorId: null,
    rating: 4.8,
    reviewCount: 143,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Jackfruit Chips",
    slug: "jackfruit-chips",
    description: "Crispy thin-sliced jackfruit chips made from raw jackfruit harvested in Guhagar. Fried in pure coconut oil with a light sprinkle of rock salt. A classic Konkan snack enjoyed during monsoon evenings. No artificial flavours, colours, or preservatives.",
    category: "other",
    region: "Guhagar",
    price: 150,
    unit: "per box",
    stock: 80,
    images: [
      "https://images.unsplash.com/photo-1621743478914-cc8a86d7e7b5?w=800&q=80",
      "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=800&q=80",
    ],
    approved: true,
    status: "approved",
    addedByAdmin: true,
    vendorName: "Visit Kokan Team",
    vendorId: null,
    rating: 4.5,
    reviewCount: 98,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Coconut Oil — Cold Pressed",
    slug: "coconut-oil-cold-pressed",
    description: "100% pure cold-pressed virgin coconut oil extracted from fresh coconuts harvested in Vengurla's coastal coconut groves. Single extraction, no heat, no chemicals — preserving all natural fatty acids and antioxidants. Used for cooking, hair care, and skincare across the Konkan coast for generations.",
    category: "other",
    region: "Vengurla",
    price: 420,
    unit: "per bottle",
    stock: 45,
    images: [
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80",
      "https://images.unsplash.com/photo-1546548970-71785318a17b?w=800&q=80",
    ],
    approved: true,
    status: "approved",
    addedByAdmin: true,
    vendorName: "Visit Kokan Team",
    vendorId: null,
    rating: 4.7,
    reviewCount: 201,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Dried Bombil (Bombay Duck)",
    slug: "dried-bombil-bombay-duck",
    description: "Sun-dried Bombay duck (bombil) from the traditional fishing villages of Alibag. Naturally dried on bamboo racks by the sea breeze — no artificial preservatives. A quintessential Konkan ingredient used in curries, chutneys, and as a crispy fry. Packed in airtight sealed pouches.",
    category: "other",
    region: "Alibaug",
    price: 380,
    unit: "per kg",
    stock: 30,
    images: [
      "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=800&q=80",
      "https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&q=80",
    ],
    approved: true,
    status: "approved",
    addedByAdmin: true,
    vendorName: "Visit Kokan Team",
    vendorId: null,
    rating: 4.4,
    reviewCount: 87,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Solkadhi Masala Mix",
    slug: "solkadhi-masala-mix",
    description: "Ready-to-use solkadhi masala mix with dried kokum petals, coconut milk powder, cumin, and green chili flakes. Just add water and fresh coconut milk for the iconic pink Konkan digestive drink. Makes 20 servings per pack. Perfect for gifting.",
    category: "spices",
    region: "Malvan",
    price: 120,
    unit: "per box",
    stock: 150,
    images: [
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80",
      "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80",
    ],
    approved: true,
    status: "approved",
    addedByAdmin: true,
    vendorName: "Visit Kokan Team",
    vendorId: null,
    rating: 4.6,
    reviewCount: 176,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Dapoli Honey — Wildflower",
    slug: "dapoli-honey-wildflower",
    description: "Raw unfiltered wildflower honey collected from beehives maintained in Dapoli's forest reserve. The bees forage on wild jamun, karvi, and coastal wildflowers giving this honey a unique dark amber colour and complex floral taste. Crystallises naturally — a sign of purity.",
    category: "beverages",
    region: "Dapoli",
    price: 450,
    unit: "per bottle",
    stock: 40,
    images: [
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80",
      "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&q=80",
    ],
    approved: true,
    status: "approved",
    addedByAdmin: true,
    vendorName: "Visit Kokan Team",
    vendorId: null,
    rating: 4.9,
    reviewCount: 134,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Malvan Prawn Pickle",
    slug: "malvan-prawn-pickle",
    description: "Spicy sun-dried prawn pickle made with fresh tiger prawns caught off the Malvan coast, marinated in Malvani masala and sesame oil. A bold, intensely flavoured condiment that transforms any simple meal. Shelf stable for 6 months. A bestseller for anyone who's visited Malvan.",
    category: "pickles",
    region: "Malvan",
    price: 340,
    unit: "per kg",
    stock: 35,
    images: [
      "https://images.unsplash.com/photo-1606166325683-e6deb697d301?w=800&q=80",
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&q=80",
    ],
    approved: true,
    status: "approved",
    addedByAdmin: true,
    vendorName: "Visit Kokan Team",
    vendorId: null,
    rating: 4.7,
    reviewCount: 209,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Ratnagiri Kesar Mango Pulp",
    slug: "ratnagiri-kesar-mango-pulp",
    description: "Pure Alphonso mango pulp from Ratnagiri — no sugar, no preservatives, no water added. Just 100% pure mango pressed and packed at peak ripeness during season. Use for aamras, lassi, ice cream, or simply eat with puri. Each tin captures the essence of a Konkan summer.",
    category: "fruits",
    region: "Ratnagiri",
    price: 320,
    unit: "per box",
    stock: 90,
    images: [
      "https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&q=80",
      "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800&q=80",
    ],
    approved: true,
    status: "approved",
    addedByAdmin: true,
    vendorName: "Visit Kokan Team",
    vendorId: null,
    rating: 4.8,
    reviewCount: 156,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

async function seed() {
  console.log("🛒 Seeding Kokan products...\n");

  const existing = await db.collection("products").get();
  const existingSlugs = new Set(existing.docs.map((d) => d.data().slug));

  let added = 0;
  let skipped = 0;

  for (const product of products) {
    if (existingSlugs.has(product.slug)) {
      console.log(`⏭️  Skipped (already exists): ${product.name}`);
      skipped++;
      continue;
    }
    await db.collection("products").add(product);
    console.log(`✅ Added: ${product.name} (${product.category} — ₹${product.price})`);
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