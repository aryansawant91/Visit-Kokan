export const TREK_DIFFICULTIES = [
  { value: "easy",     label: "Easy",     color: "text-green-600 bg-green-50 border-green-200",   emoji: "🟢" },
  { value: "moderate", label: "Moderate", color: "text-yellow-600 bg-yellow-50 border-yellow-200", emoji: "🟡" },
  { value: "hard",     label: "Hard",     color: "text-orange-600 bg-orange-50 border-orange-200", emoji: "🟠" },
  { value: "expert",   label: "Expert",   color: "text-red-600 bg-red-50 border-red-200",          emoji: "🔴" },
] as const;

export const TREK_CATEGORIES = [
  { value: "coastal",   label: "Coastal",   emoji: "🌊" },
  { value: "forest",    label: "Forest",    emoji: "🌿" },
  { value: "waterfall", label: "Waterfall", emoji: "💧" },
  { value: "fort",      label: "Fort",      emoji: "🏰" },
  { value: "village",   label: "Village",   emoji: "🏘️" },
  { value: "night",     label: "Night Trek",emoji: "🌙" },
  { value: "other",     label: "Other",     emoji: "🥾" },
] as const;

export const TREK_REGIONS = [
  "Ratnagiri",
  "Sindhudurg",
  "Raigad",
  "Alibaug",
  "Malvan",
  "Dapoli",
  "Guhagar",
  "Vengurla",
] as const;

export const BEST_SEASONS = [
  "October to March",
  "November to February",
  "June to September",
  "Year Round",
  "October to May",
] as const;