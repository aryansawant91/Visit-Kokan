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

const products = 
[
  {
    "name": "Kokum Syrup",
    "slug": "kokum-syrup",
    "category": "beverages",
    "price": 180,
    "region": "Sindhudurg",
    "unit": "starting price",
    "stock": 100,
    "thumbnail": "https://drive.google.com/uc?export=view&id=1HPq71Ko-WrZAzjxcVmMydut5w4ntH98l",
    "images": [ 
                "https://drive.google.com/uc?export=view&id=1_wVbCdJbErSf34Ph0vynO0M5alON6Ehi",
                "https://drive.google.com/uc?export=view&id=1HPq71Ko-WrZAzjxcVmMydut5w4ntH98l",
                "https://drive.google.com/uc?export=view&id=1d7X87QgQW-VXbQao9dYsbGDhTO1ROOu6",
                "https://drive.google.com/uc?export=view&id=1j3bwTsyiiwJRSjUbShYnut8biZlZa8m_",
                "https://drive.google.com/uc?export=view&id=1srkP6j-fvflb4pisllHqI4S3DC7zO4mB",
                "https://drive.google.com/uc?export=view&id=1yaqhQPyTxktdhrIdksXBFNLaWQI7TvHp"
    ],
    "approved": true,
    "status": "approved",
    "addedByAdmin": true,
    "vendorName": "Visit Kokan Team",
    "vendorId": null,
    "rating": 4.8,
    "reviewCount": 50,
    "createdAt": "2026-05-10T00:00:00.000Z",
    "updatedAt": "2026-05-10T00:00:00.000Z",
    "variants": [
      {
        "id": 1,
        "weight": "500g",
        "price": 180,
        "stock": 50,
        "sku": "KOKUM_SYRUP"
      }
    ],
    "tags": [
      "kokum",
      "konkan"
    ]
  },
  {
    "name": "Kokum Agal",
    "slug": "kokum-agal",
    "category": "condiments",
    "price": 150,
    "region": "Sindhudurg",
    "unit": "starting price",
    "stock": 100,
    "thumbnail": "https://drive.google.com/uc?export=view&id=1HPq71Ko-WrZAzjxcVmMydut5w4ntH98l",
    "images": [ 
                "https://drive.google.com/uc?export=view&id=1_wVbCdJbErSf34Ph0vynO0M5alON6Ehi",
                "https://drive.google.com/uc?export=view&id=1HPq71Ko-WrZAzjxcVmMydut5w4ntH98l",
                "https://drive.google.com/uc?export=view&id=1d7X87QgQW-VXbQao9dYsbGDhTO1ROOu6",
                "https://drive.google.com/uc?export=view&id=1j3bwTsyiiwJRSjUbShYnut8biZlZa8m_",
                "https://drive.google.com/uc?export=view&id=1srkP6j-fvflb4pisllHqI4S3DC7zO4mB",
                "https://drive.google.com/uc?export=view&id=1yaqhQPyTxktdhrIdksXBFNLaWQI7TvHp"
    ],
    "approved": true,
    "status": "approved",
    "addedByAdmin": true,
    "vendorName": "Visit Kokan Team",
    "vendorId": null,
    "rating": 4.8,
    "reviewCount": 50,
    "createdAt": "2026-05-10T00:00:00.000Z",
    "updatedAt": "2026-05-10T00:00:00.000Z",
    "variants": [
      {
        "id": 1,
        "weight": "500g",
        "price": 150,
        "stock": 50,
        "sku": "KOKUM_AGAL"
      }
    ],
    "tags": [
      "kokum",
      "konkan"
    ]
  },
  {
    "name": "Amsul (Dried Kokum)",
    "slug": "amsul-dried-kokum",
    "category": "spices",
    "price": 120,
    "region": "Sindhudurg",
    "unit": "starting price",
    "stock": 100,
   "thumbnail": "https://drive.google.com/uc?export=view&id=1HPq71Ko-WrZAzjxcVmMydut5w4ntH98l",
    "images": [ 
                "https://drive.google.com/uc?export=view&id=1_wVbCdJbErSf34Ph0vynO0M5alON6Ehi",
                "https://drive.google.com/uc?export=view&id=1HPq71Ko-WrZAzjxcVmMydut5w4ntH98l",
                "https://drive.google.com/uc?export=view&id=1d7X87QgQW-VXbQao9dYsbGDhTO1ROOu6",
                "https://drive.google.com/uc?export=view&id=1j3bwTsyiiwJRSjUbShYnut8biZlZa8m_",
                "https://drive.google.com/uc?export=view&id=1srkP6j-fvflb4pisllHqI4S3DC7zO4mB",
                "https://drive.google.com/uc?export=view&id=1yaqhQPyTxktdhrIdksXBFNLaWQI7TvHp"
    ],
    "approved": true,
    "status": "approved",
    "addedByAdmin": true,
    "vendorName": "Visit Kokan Team",
    "vendorId": null,
    "rating": 4.8,
    "reviewCount": 50,
    "createdAt": "2026-05-10T00:00:00.000Z",
    "updatedAt": "2026-05-10T00:00:00.000Z",
    "variants": [
      {
        "id": 1,
        "weight": "500g",
        "price": 120,
        "stock": 50,
        "sku": "AMSUL_DRIED_KOKUM"
      }
    ],
    "tags": [
      "amsul",
      "konkan"
    ]
  },
  {
    "name": "Premium Cashew",
    "slug": "premium-cashew",
    "category": "nuts",
    "price": 350,
    "region": "Sindhudurg",
    "unit": "starting price",
    "stock": 100,
   "thumbnail": "https://drive.google.com/uc?export=view&id=1HPq71Ko-WrZAzjxcVmMydut5w4ntH98l",
    "images": [ 
                "https://drive.google.com/uc?export=view&id=1_wVbCdJbErSf34Ph0vynO0M5alON6Ehi",
                "https://drive.google.com/uc?export=view&id=1HPq71Ko-WrZAzjxcVmMydut5w4ntH98l",
                "https://drive.google.com/uc?export=view&id=1d7X87QgQW-VXbQao9dYsbGDhTO1ROOu6",
                "https://drive.google.com/uc?export=view&id=1j3bwTsyiiwJRSjUbShYnut8biZlZa8m_",
                "https://drive.google.com/uc?export=view&id=1srkP6j-fvflb4pisllHqI4S3DC7zO4mB",
                "https://drive.google.com/uc?export=view&id=1yaqhQPyTxktdhrIdksXBFNLaWQI7TvHp"
    ],
    "approved": true,
    "status": "approved",
    "addedByAdmin": true,
    "vendorName": "Visit Kokan Team",
    "vendorId": null,
    "rating": 4.8,
    "reviewCount": 50,
    "createdAt": "2026-05-10T00:00:00.000Z",
    "updatedAt": "2026-05-10T00:00:00.000Z",
    "variants": [
      {
        "id": 1,
        "weight": "500g",
        "price": 350,
        "stock": 50,
        "sku": "PREMIUM_CASHEW"
      }
    ],
    "tags": [
      "premium",
      "konkan"
    ]
  },
  {
    "name": "Konkan Gift Pack",
    "slug": "konkan-gift-pack",
    "category": "gift-pack",
    "price": 699,
    "region": "Sindhudurg",
    "unit": "starting price",
    "stock": 100,
   "thumbnail": "https://drive.google.com/uc?export=view&id=1HPq71Ko-WrZAzjxcVmMydut5w4ntH98l",
    "images": [ 
                "https://drive.google.com/uc?export=view&id=1_wVbCdJbErSf34Ph0vynO0M5alON6Ehi",
                "https://drive.google.com/uc?export=view&id=1HPq71Ko-WrZAzjxcVmMydut5w4ntH98l",
                "https://drive.google.com/uc?export=view&id=1d7X87QgQW-VXbQao9dYsbGDhTO1ROOu6",
                "https://drive.google.com/uc?export=view&id=1j3bwTsyiiwJRSjUbShYnut8biZlZa8m_",
                "https://drive.google.com/uc?export=view&id=1srkP6j-fvflb4pisllHqI4S3DC7zO4mB",
                "https://drive.google.com/uc?export=view&id=1yaqhQPyTxktdhrIdksXBFNLaWQI7TvHp"
    ],
    "approved": true,
    "status": "approved",
    "addedByAdmin": true,
    "vendorName": "Visit Kokan Team",
    "vendorId": null,
    "rating": 4.8,
    "reviewCount": 50,
    "createdAt": "2026-05-10T00:00:00.000Z",
    "updatedAt": "2026-05-10T00:00:00.000Z",
    "variants": [
      {
        "id": 1,
        "weight": "500g",
        "price": 699,
        "stock": 50,
        "sku": "KONKAN_GIFT_PACK"
      }
    ],
    "tags": [
      "konkan",
      "konkan"
    ]
  },
  {
    "name": "Malvani Masala",
    "slug": "malvani-masala",
    "category": "spices",
    "price": 120,
    "region": "Sindhudurg",
    "unit": "starting price",
    "stock": 100,
    "thumbnail": "https://drive.google.com/uc?export=view&id=1HPq71Ko-WrZAzjxcVmMydut5w4ntH98l",
    "images": [ 
                "https://drive.google.com/uc?export=view&id=1_wVbCdJbErSf34Ph0vynO0M5alON6Ehi",
                "https://drive.google.com/uc?export=view&id=1HPq71Ko-WrZAzjxcVmMydut5w4ntH98l",
                "https://drive.google.com/uc?export=view&id=1d7X87QgQW-VXbQao9dYsbGDhTO1ROOu6",
                "https://drive.google.com/uc?export=view&id=1j3bwTsyiiwJRSjUbShYnut8biZlZa8m_",
                "https://drive.google.com/uc?export=view&id=1srkP6j-fvflb4pisllHqI4S3DC7zO4mB",
                "https://drive.google.com/uc?export=view&id=1yaqhQPyTxktdhrIdksXBFNLaWQI7TvHp"
    ],
    "approved": true,
    "status": "approved",
    "addedByAdmin": true,
    "vendorName": "Visit Kokan Team",
    "vendorId": null,
    "rating": 4.8,
    "reviewCount": 50,
    "createdAt": "2026-05-10T00:00:00.000Z",
    "updatedAt": "2026-05-10T00:00:00.000Z",
    "variants": [
      {
        "id": 1,
        "weight": "500g",
        "price": 120,
        "stock": 50,
        "sku": "MALVANI_MASALA"
      }
    ],
    "tags": [
      "malvani",
      "konkan"
    ]
  },
  {
    "name": "Fish Masala",
    "slug": "fish-masala",
    "category": "spices",
    "price": 130,
    "region": "Sindhudurg",
    "unit": "starting price",
    "stock": 100,
   "thumbnail": "https://drive.google.com/uc?export=view&id=1HPq71Ko-WrZAzjxcVmMydut5w4ntH98l",
    "images": [ 
                "https://drive.google.com/uc?export=view&id=1_wVbCdJbErSf34Ph0vynO0M5alON6Ehi",
                "https://drive.google.com/uc?export=view&id=1HPq71Ko-WrZAzjxcVmMydut5w4ntH98l",
                "https://drive.google.com/uc?export=view&id=1d7X87QgQW-VXbQao9dYsbGDhTO1ROOu6",
                "https://drive.google.com/uc?export=view&id=1j3bwTsyiiwJRSjUbShYnut8biZlZa8m_",
                "https://drive.google.com/uc?export=view&id=1srkP6j-fvflb4pisllHqI4S3DC7zO4mB",
                "https://drive.google.com/uc?export=view&id=1yaqhQPyTxktdhrIdksXBFNLaWQI7TvHp"
    ],
    "approved": true,
    "status": "approved",
    "addedByAdmin": true,
    "vendorName": "Visit Kokan Team",
    "vendorId": null,
    "rating": 4.8,
    "reviewCount": 50,
    "createdAt": "2026-05-10T00:00:00.000Z",
    "updatedAt": "2026-05-10T00:00:00.000Z",
    "variants": [
      {
        "id": 1,
        "weight": "500g",
        "price": 130,
        "stock": 50,
        "sku": "FISH_MASALA"
      }
    ],
    "tags": [
      "fish",
      "konkan"
    ]
  },
  {
    "name": "Chicken Masala",
    "slug": "chicken-masala",
    "category": "spices",
    "price": 120,
    "region": "Sindhudurg",
    "unit": "starting price",
    "stock": 100,
    "thumbnail": "https://drive.google.com/uc?export=view&id=1HPq71Ko-WrZAzjxcVmMydut5w4ntH98l",
    "images": [ 
                "https://drive.google.com/uc?export=view&id=1_wVbCdJbErSf34Ph0vynO0M5alON6Ehi",
                "https://drive.google.com/uc?export=view&id=1HPq71Ko-WrZAzjxcVmMydut5w4ntH98l",
                "https://drive.google.com/uc?export=view&id=1d7X87QgQW-VXbQao9dYsbGDhTO1ROOu6",
                "https://drive.google.com/uc?export=view&id=1j3bwTsyiiwJRSjUbShYnut8biZlZa8m_",
                "https://drive.google.com/uc?export=view&id=1srkP6j-fvflb4pisllHqI4S3DC7zO4mB",
                "https://drive.google.com/uc?export=view&id=1yaqhQPyTxktdhrIdksXBFNLaWQI7TvHp"
    ],
    "approved": true,
    "status": "approved",
    "addedByAdmin": true,
    "vendorName": "Visit Kokan Team",
    "vendorId": null,
    "rating": 4.8,
    "reviewCount": 50,
    "createdAt": "2026-05-10T00:00:00.000Z",
    "updatedAt": "2026-05-10T00:00:00.000Z",
    "variants": [
      {
        "id": 1,
        "weight": "500g",
        "price": 120,
        "stock": 50,
        "sku": "CHICKEN_MASALA"
      }
    ],
    "tags": [
      "chicken",
      "konkan"
    ]
  },
  {
    "name": "Garam Masala",
    "slug": "garam-masala",
    "category": "spices",
    "price": 110,
    "region": "Sindhudurg",
    "unit": "starting price",
    "stock": 100,
    "thumbnail": "https://drive.google.com/uc?export=view&id=1HPq71Ko-WrZAzjxcVmMydut5w4ntH98l",
    "images": [ 
                "https://drive.google.com/uc?export=view&id=1_wVbCdJbErSf34Ph0vynO0M5alON6Ehi",
                "https://drive.google.com/uc?export=view&id=1HPq71Ko-WrZAzjxcVmMydut5w4ntH98l",
                "https://drive.google.com/uc?export=view&id=1d7X87QgQW-VXbQao9dYsbGDhTO1ROOu6",
                "https://drive.google.com/uc?export=view&id=1j3bwTsyiiwJRSjUbShYnut8biZlZa8m_",
                "https://drive.google.com/uc?export=view&id=1srkP6j-fvflb4pisllHqI4S3DC7zO4mB",
                "https://drive.google.com/uc?export=view&id=1yaqhQPyTxktdhrIdksXBFNLaWQI7TvHp"
    ],
    "approved": true,
    "status": "approved",
    "addedByAdmin": true,
    "vendorName": "Visit Kokan Team",
    "vendorId": null,
    "rating": 4.8,
    "reviewCount": 50,
    "createdAt": "2026-05-10T00:00:00.000Z",
    "updatedAt": "2026-05-10T00:00:00.000Z",
    "variants": [
      {
        "id": 1,
        "weight": "500g",
        "price": 110,
        "stock": 50,
        "sku": "GARAM_MASALA"
      }
    ],
    "tags": [
      "garam",
      "konkan"
    ]
  },
  {
    "name": "Mango Pickle",
    "slug": "mango-pickle",
    "category": "pickles",
    "price": 180,
    "region": "Sindhudurg",
    "unit": "starting price",
    "stock": 100,
    "thumbnail": "https://drive.google.com/uc?export=view&id=1HPq71Ko-WrZAzjxcVmMydut5w4ntH98l",
    "images": [ 
                "https://drive.google.com/uc?export=view&id=1_wVbCdJbErSf34Ph0vynO0M5alON6Ehi",
                "https://drive.google.com/uc?export=view&id=1HPq71Ko-WrZAzjxcVmMydut5w4ntH98l",
                "https://drive.google.com/uc?export=view&id=1d7X87QgQW-VXbQao9dYsbGDhTO1ROOu6",
                "https://drive.google.com/uc?export=view&id=1j3bwTsyiiwJRSjUbShYnut8biZlZa8m_",
                "https://drive.google.com/uc?export=view&id=1srkP6j-fvflb4pisllHqI4S3DC7zO4mB",
                "https://drive.google.com/uc?export=view&id=1yaqhQPyTxktdhrIdksXBFNLaWQI7TvHp"
    ],
    "approved": true,
    "status": "approved",
    "addedByAdmin": true,
    "vendorName": "Visit Kokan Team",
    "vendorId": null,
    "rating": 4.8,
    "reviewCount": 50,
    "createdAt": "2026-05-10T00:00:00.000Z",
    "updatedAt": "2026-05-10T00:00:00.000Z",
    "variants": [
      {
        "id": 1,
        "weight": "500g",
        "price": 180,
        "stock": 50,
        "sku": "MANGO_PICKLE"
      }
    ],
    "tags": [
      "mango",
      "konkan"
    ]
  },
  {
    "name": "Ghavane Pith",
    "slug": "ghavane-pith",
    "category": "flour",
    "price": 90,
    "region": "Sindhudurg",
    "unit": "starting price",
    "stock": 100,
    "thumbnail": "https://drive.google.com/uc?export=view&id=1HPq71Ko-WrZAzjxcVmMydut5w4ntH98l",
    "images": [ 
                "https://drive.google.com/uc?export=view&id=1_wVbCdJbErSf34Ph0vynO0M5alON6Ehi",
                "https://drive.google.com/uc?export=view&id=1HPq71Ko-WrZAzjxcVmMydut5w4ntH98l",
                "https://drive.google.com/uc?export=view&id=1d7X87QgQW-VXbQao9dYsbGDhTO1ROOu6",
                "https://drive.google.com/uc?export=view&id=1j3bwTsyiiwJRSjUbShYnut8biZlZa8m_",
                "https://drive.google.com/uc?export=view&id=1srkP6j-fvflb4pisllHqI4S3DC7zO4mB",
                "https://drive.google.com/uc?export=view&id=1yaqhQPyTxktdhrIdksXBFNLaWQI7TvHp"
    ],
    "approved": true,
    "status": "approved",
    "addedByAdmin": true,
    "vendorName": "Visit Kokan Team",
    "vendorId": null,
    "rating": 4.8,
    "reviewCount": 50,
    "createdAt": "2026-05-10T00:00:00.000Z",
    "updatedAt": "2026-05-10T00:00:00.000Z",
    "variants": [
      {
        "id": 1,
        "weight": "500g",
        "price": 90,
        "stock": 50,
        "sku": "GHAVANE_PITH"
      }
    ],
    "tags": [
      "ghavane",
      "konkan"
    ]
  },
  {
    "name": "Bhakri Pith",
    "slug": "bhakri-pith",
    "category": "flour",
    "price": 80,
    "region": "Sindhudurg",
    "unit": "starting price",
    "stock": 100,
    "thumbnail": "https://drive.google.com/uc?export=view&id=1HPq71Ko-WrZAzjxcVmMydut5w4ntH98l",
    "images": [ 
                "https://drive.google.com/uc?export=view&id=1_wVbCdJbErSf34Ph0vynO0M5alON6Ehi",
                "https://drive.google.com/uc?export=view&id=1HPq71Ko-WrZAzjxcVmMydut5w4ntH98l",
                "https://drive.google.com/uc?export=view&id=1d7X87QgQW-VXbQao9dYsbGDhTO1ROOu6",
                "https://drive.google.com/uc?export=view&id=1j3bwTsyiiwJRSjUbShYnut8biZlZa8m_",
                "https://drive.google.com/uc?export=view&id=1srkP6j-fvflb4pisllHqI4S3DC7zO4mB",
                "https://drive.google.com/uc?export=view&id=1yaqhQPyTxktdhrIdksXBFNLaWQI7TvHp"
    ],
    "approved": true,
    "status": "approved",
    "addedByAdmin": true,
    "vendorName": "Visit Kokan Team",
    "vendorId": null,
    "rating": 4.8,
    "reviewCount": 50,
    "createdAt": "2026-05-10T00:00:00.000Z",
    "updatedAt": "2026-05-10T00:00:00.000Z",
    "variants": [
      {
        "id": 1,
        "weight": "500g",
        "price": 80,
        "stock": 50,
        "sku": "BHAKRI_PITH"
      }
    ],
    "tags": [
      "bhakri",
      "konkan"
    ]
  },
  {
    "name": "Kulith Pith",
    "slug": "kulith-pith",
    "category": "flour",
    "price": 110,
    "region": "Sindhudurg",
    "unit": "starting price",
    "stock": 100,
    "thumbnail": "https://drive.google.com/uc?export=view&id=1HPq71Ko-WrZAzjxcVmMydut5w4ntH98l",
    "images": [ 
                "https://drive.google.com/uc?export=view&id=1_wVbCdJbErSf34Ph0vynO0M5alON6Ehi",
                "https://drive.google.com/uc?export=view&id=1HPq71Ko-WrZAzjxcVmMydut5w4ntH98l",
                "https://drive.google.com/uc?export=view&id=1d7X87QgQW-VXbQao9dYsbGDhTO1ROOu6",
                "https://drive.google.com/uc?export=view&id=1j3bwTsyiiwJRSjUbShYnut8biZlZa8m_",
                "https://drive.google.com/uc?export=view&id=1srkP6j-fvflb4pisllHqI4S3DC7zO4mB",
                "https://drive.google.com/uc?export=view&id=1yaqhQPyTxktdhrIdksXBFNLaWQI7TvHp"
    ],
    "approved": true,
    "status": "approved",
    "addedByAdmin": true,
    "vendorName": "Visit Kokan Team",
    "vendorId": null,
    "rating": 4.8,
    "reviewCount": 50,
    "createdAt": "2026-05-10T00:00:00.000Z",
    "updatedAt": "2026-05-10T00:00:00.000Z",
    "variants": [
      {
        "id": 1,
        "weight": "500g",
        "price": 110,
        "stock": 50,
        "sku": "KULITH_PITH"
      }
    ],
    "tags": [
      "kulith",
      "konkan"
    ]
  }
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