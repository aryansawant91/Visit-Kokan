const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}
const db = admin.firestore();

const ADDITIONAL_TREKS = [
  {
    slug: "kalsubai-peak-trek",
    name: "Kalsubai Peak Trek (Everest of Maharashtra)",
    region: "Igatpuri",
    category: "fort",
    difficulty: "moderate",
    price: 1399,
    advanceAmount: 700,
    duration: "1 day 1 night",
    distance: "155 km from Mumbai",
    maxAltitude: "1,646 m (5,400 ft)",
    startPoint: "Bari Base Village",
    endPoint: "Bari Base Village",
    baseVillage: "Bari (बारी, Igatpuri)",
    description: "Conquer the highest mountain peak in Maharashtra standing at 5,400 ft. Features sturdy iron ladders on vertical rocky faces, sunrise temple summit, and expansive views of Arthur Lake and Bhandardara.",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80"
    ],
    highlights: ["Highest Peak in Maharashtra (5,400 ft)", "Famous Iron Ladders on Rock Faces", "Kalsubai Temple at Peak", "Sunrise over Bhandardara Dam"],
    bestSeason: "June to February",
    approved: true,
    featured: false
  },
  {
    slug: "rajgad-fort-trek",
    name: "Rajgad Fort Sovereign Citadel (King of Forts)",
    region: "Pune",
    category: "fort",
    difficulty: "moderate",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "205 km from Mumbai",
    maxAltitude: "1,376 m (4,514 ft)",
    startPoint: "Gunjavane Base Village",
    endPoint: "Gunjavane Base Village",
    baseVillage: "Gunjavane (गुंजवणे, Pune)",
    description: "The capital of the Maratha Empire for over 26 years under Chhatrapati Shivaji Maharaj. Famous for its sprawling Suvela Machi with natural needle hole (Nedhe), Padmavati Machi, and the impregnable Balekilla.",
    images: [
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&q=80"
    ],
    highlights: ["Sovereign Capital of Swarajya for 26 Years", "Suvela Machi & Elephant Rock Needle", "Padmavati Temple & Lake", "Steep Balekilla Double Fortifications"],
    bestSeason: "July to February",
    approved: true,
    featured: false
  },
  {
    slug: "pratapgad-fort-trek",
    name: "Pratapgad Fort Battlefield & Heritage Trek",
    region: "Mahabaleshwar",
    category: "fort",
    difficulty: "easy",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "215 km from Mumbai",
    maxAltitude: "1,080 m (3,543 ft)",
    startPoint: "Pratapgad Base",
    endPoint: "Pratapgad Base",
    baseVillage: "Wada Village (Poladpur / Mahabaleshwar)",
    description: "The historic site of the epic Battle of Pratapgad where Chhatrapati Shivaji Maharaj vanquished Afzal Khan. Features Bhavani Mata temple, Afzal Khan's tomb, and panoramic views of the Mahabaleshwar tableland and Konkan valleys.",
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80"
    ],
    highlights: ["Historic Site of Afzal Khan Battle", "Sacred Bhavani Mata Temple", "Bronze Statue of Chhatrapati Shivaji Maharaj", "Overlook of Koyna and Jawali Valley"],
    bestSeason: "All Year",
    approved: true,
    featured: false
  },
  {
    slug: "tikona-fort-trek",
    name: "Tikona Fort (Vitandgad) Pyramidal Hill Climb",
    region: "Lonavala",
    category: "fort",
    difficulty: "easy",
    price: 1299,
    advanceAmount: 650,
    duration: "1 day",
    distance: "115 km from Mumbai",
    maxAltitude: "1,061 m (3,480 ft)",
    startPoint: "Tikona Peth Base",
    endPoint: "Tikona Peth Base",
    baseVillage: "Tikona Peth (तिकोना पेठ, Kamshet)",
    description: "Famous triangular pyramidal hill fort overlooking Pawna Lake. Features ancient Buddhist caves, large water tanks, Trimbakeshwar Mahadev temple, and steep rock-cut stairs with safety wire ropes.",
    images: [
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80"
    ],
    highlights: ["Distinctive Pyramidal Mountain Shape", "Overlook of Pawna Dam Waters", "Ancient Buddhist Rock Caves", "Trimbakeshwar Temple at Summit"],
    bestSeason: "June to March",
    approved: true,
    featured: false
  },
  {
    slug: "tung-fort-trek",
    name: "Tung Fort (Kathingad) Pawna Lake Watchtower",
    region: "Lonavala",
    category: "fort",
    difficulty: "moderate",
    price: 1299,
    advanceAmount: 650,
    duration: "1 day",
    distance: "110 km from Mumbai",
    maxAltitude: "1,075 m (3,527 ft)",
    startPoint: "Tungi Base Village",
    endPoint: "Tungi Base Village",
    baseVillage: "Tungi (तुंगी, Pawna)",
    description: "Conical fort surrounded on three sides by the shimmering turquoise waters of Pawna Lake. Known historically as Kathingad ('Difficult Fort') due to its razor-sharp ridge and sheer vertical climb.",
    images: [
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80"
    ],
    highlights: ["Surrounded by Pawna Lake waters", "Sharp Conical Summit Pinnacle", "Balekilla Lookout Post", "Historic Goddess Tungi Temple"],
    bestSeason: "July to February",
    approved: true,
    featured: false
  },
  {
    slug: "purandar-fort-trek",
    name: "Purandar Fort & Vajragad Citadel Trek",
    region: "Pune",
    category: "fort",
    difficulty: "moderate",
    price: 1399,
    advanceAmount: 700,
    duration: "1 day 1 night",
    distance: "195 km from Mumbai",
    maxAltitude: "1,398 m (4,587 ft)",
    startPoint: "Purandar Base",
    endPoint: "Purandar Base",
    baseVillage: "Saswad / Purandar (सासवड, Pune)",
    description: "Sacred birthplace of Chhatrapati Sambhaji Maharaj and defense battleground of Murarbaji Deshpande. Sprawling twin citadels of Purandar and Vajragad with intact military bastions and British-era churches.",
    images: [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80"
    ],
    highlights: ["Birthplace of Chhatrapati Sambhaji Maharaj", "Murarbaji Deshpande Memorial", "Twin Citadels of Purandar & Vajragad", "Bileshvar Temple & Kedareshwar Peak"],
    bestSeason: "August to February",
    approved: true,
    featured: false
  },
  {
    slug: "shivneri-fort-trek",
    name: "Shivneri Fort Sacred Birthplace Pilgrimage",
    region: "Pune",
    category: "fort",
    difficulty: "easy",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "155 km from Mumbai",
    maxAltitude: "1,066 m (3,500 ft)",
    startPoint: "Junnar Base",
    endPoint: "Junnar Base",
    baseVillage: "Junnar (जुन्नर, Pune)",
    description: "Sacred birthplace of Chhatrapati Shivaji Maharaj born on February 19, 1630. A triangular citadel defended by seven massive stone portals (Maha Darwaja), Badami Talav, and the Shivai Devi Temple.",
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80"
    ],
    highlights: ["Birthplace of Chhatrapati Shivaji Maharaj", "7 Colossal Stone Gates", "Goddess Shivai Devi Rock Temple", "Badami Water Cistern & Koli Platform"],
    bestSeason: "All Year",
    approved: true,
    featured: false
  },
  {
    slug: "sondai-fort-trek",
    name: "Sondai Fort Monsoon Ladder Climb",
    region: "Karjat",
    category: "fort",
    difficulty: "easy",
    price: 1199,
    advanceAmount: 600,
    duration: "1 day",
    distance: "65 km from Mumbai",
    maxAltitude: "365 m (1,200 ft)",
    startPoint: "Sondewadi Base",
    endPoint: "Sondewadi Base",
    baseVillage: "Sondewadi (सोंडेवाडी, Karjat)",
    description: "A rewarding beginner-friendly lookout tower fort near Karjat. Offers sturdy metal ladders on vertical rock faces, ancient carved water cisterns, and 360-degree views of Morbe Dam and Matheran.",
    images: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80"
    ],
    highlights: ["Beginner-Friendly with Ladder Steps", "Breathtaking Views of Morbe Dam", "Goddess Sondai Devi Shrine at Top", "Quick 1.5 Hour Ascent from Base"],
    bestSeason: "June to December",
    approved: true,
    featured: false
  },
  {
    slug: "kothaligad-peth-fort-trek",
    name: "Kothaligad (Peth Fort) Lighthouse Spire",
    region: "Karjat",
    category: "fort",
    difficulty: "moderate",
    price: 1299,
    advanceAmount: 650,
    duration: "1 day",
    distance: "85 km from Mumbai",
    maxAltitude: "945 m (3,100 ft)",
    startPoint: "Ambivali Base Village",
    endPoint: "Ambivali Base Village",
    baseVillage: "Ambivali / Peth (आंबिवली, Karjat)",
    description: "Famous for its unique conical rock funnel chimney inside which a helical stone staircase was hollowed out by ancient engineers. Provides sweeping views of Konkan plains and Bhimashankar range.",
    images: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80"
    ],
    highlights: ["Internal Helical Stone Tunnel Staircase", "Cannon Lookout & Weapon Storage Caves", "Lush Peth Plateau Village", "Views of Bhimashankar and Padargad"],
    bestSeason: "June to January",
    approved: true,
    featured: false
  },
  {
    slug: "peb-vikatgad-fort-trek",
    name: "Peb (Vikatgad) Fort Matheran Ridge Traverse",
    region: "Neral",
    category: "fort",
    difficulty: "moderate",
    price: 1299,
    advanceAmount: 650,
    duration: "1 day",
    distance: "75 km from Mumbai",
    maxAltitude: "640 m (2,100 ft)",
    startPoint: "Anandwadi Base (Neral)",
    endPoint: "Matheran Toy Train Track",
    baseVillage: "Anandwadi (आनंदवाडी, Neral)",
    description: "Thrilling ridge trail connecting Neral to Matheran hill station. Features rock patches with iron ladders, meditation caves of Swami Samarth, and the famous narrow chimney connecting to the toy train tracks.",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"
    ],
    highlights: ["Rock-Cut Ladders & Narrow Chimney Climb", "Cave Temple with Footwear Footprints", "Toy Train Track Panoramic Walk", "Direct Views of Chanderi and Matheran"],
    bestSeason: "July to February",
    approved: true,
    featured: false
  },
  {
    slug: "irshalgad-pinnacle-trek",
    name: "Irshalgad Pinnacle & Needle Hole Trek",
    region: "Panvel",
    category: "fort",
    difficulty: "moderate",
    price: 1299,
    advanceAmount: 650,
    duration: "1 day",
    distance: "60 km from Mumbai",
    maxAltitude: "500 m (1,640 ft)",
    startPoint: "Nanivali Base Village",
    endPoint: "Nanivali Base Village",
    baseVillage: "Nanivali / Irshalwadi (नानिवली, Chowk)",
    description: "Sister fortress to Prabalgad and Kalavantin Durg. Boasts a vertical monolithic rock needle crowned by an ancient natural hole (Nedhe) where winds blow with incredible force.",
    images: [
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&q=80"
    ],
    highlights: ["Spectacular Rock Needle Pinnacle", "Natural Wind Tunnel (Nedhe)", "Overlook of Morbe Dam Waters", "Thrilling Scramble with Safety Guide"],
    bestSeason: "July to January",
    approved: true,
    featured: false
  },
  {
    slug: "manikgad-fort-trek",
    name: "Manikgad Fort Ruined Round Tower",
    region: "Panvel",
    category: "fort",
    difficulty: "moderate",
    price: 1299,
    advanceAmount: 650,
    duration: "1 day",
    distance: "65 km from Mumbai",
    maxAltitude: "570 m (1,870 ft)",
    startPoint: "Vashivali Base Village",
    endPoint: "Vashivali Base Village",
    baseVillage: "Vashivali (वाशीवली, Patalganga)",
    description: "Perched over the Patalganga river valley, Manikgad was built by the Marathas to command trade from Kalyan to the south. Features a prominent cylindrical round bastion and water reservoirs.",
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80"
    ],
    highlights: ["Iconic Round Tower Citadel Ruin", "Dense Teak Forest Canopy Hike", "Panoramic Valley of Patalganga", "Peaceful Offbeat Trail"],
    bestSeason: "July to December",
    approved: true,
    featured: false
  },
  {
    slug: "rohida-vichitragad-trek",
    name: "Rohida (Vichitragad) Windswept Bastions",
    region: "Bhor",
    category: "fort",
    difficulty: "moderate",
    price: 1399,
    advanceAmount: 700,
    duration: "1 day 1 night",
    distance: "195 km from Mumbai",
    maxAltitude: "1,110 m (3,640 ft)",
    startPoint: "Bajarwadi Base Village",
    endPoint: "Bajarwadi Base Village",
    baseVillage: "Bajarwadi (बाजारवाडी, Bhor)",
    description: "Famous for its 3 remarkably intact stone gates carved with intricate Sharabha lions, Rohiram temple, and winds so ferocious on the southern bastion that hikers can lean into the breeze.",
    images: [
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80"
    ],
    highlights: ["Three Pristinely Intact Stone Gates", "Legendary High-Wind Bastions", "Rohiram Temple and Sacred Water Cisterns", "Views of Purandar and Kenjalgad"],
    bestSeason: "July to February",
    approved: true,
    featured: false
  },
  {
    slug: "kenjalgad-fort-trek",
    name: "Kenjalgad (Ghera Khelanja) Hexagonal Plateau",
    region: "Wai",
    category: "fort",
    difficulty: "easy",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "220 km from Mumbai",
    maxAltitude: "1,298 m (4,258 ft)",
    startPoint: "Ghavari Base Village",
    endPoint: "Ghavari Base Village",
    baseVillage: "Ghavari / Korle (घावरी, Wai)",
    description: "An unusual hexagonal basalt rock mesa towering over Dhom Dam and the Krishna river valley. Features intact stone-cut entrance staircases and sweeping panoramas of Raireshwar plateau.",
    images: [
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80"
    ],
    highlights: ["Hexagonal Volcanic Rock Tableland", "Overlook of Dhom Dam Reservoir", "Historical Stone Carved Steps", "Close to Raireshwar Swarajya Oath Site"],
    bestSeason: "August to February",
    approved: true,
    featured: false
  },
  {
    slug: "ratangad-fort-trek",
    name: "Ratangad Fort (Jewel of the Sahyadris)",
    region: "Bhandardara",
    category: "fort",
    difficulty: "moderate",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "185 km from Mumbai",
    maxAltitude: "1,297 m (4,255 ft)",
    startPoint: "Ratanwadi Base Village",
    endPoint: "Ratanwadi Base Village",
    baseVillage: "Ratanwadi (रतनवाडी, Bhandardara)",
    description: "The 'Jewel of Sahyadri' featuring the famous 'Nedhe'—a colossal natural wind eye hole carved through the summit rock. Approaches pass the ancient 1,200-year-old Amruteshwar Hemadpanthi temple.",
    images: [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80"
    ],
    highlights: ["Natural Rock Wind Cavity (Nedhe)", "Amruteshwar 8th-Century Stone Temple", "Arthur Lake & Pravara River Origin", "Dramatic Steel Ladders on Cliffs"],
    bestSeason: "July to February",
    approved: true,
    featured: false
  },
  {
    slug: "sandhan-valley-trek",
    name: "Sandhan Valley Canyon & Waterfall Rappelling",
    region: "Bhandardara",
    category: "waterfall",
    difficulty: "hard",
    price: 1899,
    advanceAmount: 950,
    duration: "1 day 1 night",
    distance: "190 km from Mumbai",
    maxAltitude: "914 m (3,000 ft)",
    startPoint: "Samrad Base Village",
    endPoint: "Dehne Base Village",
    baseVillage: "Samrad (साम्रद, Bhandardara)",
    description: "The 'Valley of Shadows' is a 200 ft deep, 1.5 km long water-carved volcanic rock canyon where sun rays rarely touch the ground. Requires boulder scrambling, wading through chest-deep pool waters, and rappelling.",
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80"
    ],
    highlights: ["200 ft Deep Volcanic Rock Gorge", "Chest-Deep Natural Cave Waters", "Thrilling Cliff Rappelling", "Campfire Camping Under Starry Sky"],
    bestSeason: "November to May",
    approved: true,
    featured: false
  },
  {
    slug: "gorakhgad-fort-trek",
    name: "Gorakhgad Fort Vertical Spire & Saint Cave",
    region: "Murbad",
    category: "fort",
    difficulty: "moderate",
    price: 1299,
    advanceAmount: 650,
    duration: "1 day",
    distance: "95 km from Mumbai",
    maxAltitude: "650 m (2,130 ft)",
    startPoint: "Dehri Base Village",
    endPoint: "Dehri Base Village",
    baseVillage: "Dehri (देहारी, Murbad)",
    description: "Dramatic vertical rock pinnacle where Saint Gorakhnath meditated. Features massive rock-hewn steps with handholds carved into sheer vertical cliffs, spacious caves accommodating 50 hikers, and a Shiva temple at the pinnacle.",
    images: [
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&q=80"
    ],
    highlights: ["Vertical Cliff Steps with Handholds", "Massive Rock Meditation Cave of Saint Gorakhnath", "Pinnacle Top Mahadev Temple", "Panoramic Views of Machindragad and Ahupe Ghat"],
    bestSeason: "July to February",
    approved: true,
    featured: false
  },
  {
    slug: "bhimashankar-jyotirlinga-trek",
    name: "Bhimashankar Jungle & Shidi Ghat Trail",
    region: "Karjat",
    category: "forest",
    difficulty: "moderate",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "105 km from Mumbai",
    maxAltitude: "1,005 m (3,300 ft)",
    startPoint: "Khandas Base Village",
    endPoint: "Bhimashankar Temple",
    baseVillage: "Khandas (खंडास, Karjat)",
    description: "Ascends from Khandas village through dense rainforests of the Bhimashankar Wildlife Sanctuary, home to the Malabar Giant Squirrel (Shekru). Concludes at the sacred ancient 6th Jyotirlinga temple.",
    images: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80"
    ],
    highlights: ["Dense Wildlife Sanctuary Hike (Shekru Habitat)", "Thrilling Shidi Ghat Ladders / Ganesh Ghat Trail", "Sacred 6th Jyotirlinga Shrine", "Origin of River Bhima"],
    bestSeason: "July to March",
    approved: true,
    featured: false
  },
  {
    slug: "alang-madan-kulang-amk-trek",
    name: "Alang Madan Kulang (AMK) Extreme Range Trek",
    region: "Igatpuri",
    category: "fort",
    difficulty: "expert",
    price: 2499,
    advanceAmount: 1250,
    duration: "2 days 2 nights",
    distance: "165 km from Mumbai",
    maxAltitude: "1,475 m (4,840 ft)",
    startPoint: "Ambewadi Base Village",
    endPoint: "Ambewadi Base Village",
    baseVillage: "Ambewadi (आंबेवाडी, Igatpuri)",
    description: "The undisputed holy grail of Sahyadri trekking. Conquers the three formidable forts of Alang, Madan, and Kulang involving exposed ledge traverses, technical 60 ft rock climbing, and 80 ft vertical rappelling.",
    images: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80"
    ],
    highlights: ["Toughest Trek in Maharashtra", "Technical Rock Climbing & 80 ft Rappelling", "Cave Stays at 4,800 ft", "Unmatched Views of Kalsubai and Ghatghar"],
    bestSeason: "October to February",
    approved: true,
    featured: false
  },
  {
    slug: "dhak-bahiri-cave-trek",
    name: "Dhak Bahiri Cave & Technical Scramble",
    region: "Kamshet",
    category: "fort",
    difficulty: "hard",
    price: 1399,
    advanceAmount: 700,
    duration: "1 day",
    distance: "90 km from Mumbai",
    maxAltitude: "820 m (2,700 ft)",
    startPoint: "Jambhavali Base Village",
    endPoint: "Jambhavali Base Village",
    baseVillage: "Jambhavali (जांभा stand)",
    description: "An adrenaline-pumping pilgrimage into a sacred cliff-face cave perched halfway up a 1,000 ft vertical drop. Involves scaling wooden tree poles and clinging to iron ropes on vertical rock clefts.",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"
    ],
    highlights: ["Vertical Cliff Rock Scramble with Ropes", "Sacred Lord Bahiri Cave with Ancient Utensils", "Views of Rajmachi Twin Fortresses", "Pure Adrenaline for Experienced Hikers"],
    bestSeason: "October to April",
    approved: true,
    featured: false
  },
  {
    slug: "chanderi-fort-trek",
    name: "Chanderi Fort Pinnacle & Waterfall Trail",
    region: "Badlapur",
    category: "fort",
    difficulty: "hard",
    price: 1299,
    advanceAmount: 650,
    duration: "1 day",
    distance: "65 km from Mumbai",
    maxAltitude: "710 m (2,330 ft)",
    startPoint: "Chinchavali Base Village",
    endPoint: "Chinchavali Base Village",
    baseVillage: "Chinchavali (चिंचवली, Badlapur)",
    description: "Known as the Crown Jewel of the Kalyan-Badlapur region. Ascends through gushing seasonal streams, boulder-filled gullies, and a steep col leading to spacious caves and an idol of Lord Shiva.",
    images: [
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&q=80"
    ],
    highlights: ["Jagged Crown-Like Rock Needle", "Spacious Cliff Cave Refuge", "Panoramic View of Matheran, Peb, and Haji Malang", "Thrilling Scree Scramble"],
    bestSeason: "July to January",
    approved: true,
    featured: false
  },
  {
    slug: "murud-janjira-sea-fortress",
    name: "Murud Janjira Unconquered Sea Citadel",
    region: "Alibaug",
    category: "coastal",
    difficulty: "easy",
    price: 1399,
    advanceAmount: 700,
    duration: "1 day 1 night",
    distance: "150 km from Mumbai",
    maxAltitude: "Sea Level",
    startPoint: "Rajapuri Jetty",
    endPoint: "Rajapuri Jetty",
    baseVillage: "Rajapuri / Murud (राजापुरी, Alibaug)",
    description: "The only island sea fort on India's western coast that remained undefeated by the Portuguese, British, and Marathas. Features 19 intact stone bastions, massive bronze cannons (Kalal Bangadi), and two freshwater lakes in the middle of the Arabian Sea.",
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80"
    ],
    highlights: ["Undefeated Island Fortress in Arabian Sea", "19 Massive Sea Bastions & Kalal Bangadi Cannon", "Natural Sweet Water Lakes Inside Sea Citadel", "Traditional Sailboat Ferry Transfer"],
    bestSeason: "October to May",
    approved: true,
    featured: false
  },
  {
    slug: "padmadurg-kasa-sea-fort-trek",
    name: "Padmadurg (Kasa Fort) Ocean Fortress Walk",
    region: "Alibaug",
    category: "coastal",
    difficulty: "moderate",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "155 km from Mumbai",
    maxAltitude: "Sea Level",
    startPoint: "Murud Koliwada",
    endPoint: "Murud Koliwada",
    baseVillage: "Murud (मुरुड, Alibaug)",
    description: "Built by Chhatrapati Shivaji Maharaj in 1676 directly in the sea to counter the Siddis of Janjira. A magnificent offshore stone fortress accessible by fishing boat during low tides with intact lotus-shaped ramparts.",
    images: [
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80"
    ],
    highlights: ["Maratha Sea Fort Built by Shivaji Maharaj", "Lotus-Petal Shaped Stone Bastions", "Boat Ride Across Choppy Ocean Waves", "Direct View of Murud Janjira Fort"],
    bestSeason: "November to April",
    approved: true,
    featured: false
  },
  {
    slug: "korlai-fort-coastal-trail",
    name: "Korlai Fort & Lighthouse Coastal Walk",
    region: "Alibaug",
    category: "coastal",
    difficulty: "easy",
    price: 1199,
    advanceAmount: 600,
    duration: "1 day",
    distance: "125 km from Mumbai",
    maxAltitude: "90 m (300 ft)",
    startPoint: "Korlai Koliwada",
    endPoint: "Korlai Koliwada",
    baseVillage: "Korlai (कोर्लई, Kashid)",
    description: "An unusual headland fort built by the Portuguese in 1521, jutting straight out like an island into the Arabian Sea at the mouth of Kundalika river. Famous for its Creole Portuguese-speaking village, active lighthouse, and 360° ocean views.",
    images: [
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80"
    ],
    highlights: ["360° Arabian Sea Ocean Panoramas", "Historic Active Lighthouse Tour", "Portuguese Fort Ruins with Inscribed Cross", "Secluded Rocky Beach Below Ramparts"],
    bestSeason: "October to April",
    approved: true,
    featured: false
  },
  {
    slug: "revdanda-beach-ramparts-walk",
    name: "Revdanda Beach & Coastal Fort Ramparts",
    region: "Alibaug",
    category: "coastal",
    difficulty: "easy",
    price: 1199,
    advanceAmount: 600,
    duration: "1 day",
    distance: "120 km from Mumbai",
    maxAltitude: "Sea Level",
    startPoint: "Revdanda Beach",
    endPoint: "Revdanda Beach",
    baseVillage: "Revdanda (रेवदंडा, Alibaug)",
    description: "A tranquil coastal walk along centuries-old Portuguese sea fort walls overgrown with ancient betel palms and banyan trees, terminating at the scenic Revdanda black-sand beach and creek bridge.",
    images: [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80"
    ],
    highlights: ["Ancient Portuguese Fortress Embedded in Coconut Groves", "Black-Sand Sunset Shoreline", "Historic Cannon Emplacements", "Authentic Alibaug Fish Curry Lunch"],
    bestSeason: "October to May",
    approved: true,
    featured: false
  },
  {
    slug: "suvarnadurg-island-sea-fort",
    name: "Suvarnadurg Island Fort & Dolphin Trail",
    region: "Dapoli",
    category: "coastal",
    difficulty: "easy",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "235 km from Mumbai",
    maxAltitude: "Sea Level",
    startPoint: "Harnai Port Jetty",
    endPoint: "Harnai Port Jetty",
    baseVillage: "Harnai (हर्णै, Dapoli)",
    description: "The 'Golden Fort' is an 8-acre offshore sea citadel captured by Chhatrapati Shivaji Maharaj in 1660 to serve as the naval shipbuilding headquarters of Admiral Kanhoji Angre. Accessible by local fishing boat with frequent dolphin sightings.",
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80"
    ],
    highlights: ["Kanhoji Angre's Maratha Naval Stronghold", "Hidden Sea Gate (Chor Darwaja) Accessible from Boat", "Dolphin Watching in Harnai Bay", "Harnai Fish Auction Experience"],
    bestSeason: "October to May",
    approved: true,
    featured: false
  },
  {
    slug: "kanakdurg-fattehgad-coastal-walk",
    name: "Kanakdurg & Fattehgad Headland Watchtowers",
    region: "Dapoli",
    category: "coastal",
    difficulty: "easy",
    price: 1199,
    advanceAmount: 600,
    duration: "1 day",
    distance: "235 km from Mumbai",
    maxAltitude: "45 m (150 ft)",
    startPoint: "Harnai Fish Market",
    endPoint: "Harnai Fish Market",
    baseVillage: "Harnai (हर्णै, Dapoli)",
    description: "The land-based twin protector forts of Suvarnadurg, perched directly over the crashing waves of Harnai harbour. Features an active lighthouse, old cannons pointing toward the ocean, and panoramic vistas.",
    images: [
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80"
    ],
    highlights: ["Twin Protective Watchtowers of Harnai Harbour", "Active Lighthouse with Sunset Lookout", "Crashing Wave Sea Cliffs", "Fresh Konkani Solkadhi & Sea Cuisine"],
    bestSeason: "October to May",
    approved: true,
    featured: false
  },
  {
    slug: "jaigad-fort-temple-trail",
    name: "Jaigad Fort & Karhateshwar Cliff Temple",
    region: "Ratnagiri",
    category: "coastal",
    difficulty: "easy",
    price: 1499,
    advanceAmount: 750,
    duration: "1 day 1 night",
    distance: "320 km from Mumbai",
    maxAltitude: "60 m (200 ft)",
    startPoint: "Jaigad Base",
    endPoint: "Karhateshwar Temple",
    baseVillage: "Jaigad (जयगड, Ratnagiri)",
    description: "Commands the deep estuary where the Shastri river meets the Arabian Sea. Walk along unbroken outer ramparts, explore the subterranean escape tunnels, and hike along cliff paths to the secluded Karhateshwar wooden Shiva shrine.",
    images: [
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1200&q=80"
    ],
    highlights: ["Shastri River Estuary Lookout", "Intact Moat & Rampart Walkway", "Karhateshwar Wooden Temple Perched on Cliff", "Jaigad Lighthouse & Dolphin Lookout"],
    bestSeason: "October to April",
    approved: true,
    featured: false
  },
  {
    slug: "purnagad-fort-coastal-trail",
    name: "Purnagad Fort & Machi Ocean Lookout",
    region: "Ratnagiri",
    category: "coastal",
    difficulty: "easy",
    price: 1399,
    advanceAmount: 700,
    duration: "1 day 1 night",
    distance: "345 km from Mumbai",
    maxAltitude: "75 m (250 ft)",
    startPoint: "Purnagad Village",
    endPoint: "Purnagad Village",
    baseVillage: "Purnagad (पूर्णगड, Ratnagiri)",
    description: "A compact hilltop fortress built by Kanhoji Angre overlooking the azure waters of Muchkundi creek. Features intact stone arches, Ganesh temple, and serene empty beaches nestled below.",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"
    ],
    highlights: ["Muchkundi River Creek Estuary View", "Intact Main Stone Gateway with Carved Sun", "Quiet Unspoiled Konkan Fishing Village", "Hidden Coastal Cove Trail"],
    bestSeason: "October to April",
    approved: true,
    featured: false
  }
];

async function seedMoreTreks() {
  console.log(`Seeding ${ADDITIONAL_TREKS.length} iconic Sahyadri & Kokan treks into Firestore...`);
  
  for (const trek of ADDITIONAL_TREKS) {
    const existing = await db.collection('treks').where('slug', '==', trek.slug).limit(1).get();
    if (!existing.empty) {
      console.log(`  Updating existing trek: ${trek.slug}`);
      await existing.docs[0].ref.update({
        ...trek,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      console.log(`  Adding new trek: ${trek.slug}`);
      await db.collection('treks').add({
        ...trek,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  }

  const snap = await db.collection('treks').get();
  console.log(`\n🎉 Done! Total treks in Firestore is now: ${snap.size}`);
}

seedMoreTreks();

