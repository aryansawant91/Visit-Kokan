export const LISTING_CATEGORIES = [
  { value: "homestay",   label: "Homestay",   emoji: "🏡" },
  { value: "hotel",      label: "Hotel",      emoji: "🏨" },
  { value: "restaurant", label: "Restaurant", emoji: "🍽️" },
  { value: "activity",   label: "Activity",   emoji: "🚣" },
  { value: "transport",  label: "Transport",  emoji: "🚗" },
  { value: "shop",       label: "Shop",       emoji: "🛍️" },
  { value: "other",      label: "Other",      emoji: "📍" },
] as const;

export const LISTING_REGIONS = [
  "Ratnagiri",
  "Sindhudurg",
  "Raigad",
  "Alibaug",
  "Malvan",
  "Dapoli",
  "Guhagar",
  "Vengurla",
] as const;

export const PRICE_UNITS = [
  "per night",
  "per person",
  "per day",
  "per trip",
  "per kg",
  "per item",
] as const;

export const STAY_TYPES = [
  { value: "entire_place", label: "Entire Villa / Private Bungalow", desc: "Guests have the whole property exclusively" },
  { value: "private_room", label: "Private Room in Homestay", desc: "Private room with family hospitality in a local home" },
  { value: "cottage", label: "Beach Cottage / Wooden Chalet", desc: "Standalone nature cottage near the shore or coconut grove" },
  { value: "farmstay", label: "Heritage Wada / Agro Farmstay", desc: "Authentic Chira stone architecture surrounded by plantations" },
] as const;

export const BEACH_DISTANCES = [
  "Beach Touch (Direct Seafront)",
  "2-3 min walk (Under 200m)",
  "5-10 min walk (200m – 500m)",
  "Short Drive (1 – 3 km)",
  "Hilltop / Forest / Riverside",
] as const;

export const MEAL_OPTIONS = [
  "Complimentary Konkani Breakfast (Ghavane, Poha, Chai)",
  "Authentic Malvani Fish & Chicken Thali on Request",
  "Homecooked Pure Veg & Jain Meals",
  "Fresh Catch Cooked to Order",
  "Equipped Guest Kitchen for Self-Cooking",
  "Electric Kettle & Tea Setup in Room",
] as const;

export const AMENITY_CATEGORIES = [
  {
    category: "Comfort & Utilities",
    items: [
      "Air Conditioning (AC)",
      "24/7 Power Backup (Inverter/DG)",
      "High-Speed Wi-Fi",
      "Hot Water Geyser",
      "Attached Western Washroom",
      "Smart TV",
    ],
  },
  {
    category: "Nature & Views",
    items: [
      "Sea View / Ocean Facing",
      "Coconut & Betel Nut Grove (Baug)",
      "Traditional Sit-out (Otla / Verandah)",
      "Private Lawn / Garden",
      "Private Balcony / Terrace",
      "Bonfire & Barbeque Setup",
    ],
  },
  {
    category: "Convenience & Safety",
    items: [
      "Free Car & Bus Parking on Premises",
      "24/7 Resident Caretaker on Call",
      "Refrigerator",
      "RO Purified Drinking Water",
      "Driver Accommodation Available",
      "CCTV in Outdoor Common Areas",
    ],
  },
  {
    category: "Guest Policies",
    items: [
      "Couple Friendly (Local IDs Welcomed)",
      "Family & Children Friendly",
      "Pet Friendly (Pets Allowed)",
      "Alcohol Permitted in Rooms",
      "Smoking Permitted in Outdoor Verandah",
    ],
  },
] as const;
