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

interface DestinationPhotoUpdate {
  slug: string;
  name: string;
  region?: string;
  district?: string;
  heroImage: string;
  images: string[];
}

const UPDATES: DestinationPhotoUpdate[] = [
  {
    slug: "devgad",
    name: "Devgad",
    heroImage: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Devgad_fort.JPG",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/c/c9/Devgad_fort.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/9/9a/Deogad_Beach_in_Sindhudurg_district_%2CKonkan_region_Maharashtra%2C_India.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/5/55/Devgad_Beach_from_a_Hill.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/b/b8/Kunakeshwar.JPG",
    ],
  },
  {
    slug: "vijaydurg",
    name: "Vijaydurg",
    heroImage: "https://upload.wikimedia.org/wikipedia/commons/d/d2/Vijaydurg_Fort.jpg",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/d/d2/Vijaydurg_Fort.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/4/41/Vijaydurg_fort_walls.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/1f/Vijaydurg_Fort_Entrance.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/a/af/Vijaydurg_Fort_Bastion.jpg",
    ],
  },
  {
    slug: "korlai-revdanda",
    name: "Korlai & Revdanda",
    heroImage: "https://upload.wikimedia.org/wikipedia/commons/5/50/Korlai4.jpg",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/5/50/Korlai4.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/69/Korlai_Fort.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/5/51/Revdanda_Fort_outer_walls_01.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/4/43/Revdanda_Fort_03.jpg",
    ],
  },
  {
    slug: "velas",
    name: "Velas",
    heroImage: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Olive_Ridley_Sea_Turtle_Hatchlings.jpg",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/4/4c/Olive_Ridley_Sea_Turtle_Hatchlings.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/e1/Hatchlings_of_Olive_Ridley.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/79/Kelshi_Village_-_panoramio.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/7/7d/Bankot_Fort.jpg",
    ],
  },
  {
    slug: "vengurla",
    name: "Vengurla",
    region: "Sindhudurg",
    district: "Sindhudurg",
    heroImage: "https://upload.wikimedia.org/wikipedia/commons/9/91/Sagreshvar_beach%2C_vengurla.jpg",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/9/91/Sagreshvar_beach%2C_vengurla.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/4/46/Vengurla_jetty.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/0/08/Suru_Trees_on_Shiroda_beach_%28Velaghar_%29_-_panoramio.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/0/03/Aerial_view_of_a_Vengurla_cashew_farm.jpg",
    ],
  },
  {
    slug: "prachin-konkan",
    name: "Prachin Konkan Museum",
    heroImage: "https://upload.wikimedia.org/wikipedia/commons/1/1a/PrachinKonkan-Museum-Entrance%2C_Ganpatipule.JPG",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/1/1a/PrachinKonkan-Museum-Entrance%2C_Ganpatipule.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/1/13/Antique_piece%3B_prachin_kokan_ganpatipule_rajwadi.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/4/40/Prachin_Kokan_variety_of_antique_pieces_of_Ganpatipule_Rajwadi.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/3/30/Ganpatipule-Temple.JPG",
    ],
  },
  {
    slug: "malgund",
    name: "Malgund",
    heroImage: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Malgund_creek%2C_Ganpatipule_%2852535141946%29.jpg",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/1/1e/Malgund_creek%2C_Ganpatipule_%2852535141946%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/dc/KaviKesavsoot-Birthplace.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/4/4a/Kavi-Kesavsooot-Birthplace-Backyard.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/6/60/GANPATIPULE_BEACH_%281%29.jpg",
    ],
  },
  {
    slug: "velneshwar",
    name: "Velneshwar Beach",
    heroImage: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Ratnagiri%2C_Velneshwar_-_panoramio_%28100%29.jpg",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/8/8a/Ratnagiri%2C_Velneshwar_-_panoramio_%28100%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/9/93/Ratnagiri%2C_Velneshwar_-_panoramio_%2882%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/e3/Ratnagiri%2C_Velneshwar_-_panoramio_%28102%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/e9/Ratnagiri%2C_Velneshwar_-_panoramio_%2887%29.jpg",
    ],
  },
  {
    slug: "achra",
    name: "Achara Beach",
    heroImage: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Achara_pirawadi_beach_-_my_village_-_panoramio.jpg",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/e/e9/Achara_pirawadi_beach_-_my_village_-_panoramio.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/2/26/..._backwaters_at_Achara_%287211162084%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/5/54/..._backwaters_at_Achara_%287211108938%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/e6/Achara_pirawdi_%28chawata_dev_prasann%29%29_-_panoramio.jpg",
    ],
  },
  {
    slug: "sawantwadi",
    name: "Sawantwadi",
    heroImage: "https://upload.wikimedia.org/wikipedia/commons/b/be/Sawantwadi_Palace_Sawantwadi_Maharashtra.jpg",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/b/be/Sawantwadi_Palace_Sawantwadi_Maharashtra.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/87/Sawantwadi_Palace_fa%C3%A7ade%2C_Maharashtra.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/0/02/Sawantwadi_Palace_courtyard%2C_Maharashtra.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/3/34/Sunset_at_Sawantwadi.jpg",
    ],
  },
  {
    slug: "kashid",
    name: "Kashid Beach",
    heroImage: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Kashid_Beach_1.jpg",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/a/ac/Kashid_Beach_1.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/0/03/Kashid_beach_6.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/5/56/Kashid_beach_8.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/8/85/View_of_Kashid_beach_%283395008502%29.jpg",
    ],
  },
];

async function updateRealPhotos() {
  console.log(`Starting real photo updates for ${UPDATES.length} destinations...`);

  for (const item of UPDATES) {
    const snap = await db.collection("destinations").where("slug", "==", item.slug).get();

    if (snap.empty) {
      console.warn(`⚠️ Destination with slug "${item.slug}" not found in Firestore!`);
      continue;
    }

    for (const doc of snap.docs) {
      const updateData: Record<string, any> = {
        images: item.images,
        coverImage: item.heroImage,
        heroImage: item.heroImage,
        image: item.heroImage,
        updatedAt: new Date().toISOString(),
      };

      if (item.region) {
        updateData.region = item.region;
      }
      if (item.district) {
        updateData.district = item.district;
      }

      await doc.ref.update(updateData);
      console.log(`✅ Updated ${item.name} (${item.slug}) with ${item.images.length} real authentic photos`);
    }
  }

  console.log("All destination real photos successfully updated in Firestore!");
}

updateRealPhotos()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error updating photos:", err);
    process.exit(1);
  });
