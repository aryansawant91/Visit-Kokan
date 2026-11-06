import { NextResponse } from "next/server";
import { adminDb as db } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

const PRODUCT_DESCRIPTIONS: Record<string, string> = {
  "kokum-agal": `### Visit Kokan Authentic Kokum Agal (Pure Kokum Extract)

Experience the true culinary soul of coastal Maharashtra with Visit Kokan Kokum Agal – 100% pure, natural, and unsweetened extract made from handpicked, sun-ripened kokum fruits (Garcinia indica) native to the lush red-soil orchards of Sindhudurg.

Kokum Agal is the essential heart of traditional Maharashtrian Solkadhi — whisked into fresh coconut milk with crushed garlic, fiery green chillies, rock salt, and fresh coriander. It is equally revered as a souring agent in authentic Konkan fish curries (Surmai & Pomfret), digestive rasams, and refreshing drinks. Sourced directly from local farmers in Sindhudurg, this pure extract contains natural hydroxycitric acid (HCA), antioxidants, and vitamin C, cherished for generations for its powerful natural cooling properties and digestive relief.

✅ 100% Pure & Concentrated Kokum Extract (Zero Added Sugar)
✅ Authentic Recipe Directly Sourced from Sindhudurg Orchards
✅ Indispensable for Traditional Solkadhi, Coastal Fish Curry & Rasam
✅ Natural Cooling Properties & Proven Ayurvedic Digestive Aid
✅ Zero Artificial Colors, Flavors, or Chemical Preservatives

**From coastal homestays to your family dining table, a single spoonful of Visit Kokan Kokum Agal brings the refreshing sea breeze and authentic tang of Konkan heritage into every meal.** 🌺🥥🌊`,

  "amsul-dried-kokum": `### Visit Kokan Kokum Amsul (Sun-Dried Kokum Rinds)

Bring home the authentic tangy heritage of the coastal kitchen with Visit Kokan Kokum Amsul — naturally sun-dried kokum rinds carefully sourced from village orchards across Sindhudurg and Ratnagiri.

Unlike commercial tamarind, Kokum Amsul imparts a clean, fruity tartness with a gorgeous deep ruby hue. It is an indispensable souring ingredient in traditional coastal curries, including Malvani Fish Curry, Dalimbi Usal, spicy Crab Masala, and Kokan-style Dal. Beyond its vibrant culinary role, kokum is celebrated across Konkan homes as a natural digestive and cooling superfood that combats acidity and heat exhaustion.

✅ 100% Sun-Dried Natural Kokum Rinds from Sindhudurg
✅ Traditional Souring Agent for Authentic Coastal Curries & Usal
✅ Imparts Natural Ruby Color and Tangy-Fruity Aroma
✅ Rich in Natural Antioxidants with Gentle Cooling Properties
✅ No Artificial Coloring, Sulfur, or Chemical Preservatives

**Add 2–3 rinds to your curries or dals during simmering and experience the timeless taste of coastal grandmother recipes.** 🌊🍛✨`,

  "kokum-syrup": `### Visit Kokan Kokum Syrup (Kokum Amrut Cooler)

Beat the summer heat and rejuvenate your body with Visit Kokan Kokum Syrup — an authentic sweet-and-tangy nectar crafted from the finest sun-ripened kokum fruits sourced from Sindhudurg farms.

Known across coastal Maharashtra as Kokum Amrut, this traditional beverage combines the luscious tartness of fresh kokum with natural sweetness, a subtle touch of roasted cumin, and black salt. It serves as an instant natural coolant, restoring electrolytes and soothing digestion after rich meals.

✅ Authentic Konkan Recipe Sourced from Sindhudurg Orchards
✅ Refreshing Sweet, Tangy & Cooling Coastal Beverage
✅ Easy Preparation: Mix 2–3 tbsp with Chilled Water or Soda
✅ Perfect for Summer Mocktails, Sodas & Party Coolers
✅ No Synthetic Food Dyes or Harmful Preservatives

**Every chilled sip of Visit Kokan Kokum Syrup feels like an ocean breeze beneath swaying coconut palms.** 🌺🥤🌴`,

  "malvani-masala": `### Visit Kokan Special Malvani Masala

Ignite your senses with the bold, fiery soul of southern Konkan with Visit Kokan Special Malvani Masala — an authentic spice blend perfected through generations of culinary heritage in Malvan and Sindhudurg.

Crafted from 24 hand-roasted whole spices, including aromatic Bedgi chillies, Dagad Phool (Stone Flower), Star Anise, Jaiphal (Nutmeg), and Coriander seeds, this masala delivers an irresistible mahogany red color, rich texture, and deeply satisfying heat. It is the signature soul of iconic dishes like Malvani Fish Curry, Kombdi Vade (Chicken Curry), Mutton Sukka, and spicy Kalya Vatanyachi Usal.

✅ 100% Authentic Malvan & Sindhudurg Coastal Heritage Recipe
✅ Stone-Ground Blend of 24 Whole Spices Wood-Roasted in Small Batches
✅ Signature Mahogany Red Color and Deep Coastal Aroma
✅ Perfect for Seafood Curries, Chicken Sukka & Traditional Usal
✅ Completely Free from Added MSG, Fillers, or Artificial Colors

**Bring the authentic warmth and pride of a Konkan family kitchen into your home with every spoonful.** 🌶️🌴🔥`,

  "fish-masala": `### Visit Kokan Coastal Fish Masala

Celebrate the sea's freshest bounty with Visit Kokan Fish Masala — an artisanal spice blend masterfully designed to enhance the delicate flavors of coastal seafood.

Formulated with fragrant fennel, whole coriander seeds, turmeric, black pepper, and vibrant Konkan red chillies, this masala provides the perfect balance of spice, citrusy undertones, and aromatic depth without overpowering the natural sweetness of fresh fish. Whether preparing Surmai Rava Fry, spicy Pomfret Curry, Prawns Sukka, or Bangda Tikka, this blend guarantees restaurant-quality coastal flavor every time.

✅ Authentic Coastal Konkan Recipe Inspired by Seaside Homes
✅ Perfectly Balanced for Surmai, Pomfret, Prawns & Crab
✅ Ideal for Both Crispy Fish Fry Marinades and Rich Curries
✅ Made from 100% Natural, Freshly Roasted Whole Spices
✅ Zero Artificial Preservatives, Colors, or MSG

**Transform fresh seafood into a coastal feast that captures the authentic taste of Konkan shores.** 🌊🐟✨`,

  "chicken-masala": `### Visit Kokan Gavran Chicken Masala

Experience the hearty richness of authentic village cooking with Visit Kokan Gavran Chicken Masala — a full-bodied spice blend inspired by rustic coastal Sunday feasts.

Featuring a generous blend of roasted coriander seeds, black peppercorns, cloves, green cardamom, cinnamon, and fiery red chillies, this masala creates thick, aromatic gravies with an intoxicating aroma and rich red sheen. It pairs brilliantly with local staples like soft rice Bhakri, crispy Ghavane, or traditional puffed Kombdi Vade.

✅ Traditional Gavran-Style Coastal Poultry Masala
✅ Whole Spices Slow-Roasted and Coarsely Ground for Depth
✅ Delivers Thick, Highly Fragrant Curries & Smoky Chicken Sukka
✅ Authentic Home-Kitchen Aroma with Balanced Pungency
✅ 100% Pure & Free from Chemical Colors or Preservatives

**One spoonful fills your home with the mouthwatering aroma of a genuine Konkan countryside feast.** 🍗🔥🌴`,

  "garam-masala": `### Visit Kokan Royal Garam Masala

Elevate everyday cooking to royal heights with Visit Kokan Garam Masala — an exquisite small-batch blend of premium whole spices sourced from the Western Ghats.

Gently roasted to release volatile essential oils, this aromatic blend brings together green cardamom, cloves, Ceylon cinnamon, mace (javitri), black pepper, and bay leaves. Just a pinch sprinkled towards the end of cooking unlocks an intoxicating fragrance and refined warmth in curries, biryanis, gravies, and seasonal sprouted usals.

✅ Handcrafted Small-Batch Blend of Western Ghats Whole Spices
✅ Intensely Aromatic — A Single Pinch Delivers Full Flavor
✅ Ideal for Festive Dishes, Vegetable Curries, Usal & Biryani
✅ Preserves Natural Essential Oils Through Gentle Roasting
✅ Zero Fillers, Salt, or Artificial Additives

**The secret finishing touch for chefs and home cooks who cherish refined, authentic flavor.** 🌿✨🍲`,

  "bhakri-pith": `### Visit Kokan Traditional Stone-Ground Bhakri Pith

Savor the rustic, wholesome nutrition of the Konkan hearth with Visit Kokan Bhakri Pith — a premium stone-ground flour blend milled specifically for making soft, puffed, and flavorful coastal Bhakris.

Processed on traditional slow-speed stone mills to protect natural grains and fiber, this flour yields pliable dough that pats out easily by hand without tearing. Whether paired with fiery Malvani Fish Curry, rustic Pithla with green chilli Thecha, or hearty Gavran Chicken, this Bhakri is the foundation of genuine Maharashtrian comfort food.

✅ Slow Stone-Ground Traditional Konkan Flour Blend
✅ Milled to Perfect Consistency for Soft, Puffed Bhakris
✅ High in Dietary Fiber, Wholesome & Naturally Nutritious
✅ The Perfect Essential Accompaniment to Fish Curries & Pithla
✅ 100% Pure Whole Grains — No Additives or Bleaching Agents

**Bring the warmth of a rustic village hearth directly to your family table.** 🌾🫓🔥`,

  "ghavane-pith": `### Visit Kokan Authentic Ghavane Pith (Rice Crepe Flour)

Wake up to the beloved breakfast tradition of coastal Maharashtra with Visit Kokan Ghavane Pith — specially milled rice flour crafted to prepare authentic, paper-thin Konkan Ghavane.

Selected from aged local rice varieties of Konkan, this flour is ground to a silky, delicate texture that blends seamlessly with water into a smooth batter. Poured onto a seasoned hot iron griddle (Bidacha Tawa), it transforms within minutes into lacy, cloud-soft, melt-in-the-mouth rice crepes without sticking or breaking.

✅ Authentic Coastal Konkan Recipe Made from Aged Local Rice
✅ Silky-Fine Texture Yields Lacy, Cloud-Soft Ghavane (Neer Dosa Style)
✅ Quick & Effortless Preparation — Ready in Just 2 Minutes
✅ Delicious Paired with Coconut Chutney or Sweet Jaggery Coconut Milk
✅ 100% Pure, Naturally Gluten-Free, Zero Preservatives

**Light, delicate, and comforting — the quintessential taste of a sunny morning in Konkan.** 🥥🥞☀️`,

  "kulith-pith": `### Visit Kokan Kulith Pith (Horse Gram Superfood Flour)

Discover the time-tested nutritional powerhouse of the Konkan coast with Visit Kokan Kulith Pith — 100% natural flour made from carefully cleaned, dry-roasted horse gram (Kulith) grown in the red soil of Ratnagiri and Raigad.

Celebrated in traditional coastal Ayurveda for its exceptional plant-based protein, high dietary fiber, and warming vitality, Kulith Pith is the key ingredient for soothing Kulith Pithla, restorative Pithi, hearty Kadhi, and traditional Ambil. It delivers a deeply comforting earthy flavor that nourishes the body during monsoon and winter seasons.

✅ 100% Pure Farm-Harvested Horse Gram from Konkan
✅ Rich in Natural Plant Protein, Iron & Dietary Fiber
✅ Traditional Superfood for Comforting Pithla, Pithi & Soups
✅ Promotes Digestive Health, Stamina & Natural Detoxification
✅ Zero Additives, Colors, or Preservatives

**Wholesome nourishment from the red soil of Konkan straight to your kitchen bowl.** 🌾🥣🌿`,

  "premium-cashew": `### Visit Kokan Sindhudurg Farm-Fresh Cashews (Premium W210)

Indulge in the finest harvest of Maharashtra’s cashew capital with Visit Kokan Premium Cashews — handpicked, jumbo whole kernels sourced directly from organic orchards in Vengurla and Malvan.

Sindhudurg cashews are renowned across India for their natural buttery sweetness, delicate crunch, and high wholesome oil content nurtured by Konkan's coastal humidity and tropical red soil. Minimally processed and naturally dried without sulfur, bleaching, or added salt, they deliver pure nutrition and unforgettable flavor.

✅ Premium Jumbo Whole Cashews Sourced Directly from Vengurla Orchards
✅ Naturally Sweet, Rich Buttery Flavor and Crisp Fresh Texture
✅ Excellent Source of Healthy Fats, Plant Protein & Minerals
✅ Perfect for Healthy Daily Snacking, Desserts, and Coastal Curries
✅ 100% Chemical-Free, Unsalted & Naturally Sun-Dried

**Taste the fertile soil and tropical sunshine of Sindhudurg in every crunchy bite.** 🌰🌴✨`,

  "mango-pickle": `### Visit Kokan Traditional Mango Pickle (Aam Lonche)

Relive the unforgettable taste of coastal grandmothers' pantries with Visit Kokan Mango Pickle — an authentic heirloom recipe made from firm, tart raw mangoes handpicked from Ratnagiri groves.

Cut into plump, crunchy cubes, the raw mangoes are seasoned with stone-ground mustard seeds (Rai Dal), fenugreek (Methi), red chilli powder, aromatic asafoetida (Hing), and cold-pressed oil. Slow-cured in earthen jars (barnis) under the coastal sun, it strikes the quintessential balance of spicy, sour, and savory flavor with a satisfying crunch in every bite.

✅ Heirloom Konkan Household Recipe with Crunchy Raw Green Mangoes
✅ Sourced from Native Mango Orchards in Ratnagiri
✅ Traditional Earthen-Jar Sun-Curing Method
✅ Perfectly Complements Varan Bhaat, Bhakri, Thecha & Everyday Meals
✅ Zero Chemical Vinegar, Synthetic Colors, or Artificial Preservatives

**A burst of coastal sunshine and homemade nostalgia in every single spoonful.** 🥭🌶️🏺`,

  "konkan-gift-pack": `### Visit Kokan Authentic Coastal Gift Hamper

Share the vibrant culinary soul of Maharashtra’s coastline with the Visit Kokan Authentic Coastal Gift Hamper — a thoughtfully curated collection of our most celebrated handcrafted products.

Inside this elegant, eco-friendly presentation box:
- **Visit Kokan Special Malvani Masala** — Generational wood-roasted 24-spice blend
- **Visit Kokan Pure Kokum Agal** — 100% unsweetened Sindhudurg kokum extract for Solkadhi
- **Visit Kokan Sweet Kokum Syrup** — Refreshing coastal summer cooler
- **Visit Kokan Sun-Dried Amsul** — Whole ruby kokum rinds for fish curries & dals
- **Visit Kokan Farm-Fresh Cashews** — Jumbo whole cashews from Vengurla orchards

✅ Handpicked Collection of Authentic Artisanal Konkan Treasures
✅ Sourced Directly from Local Farmers & Women’s Cooperatives in Sindhudurg
✅ Elegantly Boxed — The Perfect Gift for Festivals, Weddings & Corporate Giving
✅ Pure, Natural, and Completely Preservative-Free

**Give the gift of coastal sunshine, sea breeze, and authentic Konkan flavors to someone you cherish.** 🎁🌊🥥`,

  "alphanso-mango-1777101633648": `### Visit Kokan Authentic Ratnagiri Alphonso Mangoes (GI Tagged Hapus)

Experience the undisputed king of mangoes with Visit Kokan Ratnagiri Alphonso (Hapus) – 100% naturally tree-ripened and handpicked directly from heritage orchards overlooking the Arabian Sea in Ratnagiri and Devgad.

Nurtured by the mineral-rich laterite red soil and warm coastal sea breezes, authentic Ratnagiri Hapus is celebrated globally for its fiberless, melt-in-the-mouth golden saffron pulp, rich creamy texture, and unmistakable sweet aroma. Free from artificial chemical carbide ripening, each mango is packed in breathable hay crates to ripen naturally to perfection. Ideal for royal Aamras feasts with hot puris, mango milkshakes, or fresh summer desserts.

✅ 100% Authentic GI Tagged Ratnagiri Hapus Mangoes
✅ Naturally Tree-Ripened in Traditional Grass Crates (Zero Carbide)
✅ Unrivaled Saffron Color, Silky Fiberless Texture & Rich Aroma
✅ Sourced Directly from Trusted Heritage Orchards in Ratnagiri
✅ The Ultimate Konkan Summer Delicacy for Aamras & Gifting

**Taste the legendary golden sunshine of coastal Maharashtra delivered straight from the farm to your door.** 🥭🌊☀️`,

  "alphonso-mango-box": `### Visit Kokan Premium Alphonso Mango Gift Box (GI Tagged Hapus)

Experience the undisputed king of mangoes with Visit Kokan Ratnagiri Alphonso (Hapus) – 100% naturally tree-ripened and handpicked directly from heritage orchards overlooking the Arabian Sea in Ratnagiri and Devgad.

Nurtured by the mineral-rich laterite red soil and warm coastal sea breezes, authentic Ratnagiri Hapus is celebrated globally for its fiberless, melt-in-the-mouth golden saffron pulp, rich creamy texture, and unmistakable sweet aroma. Free from artificial chemical carbide ripening, each box contains 12 carefully selected Grade A mangoes packed in breathable hay to ripen naturally to perfection. Ideal for royal Aamras feasts with hot puris, mango milkshakes, or fresh summer desserts.

✅ 100% Authentic GI Tagged Ratnagiri Hapus Mangoes (12 Count Box)
✅ Naturally Tree-Ripened in Traditional Grass Crates (Zero Carbide)
✅ Unrivaled Saffron Color, Silky Fiberless Texture & Rich Aroma
✅ Sourced Directly from Trusted Heritage Orchards in Ratnagiri
✅ The Ultimate Konkan Summer Delicacy for Aamras & Gifting

**Taste the legendary golden sunshine of coastal Maharashtra delivered straight from the farm to your door.** 🥭🌊☀️`,

  "ratnagiri-kesar-mango-pulp": `### Visit Kokan 100% Pure Ratnagiri Mango Pulp (Aamras)

Savor the golden sweetness of peak Konkan summers all year round with Visit Kokan Pure Mango Pulp — crafted exclusively from sun-ripened Ratnagiri Alphonso and Kesar mangoes with zero added sugar, water, or artificial preservatives.

Pressed and sealed in food-grade tins during the height of the coastal harvest season, this rich pulp retains the vibrant natural saffron color, thick velvety consistency, and luscious tropical fragrance of fresh orchard mangoes. Perfect for instant traditional Aamras, mango mastani, kulfi, puddings, lassi, or baking.

✅ 100% Pure Alphonso & Kesar Mango Pulp from Ratnagiri
✅ Zero Added Sugar, Added Water, or Artificial Colors
✅ Retains Natural Tropical Aroma and Velvety Smooth Texture
✅ Ready-to-Serve — Perfect for Aamras-Puri, Kulfi, Lassi & Desserts
✅ Preserved Naturally at Peak Ripeness for Year-Round Freshness

**Bring home the royal taste of Ratnagiri orchards anytime you crave authentic Aamras.** 🥭✨🥛`,

  "solkadhi-masala-mix": `### Visit Kokan Artisanal Solkadhi Spice Blend

Craft the quintessential pink soul-drink of coastal Maharashtra in minutes with Visit Kokan Solkadhi Spice Blend — a masterfully curated artisanal spice mix designed specifically for authentic Solkadhi preparation.

Handcrafted with stone-ground wild Sindhudurg kokum, roasted cumin (jeera), crushed garlic, green chillies, and pink Himalayan rock salt. When whisked with fresh coconut milk, it releases an alluring pale-rose hue, zesty aroma, and refreshing tangy-savory flavor that instantly soothes the stomach after spicy seafood or meat meals.

✅ Authentic Konkan Recipe for Quick & Perfect Solkadhi
✅ Sourced with Wild Sindhudurg Kokum & Fresh Coastal Spices
✅ Whisk with Fresh Coconut Milk for Instant Traditional Solkadhi
✅ Powerful Natural Cooling Agent & Renowned Digestive Tonic
✅ Completely Free from Preservatives, Colors, or MSG

**The ultimate coastal palate cleanser and digestive cooler for every authentic seafood feast.** 🥥🌸🥤`,

  "dapoli-honey-wildflower": `### Visit Kokan Dapoli Wildflower Raw Forest Honey

Taste the untamed nectar of the Western Ghats with Visit Kokan Dapoli Wildflower Honey — 100% raw, unpasteurized, and unfiltered forest honey collected from sustainable apiaries in the pristine forests of Dapoli.

Our bees forage naturally on wild coastal flora, including blooming Jamun, Karvi, Hirda, and tropical mangrove flowers, resulting in a complex dark-amber nectar with warm floral undertones and deep caramel finish. Free from heat processing or sugar feeding, this pure honey retains all active enzymes, pollen, and natural immunity-boosting antioxidants.

✅ 100% Pure, Raw & Unfiltered Wildflower Honey from Dapoli
✅ Natural Forage on Wild Western Ghats Medicinal Flora & Jamun
✅ Retains Live Enzymes, Natural Pollen & Vital Trace Minerals
✅ Pure Honey That Naturally Crystallizes — A Hallmark of Authenticity
✅ Zero Added Sugar Syrup, Corn Syrup, or Chemical Additives

**A golden spoonful of pure forest wellness nurtured by Konkan's biodiversity.** 🍯🌿🐝`,

  "jackfruit-chips": `### Visit Kokan Crisp Raw Jackfruit Chips (Phanas Chips)

Rediscover the nostalgic crunch of coastal village tea-time with Visit Kokan Jackfruit Chips — made from freshly harvested, tender green jackfruit (Kacha Phanas) from family orchards in Guhagar and Ratnagiri.

Thinly sliced and kettle-fried in pure coastal coconut oil with just a light dusting of sea salt, these golden chips deliver an irresistible airy crunch with a subtle earthy sweetness unique to authentic tropical jackfruit. High in dietary fiber, low in glycemic index, and free from palm oil or artificial seasonings, it is the perfect guilt-free snack.

✅ 100% Raw Green Jackfruit Harvested in Guhagar Orchards
✅ Kettle-Crisped in Pure Expeller-Pressed Coastal Coconut Oil
✅ Lightly Seasoned with Pure Sea Salt — Crisp, Light & Non-Greasy
✅ Rich in Natural Fiber & Wholesome Plant Nutrients
✅ Zero Palm Oil, Preservatives, or Artificial Flavorings

**The quintessential coastal monsoon companion for your hot cup of afternoon Chai.** 🍌🌾🍵`,

  "coconut-oil-cold-pressed": `### Visit Kokan Extra Virgin Cold-Pressed Coconut Oil (Lakdi Ghana)

Experience the purity of traditional wood-pressed extraction with Visit Kokan Cold-Pressed Coconut Oil — made from fresh, sun-dried mature copra harvested in the organic coastal groves of Vengurla.

Extracted slowly using generational wooden churners (Lakdi Ghana) without applying external heat or chemical solvents, this crystal-clear oil preserves its intoxicating fresh coconut aroma, light non-sticky texture, and abundant medium-chain triglycerides (Lauric Acid). Revered across Konkan families for traditional coastal cooking, nourishing hair conditioning, and radiant skin care.

✅ 100% Pure Wood-Pressed (Lakdi Ghana) Virgin Coconut Oil
✅ Sourced from Organic Coastal Coconut Orchards in Vengurla
✅ Single Cold Extraction Preserving Lauric Acid & Natural Vitamin E
✅ Multi-Purpose Wonder: Ideal for Coastal Cooking, Hair & Skin
✅ Unrefined, Unbleached, and Free from Mineral Oils or Additives

**The liquid gold of coastal Maharashtra, straight from Vengurla's palms to your home.** 🥥🌴✨`,

  "malvan-prawn-pickle": `### Visit Kokan Coastal Malvan Prawn Pickle (Kolambi Lonche)

Indulge in the fiery, sea-kissed delicacy of the Sindhudurg coastline with Visit Kokan Malvan Prawn Pickle — an intensely flavorful heirloom recipe prepared using plump fresh tiger prawns caught daily by local Malvan fishermen.

Sun-dried and gently shallow-fried, the prawns are marinated in stone-ground Malvani masala, Kashmiri chillies, fresh garlic cloves, ginger, curry leaves, and cold-pressed oil with a tangy dash of kokum agal. Packed with rich umami flavor and coastal heat, it turns simple steamed rice, dal, or warm bhakri into a memorable seafood feast.

✅ Made with Freshly Caught Ocean Tiger Prawns from Malvan Shores
✅ Authentic Generational Coastal Recipe Marinated in Malvani Masala
✅ Infused with Pure Kokum Agal for Tangy Preservation & Flavor
✅ Deep, Aromatic Umami Heat — A Must-Have for Seafood Connoisseurs
✅ Free from Chemical Vinegar or Synthetic Preservatives

**An explosion of authentic Malvani coastal flavors in every fiery spoonful.** 🍤🌶️🌊`,

  "raw-mango-pickle": `### Visit Kokan Handcrafted Raw Mango Pickle (Kairi Lonche)

Bring the vibrant crunch of coastal summers to your dining table with Visit Kokan Traditional Kairi Lonche — prepared using firm, handpicked green raw mangoes from village groves in Ratnagiri.

Marinated in cold-pressed sesame oil, split yellow mustard seeds, roasted fenugreek (methi), turmeric, and sea salt, this pickle is slow-aged in traditional ceramic jars under the warm Konkan sun. Its sharp tangy punch and aromatic spice oil make it the ultimate soulmate for comfort foods like Varan Bhaat, Pithla Bhakri, and travel meals.

✅ Farm-Fresh Green Raw Mangoes from Ratnagiri
✅ Traditional Sun-Cured Aging in Heritage Ceramic Barnis
✅ Aromatic Blend of Roasted Whole Spices & Cold-Pressed Oil
✅ Perfect Crunchy Texture with a Burst of Tangy Coastal Flavor
✅ 100% Homemade Taste with Zero Chemical Additives

**A jar filled with authentic grandmother memories and coastal heritage.** 🥭✨🏺`,

  "dried-bombil-bombay-duck": `### Visit Kokan Sun-Dried Bombay Duck (Sukka Bombil)

A legendary coastal staple for true seafood aficionados: Visit Kokan Sun-Dried Bombay Duck (Bombil) is sourced fresh from traditional artisanal fishing villages along the Alibaug and Ratnagiri coast.

Cleaned meticulously and hung on high bamboo scaffolds to dry naturally under the sea breeze and blazing coastal sun, our dried bombil retains its authentic ocean flavor and delicate texture without any chemical treatment or artificial preservatives. Perfect for pan-frying into crispy Bombil Rava Fry, spicy Bombil Chutney with garlic and chillies, or hearty coastal curries.

✅ Artisanal Sun-Dried Bombay Duck from Alibaug Coastal Villages
✅ Dried Naturally on Bamboo Scaffolds with Coastal Sea Breeze
✅ Cleaned, Gutted, and Packed in Hygienic Air-Sealed Pouches
✅ Ideal for Crispy Pan-Fries, Spicy Garlic Chutneys & Rustic Curries
✅ 100% Natural Sea Catch with Zero Chemical Preservatives

**The unmistakable, bold coastal flavor that brings authentic village nostalgia to your kitchen.** 🐟🔥🌊`,

  "malvani-fish-curry-masala": `### Visit Kokan Authentic Malvani Fish Curry Masala

Master the legendary coastal fish curry in your own home with Visit Kokan Malvani Fish Curry Masala — a time-honored artisanal blend of 18 roasted whole spices crafted specifically for seaside gravies.

Blended with roasted coriander, fragrant fennel, Bedgi red chillies, black pepper, turmeric, and dried kokum rinds, this masala imparts the signature deep red hue, appetizing aroma, and balanced tang that defines an authentic Malvani fish thali. Simply saute with onions, tomatoes, and fresh coconut paste for a world-class curry with Surmai, Pomfret, Bangda, or Prawns.

✅ Generational Malvani Coastal Heritage Recipe
✅ 18 Whole Spices Wood-Roasted to Perfection
✅ Features Authentic Konkan Kokum for Built-In Tangy Balance
✅ Creates Rich, Saffron-Red Coconut Curries with Ease
✅ Pure Natural Ingredients — No MSG, Fillers, or Synthetic Colors

**The secret spice blend behind every legendary seaside fish thali in Malvan.** 🌊🍛🐟`,

  "kokum-sherbet-concentrate": `### Visit Kokan Wild Forest Kokum Sherbet Concentrate

Immerse yourself in the pure refreshing magic of the Western Ghats with Visit Kokan Kokum Sherbet Concentrate — crafted from wild-harvested Garcinia indica fruits from the lush forests of Sindhudurg.

Naturally loaded with antioxidants, vitamin C, and hydroxycitric acid (HCA), this concentrate delivers an invigorating balance of tart fruitiness with a pinch of black salt and roasted jeera. Loved across Konkan households as a daily cooling remedy that relieves acidity, restores hydration, and soothes the digestive tract.

✅ Wild-Harvested Pure Kokum from Sindhudurg Forest Orchards
✅ Natural Ayurvedic Cooling Remedy for Acidity & Heat Exhaustion
✅ Easy to Prepare: Simply Dilute with Chilled Water or Club Soda
✅ Rich in Natural Fruit Antioxidants & Vitamin C
✅ Zero Artificial Sweeteners, Synthetic Colors, or Chemical Additives

**A revitalizing splash of tropical forest wellness in every chilled glass.** 🌺🥤🌿`,

  "konkan-roasted-cashews": `### Visit Kokan Slow-Roasted Sindhudurg Jumbo Cashews

Treat yourself to the ultimate royal coastal snack with Visit Kokan Roasted Cashews — jumbo whole cashew kernels sourced directly from certified orchards in Vengurla, Sindhudurg.

Gently slow-roasted in small batches to golden perfection, these premium cashews release their natural sweetness and rich buttery crunch with every bite. Lightly sprinkled with rock salt, they offer the perfect nutritious protein snack for fitness enthusiasts, travelers, and festive celebrations.

✅ Jumbo Whole Cashew Kernels from Vengurla Orchards
✅ Slow-Roasted in Small Batches for Maximum Crispness
✅ High in Healthy Monounsaturated Fats, Protein & Minerals
✅ Wholesome, Delicious Daily Snack for Health & Energy
✅ 100% Pure, Hand-Sorted & Freshly Packed

**Golden, crunchy, and richly satisfying — the crown jewel of Konkan orchards.** 🌰🌴✨`,

  "konkan-cashew-nuts-w180": `### Visit Kokan Farm-Fresh Cashews (Grade W180 King Size)

Indulge in the finest harvest of Maharashtra’s cashew capital with Visit Kokan King Size Cashews (W180) — handpicked, jumbo whole kernels sourced directly from organic orchards in Vengurla and Malvan.

Sindhudurg cashews are renowned across India for their natural buttery sweetness, delicate crunch, and high wholesome oil content nurtured by Konkan's coastal humidity and tropical red soil. Minimally processed and naturally dried without sulfur, bleaching, or added salt, they deliver pure nutrition and unforgettable flavor.

✅ Premium W180 King Size Cashews Sourced from Vengurla Orchards
✅ Naturally Sweet, Rich Buttery Flavor and Crisp Fresh Texture
✅ Excellent Source of Healthy Fats, Plant Protein & Minerals
✅ Perfect for Healthy Daily Snacking, Desserts, and Coastal Curries
✅ 100% Chemical-Free, Unsalted & Naturally Sun-Dried

**Taste the fertile soil and tropical sunshine of Sindhudurg in every crunchy bite.** 🌰🌴✨`
};

export async function GET() {
  try {
    const snap = await db.collection("products").get();
    let updatedCount = 0;
    const results: Array<{ id: string; slug: string; updated: boolean }> = [];

    for (const doc of snap.docs) {
      const data = doc.data();
      const slug = data.slug;
      if (slug && PRODUCT_DESCRIPTIONS[slug]) {
        await doc.ref.update({
          description: PRODUCT_DESCRIPTIONS[slug],
          vendorName: "Visit Kokan Team",
          updatedAt: new Date().toISOString(),
        });
        updatedCount++;
        results.push({ id: doc.id, slug, updated: true });
      } else {
        results.push({ id: doc.id, slug, updated: false });
      }
    }

    return NextResponse.json({
      success: true,
      updatedCount,
      total: snap.size,
      results,
    });
  } catch (err: any) {
    console.error("Failed to update product descriptions:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
