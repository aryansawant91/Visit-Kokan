import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();

const blogs = [
  {
    title: "Hidden Beaches of Sindhudurg You Must Visit",
    excerpt: "Sindhudurg is home to some of Maharashtra's most pristine and untouched beaches. Here's our guide to the ones most tourists miss.",
    content: `Sindhudurg district stretches along one of India's most beautiful coastlines, yet many of its finest beaches remain blissfully uncrowded. While Tarkarli gets most of the attention, there's a whole world of hidden coves and pristine shores waiting to be discovered.

Vengurla Beach is perhaps the most underrated of them all. Located at the southern tip of Sindhudurg, this wide, clean stretch of sand is perfect for long morning walks. The water here is exceptionally calm thanks to natural rock formations that act as breakers.

Mochemad Beach near Malvan is a local favourite. You won't find beach shacks or loud music here — just fishing boats, coconut palms and the sound of waves. The sunset from this beach is genuinely spectacular.

Nivti Beach sits between Vengurla and the Goa border. It's reached via a narrow road through cashew plantations, which is part of the charm. The beach itself is long, clean and almost always empty.

Redi Beach near Reddi village is anchored by an ancient Portuguese fort at one end. You can swim, explore the fort ruins and watch local fishermen bring in their catch all in the same afternoon.

For the best experience, visit between November and February when the weather is perfect. Carry your own water and snacks as facilities are minimal — but that's exactly what makes these beaches so special.`,
    coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    category: "beach-guides",
    tags: ["beaches", "sindhudurg", "hidden gems", "travel"],
    authorId: "admin",
    authorName: "Visit Kokan Team",
    authorRole: "admin",
    status: "approved",
    approved: true,
    readTime: 4,
    views: 1240,
  },
  {
    title: "The Complete Guide to Harishchandragad Trek",
    excerpt: "One of Maharashtra's most iconic treks, Harishchandragad offers dramatic cliffs, ancient caves and breathtaking views. Here's everything you need to know.",
    content: `Harishchandragad is arguably the most dramatic trek in Maharashtra. Standing at 1,424 metres, it offers the famous Kokan Kada — a concave cliff that hangs over a sheer 1,000 foot drop into the Konkan plains below. If you do one trek in your life, make it this one.

The most popular route starts from Khireshwar village. The trail winds through dense forest before opening up to rocky terrain. Expect the trek to take 4-5 hours one way. The path is well-marked but gets slippery during and after monsoon.

At the summit, you'll find the ancient Harishchandreshwar temple — a beautiful structure carved into the rock face. The cave shelters here can accommodate trekkers overnight, which is highly recommended. Watching the sunset from Kokan Kada and then the stars emerge over the Konkan plains is an experience you won't forget.

The best time to trek is October to February. Monsoon treks (June-September) are popular among experienced trekkers but require caution. Summers are manageable in the early morning but the afternoon heat can be brutal.

What to carry: 3-4 litres of water minimum, energy bars, a good torch, warm layers for the night, and basic first aid. Mobile network is unreliable at the summit so download offline maps.

A guide from Khireshwar is recommended for first-timers and costs around ₹800-1200 for the full day. Local homestays in Khireshwar village are simple but comfortable.`,
    coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    category: "trek-guides",
    tags: ["trek", "harishchandragad", "maharashtra", "adventure"],
    authorId: "admin",
    authorName: "Visit Kokan Team",
    authorRole: "admin",
    status: "approved",
    approved: true,
    readTime: 5,
    views: 2180,
  },
  {
    title: "Alphonso Mango Season: A Food Lover's Guide to Ratnagiri",
    excerpt: "Every April and May, Ratnagiri transforms into the mango capital of the world. Here's how to make the most of Alphonso season.",
    content: `There is no mango like the Ratnagiri Alphonso. Known locally as Hapus, this golden fruit has a flavour profile that's impossible to replicate — intensely sweet, saffron-rich and completely free of fibre. If you've only ever eaten Alphonsos from a supermarket, you haven't really eaten one.

The season runs from mid-April to early June. This is also when Ratnagiri is at its most alive, with mango stalls lining every road and the air carrying a faint sweetness from the orchards.

The best way to experience the season is to visit a mango orchard directly. Many farms around Ratnagiri, Devgad and Vengurla offer orchard visits where you can pick fruit and eat it fresh off the tree. There's nothing quite like slicing open a perfectly ripe Hapus that's been warming in the sun all morning.

Ratnagiri town has several excellent mango product shops where you can buy aamras (mango pulp), mango pickle, dry mango powder and mango jam to take home. Sahakari Bhandar and several GI-certified farms ship directly to customers across India.

For food, don't miss the simple thali served at local restaurants during mango season — rice, dal, a vegetable and a bowl of fresh aamras. It costs ₹100-150 and is one of the most satisfying meals you'll have anywhere.

If you're visiting purely for mangoes, stay for at least 3-4 days. The Konkan coast in April is warm but the evenings are pleasant. Combine your visit with a trip to Ganpatipule beach, which is just 25km from Ratnagiri town.`,
    coverImage: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&q=80",
    category: "food-culture",
    tags: ["alphonso", "mango", "ratnagiri", "food", "seasonal"],
    authorId: "admin",
    authorName: "Visit Kokan Team",
    authorRole: "admin",
    status: "approved",
    approved: true,
    readTime: 5,
    views: 3420,
  },
  {
    title: "Malvan: The Complete Travel Guide",
    excerpt: "Malvan is Sindhudurg's most vibrant town — famous for its seafood, Sindhudurg Fort and the crystal clear waters of Tarkarli. Here's your complete guide.",
    content: `Malvan sits on the southern edge of Sindhudurg district and has long been the cultural and culinary heart of the Konkan coast. It's also the gateway to Tarkarli, which has some of the clearest water on India's west coast.

The Sindhudurg Fort is the centrepiece of any Malvan visit. Built by Chhatrapati Shivaji Maharaj in the 17th century, it sits on a small island just offshore. Boats to the fort run regularly from the main jetty and the fare is nominal. Inside, you'll find the original construction remarkably well preserved — the walls, bastions and a small temple dedicated to Shivaji.

Tarkarli beach, about 8km from Malvan town, is where most tourists spend their days. The water here is extraordinarily clear — you can see the bottom even in chest-deep water. Scuba diving and snorkelling are popular, with several PADI-certified dive centres operating from the beach. A beginner's dive costs around ₹1,500-2,000.

The food in Malvan is exceptional. This is Malvani cuisine — heavily coconut-based, with lots of dried red chillies and kokum. The fish thali at Chaitanya or Atithi Bamboo is legendary. Order the surmai (kingfish) fry, sol kadhi (a cooling pink drink made from kokum and coconut milk) and the prawn curry. Budget ₹300-500 per person.

The best time to visit is November to February. Malvan is very crowded during Diwali and Christmas weeks, so book accommodation early if visiting then. The monsoon (June-September) is beautiful but rough seas mean the fort and Tarkarli activities are unavailable.`,
    coverImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    category: "travel-tips",
    tags: ["malvan", "sindhudurg", "tarkarli", "seafood", "fort"],
    authorId: "admin",
    authorName: "Visit Kokan Team",
    authorRole: "admin",
    status: "approved",
    approved: true,
    readTime: 6,
    views: 4560,
  },
  {
    title: "Ganesh Chaturthi on the Konkan Coast",
    excerpt: "Ganesh Chaturthi is celebrated with unmatched fervour along the Konkan coast. Here's what makes it special and how to experience it authentically.",
    content: `No festival captures the soul of the Konkan coast like Ganesh Chaturthi. While Mumbai's celebrations are famous worldwide, the villages and towns of the Konkan offer something far more intimate and spiritually resonant.

The festival runs for 10 days, typically in August or September. In coastal villages, every home has its own Ganesh idol — often a beautifully crafted clay figure made by local artisans. The idol is worshipped twice daily with offerings of modak (sweet dumplings), flowers and incense.

In towns like Malvan, Ratnagiri and Chiplun, public pandals (temporary structures) are built to house enormous community idols. These are elaborately decorated and lit up spectacularly at night. The entire community comes together to organise events, cultural performances and feasts.

The final day, Anant Chaturdashi, is when the immersion (visarjan) takes place. Processions wind through town with the idols, accompanied by drumming, dancing and chanting. The immersion in the sea is a deeply emotional moment — residents bid farewell to Ganesh until the following year.

For visitors, this is one of the best times to experience authentic Konkan culture. Locals are extraordinarily welcoming during the festival. You'll be invited to share meals, watch the aarti (prayer ceremony) and join the procession. Accept every invitation — this is the real Konkan.

If you're planning a visit during Chaturthi, book accommodation 2-3 months in advance. Hotels fill up entirely and home stays are a better option as they give you direct access to family celebrations.`,
    coverImage: "https://images.unsplash.com/photo-1567591370984-0b60efb49e5a?w=800&q=80",
    category: "festivals",
    tags: ["ganesh chaturthi", "festivals", "culture", "konkan"],
    authorId: "admin",
    authorName: "Visit Kokan Team",
    authorRole: "admin",
    status: "approved",
    approved: true,
    readTime: 5,
    views: 2890,
  },
  {
    title: "The Fishing Villages of Konkan: A Slower Way to Travel",
    excerpt: "Beyond the tourist beaches and forts, the Konkan coast's fishing villages offer a glimpse into a way of life that has changed little over centuries.",
    content: `The best way to understand the Konkan is to slow down. The fishing villages that dot the coastline — Harne, Dabhol, Veldur, Kunkeshwar — are places where the rhythm of life is still dictated by tides and seasons rather than clocks and calendars.

Harne is a small fishing village near Dapoli that most tourists pass through on the way to Anjarle beach. It's worth stopping here for longer. Early morning, the fishing boats return with their catch and the harbour comes alive with activity. Fish are sorted, auctioned and loaded onto trucks in a matter of hours.

The coastal communities of Konkan are predominantly Koli — Maharashtra's original fishing community. Their cuisine is distinct from inland Marathi food: simpler, saltier, heavily reliant on dried fish and fresh coconut. The dalcha (a dried fish preparation) eaten with rice and coconut milk curry is unforgettable.

Dabhol, on the banks of the Vashishti river, was once one of Konkan's most important trading ports. Its decline means the old Portuguese-influenced architecture has survived largely intact. Walking through Dabhol's old quarter feels like stepping back into the 16th century.

For accommodation in these villages, home stays run by local families are the only option — and the best one. You'll eat what the family eats, sleep when it gets dark and wake when the boats go out. A night or two in a Konkan fishing village is worth more than a week in any beach resort.

Approach these communities with respect and genuine curiosity. Ask before photographing, always accept offered food and learn even a few words of Marathi — it goes a long way.`,
    coverImage: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80",
    category: "local-life",
    tags: ["fishing villages", "local life", "authentic", "slow travel"],
    authorId: "admin",
    authorName: "Visit Kokan Team",
    authorRole: "admin",
    status: "approved",
    approved: true,
    readTime: 6,
    views: 1670,
  },
  {
    title: "Kokum: The Superfruit of the Konkan Coast",
    excerpt: "Kokum is the Konkan's most distinctive ingredient — tart, cooling and packed with health benefits. Here's everything you need to know about this remarkable fruit.",
    content: `Walk into any Konkan kitchen and you'll find kokum. This small, deep purple fruit — related to the mangosteen — grows prolifically in the forests and orchards of the Sahyadri foothills. It's been central to Konkan cooking and medicine for centuries.

The fruit itself is intensely sour. It's rarely eaten raw but used dried to add tartness to curries, or pressed into a concentrate called aamsol. The most famous application is sol kadhi — a pink, frothy drink made from kokum and coconut milk that's served at the end of meals as a digestive. It's cooling, subtly sweet-sour and completely addictive.

Kokum has a remarkable nutritional profile. It's high in garcinol, an antioxidant with anti-inflammatory properties. Traditional medicine has long used kokum for heat-related conditions, digestive issues and skin problems. Modern research is increasingly validating these traditional uses.

The best kokum products come from the Sindhudurg and Ratnagiri districts, where the fruit is grown organically and processed by hand. Kokum butter — extracted from the seeds — is a prized cosmetic ingredient used in high-end skincare products.

You can buy kokum in several forms: dried whole kokum for cooking, kokum syrup for making sol kadhi, kokum sharbat (sweetened concentrate for drinking) and kokum butter. All of these make excellent gifts and are available at farm shops and cooperative stores throughout the Konkan.

If you visit during the kokum season (March-May), look for farms selling fresh fruit. Eating fresh kokum — sharp, complex and unlike anything else — is a genuine culinary experience.`,
    coverImage: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80",
    category: "food-culture",
    tags: ["kokum", "food", "local produce", "health"],
    authorId: "admin",
    authorName: "Visit Kokan Team",
    authorRole: "admin",
    status: "approved",
    approved: true,
    readTime: 5,
    views: 2130,
  },
  {
    title: "Monsoon Magic: Why the Konkan is Beautiful in the Rain",
    excerpt: "Most tourists avoid the Konkan in monsoon. They're missing out on one of India's most dramatic and beautiful seasonal transformations.",
    content: `The conventional wisdom about Konkan travel says: avoid monsoon. The roads get rough, the sea is dangerous, and the rain is relentless. All of this is true. And yet, the Konkan in monsoon is one of the most beautiful places in India.

From June to September, the Sahyadri mountains receive some of the heaviest rainfall in the country. This transforms the landscape entirely. The dry, scrubby hillsides of summer turn an almost impossibly vivid green. Every valley fills with waterfalls — some permanent, many seasonal — that flow for just these four months.

The rice paddies that terrace the lower slopes turn from bare earth to brilliant green as the season progresses. Walking through a monsoon-flooded paddy field, with the sound of frogs and rain and distant waterfalls, is as close to sensory overload as it gets.

The famous Konkan waterfalls are at their peak in July and August. Amboli Ghat near Sawantwadi has dozens of waterfalls along a single stretch of road. Tambdi Surla in Goa, technically just outside Konkan but part of the same landscape, has a spectacular seasonal fall right next to an ancient temple.

The practical considerations: roads can get waterlogged, some mountain passes close temporarily, and coastal activities are completely off. Plan for indoor and valley travel rather than beach visits. Homestays in the ghats — Amboli, Phonda, Amba — are wonderful during monsoon.

The food during monsoon is also distinctive. Warming lentil soups, freshly made rice bhakri, and the season's vegetables — drum sticks, bitter gourds, colocasia — appear on every plate. The Konkan monsoon diet is designed for the weather and it shows.`,
    coverImage: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&q=80",
    category: "travel-tips",
    tags: ["monsoon", "seasonal travel", "waterfalls", "nature"],
    authorId: "admin",
    authorName: "Visit Kokan Team",
    authorRole: "admin",
    status: "approved",
    approved: true,
    readTime: 5,
    views: 3210,
  },
];

async function seedBlogs() {
  console.log("Seeding blogs...");
  for (const blog of blogs) {
    const slug =
      blog.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") +
      "-" +
      Date.now();

    await db.collection("blogs").add({
      ...blog,
      slug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log(`✅ Seeded: ${blog.title}`);
  }
  console.log("Done! 8 blogs seeded.");
}

seedBlogs().catch(console.error);