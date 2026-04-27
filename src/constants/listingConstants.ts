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