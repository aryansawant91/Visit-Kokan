import * as admin from "firebase-admin";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

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

// Category fallbacks in case any link is deleted or unavailable
const FALLBACK_CATEGORY_IMAGES: Record<string, string> = {
  spices: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80",
  nuts: "https://images.unsplash.com/photo-1509912760195-21d4c2053919?w=800&q=80",
  beverages: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
  condiments: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
  pickles: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&q=80",
  flour: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
  "gift-pack": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80",
  fruits: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&q=80",
};

async function downloadImage(url: string, destPath: string, category: string): Promise<boolean> {
  try {
    let cleanUrl = url;
    if (url.includes("drive.google.com")) {
      const idMatch = url.match(/id=([a-zA-Z0-9_-]+)/) || url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (idMatch && idMatch[1]) {
        cleanUrl = `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
      }
    }

    let res = await fetch(cleanUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    const contentType = res.headers.get("content-type") || "";

    // If Google Drive served an HTML confirm page or failed, try fallback
    if (!res.ok || !contentType.startsWith("image/")) {
      const fallbackUrl = FALLBACK_CATEGORY_IMAGES[category] || FALLBACK_CATEGORY_IMAGES["spices"];
      console.warn(`[WARN] Drive download returned ${contentType} for ${url}. Using high-res category fallback: ${fallbackUrl}`);
      res = await fetch(fallbackUrl);
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length < 1000) {
      console.warn(`[WARN] Downloaded buffer too small (${buffer.length} bytes), falling back to stock image.`);
      const fallbackUrl = FALLBACK_CATEGORY_IMAGES[category] || FALLBACK_CATEGORY_IMAGES["spices"];
      const fbRes = await fetch(fallbackUrl);
      const fbBuffer = Buffer.from(await fbRes.arrayBuffer());
      fs.writeFileSync(destPath, fbBuffer);
      return true;
    }

    fs.writeFileSync(destPath, buffer);
    return true;
  } catch (err: any) {
    console.error(`[ERROR] Failed to download ${url}:`, err.message);
    try {
      const fallbackUrl = FALLBACK_CATEGORY_IMAGES[category] || FALLBACK_CATEGORY_IMAGES["spices"];
      const fbRes = await fetch(fallbackUrl);
      const fbBuffer = Buffer.from(await fbRes.arrayBuffer());
      fs.writeFileSync(destPath, fbBuffer);
      return true;
    } catch {
      return false;
    }
  }
}

async function migrate() {
  console.log("=== STARTING GOOGLE DRIVE IMAGE MIGRATION ===");

  const snap = await db.collection("products").get();
  console.log(`Found ${snap.size} products in Firestore.`);

  let migratedCount = 0;

  for (const doc of snap.docs) {
    const data = doc.data();
    const slug = data.slug || doc.id;
    const category = data.category || "spices";
    const images: string[] = data.images || [];
    let thumbnail: string = data.thumbnail || "";

    const hasDriveImages = images.some((img) => typeof img === "string" && img.includes("drive.google.com"));
    const hasDriveThumb = typeof thumbnail === "string" && thumbnail.includes("drive.google.com");

    if (!hasDriveImages && !hasDriveThumb) {
      continue;
    }

    console.log(`\nProcessing: "${data.name}" (${slug})`);

    const productDir = path.join(process.cwd(), "public", "images", "products", slug);
    if (!fs.existsSync(productDir)) {
      fs.mkdirSync(productDir, { recursive: true });
    }

    const updatedImages: string[] = [];

    for (let i = 0; i < images.length; i++) {
      const imgUrl = images[i];
      if (typeof imgUrl === "string" && imgUrl.includes("drive.google.com")) {
        const fileName = `${i + 1}.jpg`;
        const filePath = path.join(productDir, fileName);
        console.log(`  Downloading image [${i + 1}/${images.length}]...`);
        const ok = await downloadImage(imgUrl, filePath, category);
        if (ok) {
          const localPath = `/images/products/${slug}/${fileName}`;
          updatedImages.push(localPath);
          console.log(`  -> Saved to ${localPath} (${fs.statSync(filePath).size} bytes)`);
        } else {
          updatedImages.push(imgUrl);
        }
      } else {
        updatedImages.push(imgUrl);
      }
    }

    let updatedThumb = thumbnail;
    if (hasDriveThumb) {
      if (updatedImages.length > 0) {
        updatedThumb = updatedImages[0];
      } else {
        const thumbPath = path.join(productDir, "thumb.jpg");
        const ok = await downloadImage(thumbnail, thumbPath, category);
        if (ok) {
          updatedThumb = `/images/products/${slug}/thumb.jpg`;
        }
      }
    }

    // Update Firestore product doc
    await db.collection("products").doc(doc.id).update({
      images: updatedImages,
      thumbnail: updatedThumb,
      updatedAt: new Date().toISOString(),
    });

    console.log(`✓ Updated Firestore document ${doc.id} (${data.name})`);
    migratedCount++;
  }

  console.log(`\n=== MIGRATION COMPLETE! Migrated ${migratedCount} products. ===`);
}

migrate().catch(console.error);

