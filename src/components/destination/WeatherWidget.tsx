"use client";

interface Props {
  region: string;
  bestSeason: string;
}

type Season = "summer" | "monsoon" | "winter";

function getCurrentSeason(): Season {
  const month = new Date().getMonth() + 1;
  if (month >= 6 && month <= 9) return "monsoon";
  if (month >= 10 || month <= 2) return "winter";
  return "summer";
}

const SEASON_DATA: Record<Season, {
  label: string;
  emoji: string;
  temp: string;
  desc: string;
  color: string;
}> = {
  winter: {
    label: "Winter",
    emoji: "🌤️",
    temp: "18°C – 30°C",
    desc: "Pleasant and dry — perfect for beach visits and outdoor activities.",
    color: "from-blue-50 to-sky-50 border-blue-100",
  },
  summer: {
    label: "Summer",
    emoji: "☀️",
    temp: "28°C – 38°C",
    desc: "Hot and humid. Early mornings are pleasant. Best for indoor sightseeing.",
    color: "from-orange-50 to-amber-50 border-orange-100",
  },
  monsoon: {
    label: "Monsoon",
    emoji: "🌧️",
    temp: "22°C – 30°C",
    desc: "Heavy rainfall transforms the coast green. Waterfalls are stunning but travel may be difficult.",
    color: "from-teal-50 to-emerald-50 border-teal-100",
  },
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const RAINFALL = [5, 5, 10, 15, 30, 250, 400, 380, 200, 80, 30, 10];

export default function WeatherWidget({ region, bestSeason }: Props) {
  const season = getCurrentSeason();
  const data = SEASON_DATA[season];
  const currentMonth = new Date().getMonth();
  const maxRain = Math.max(...RAINFALL);

  return (
    <div className={`rounded-2xl border bg-gradient-to-br ${data.color} p-5`}>
      <h3 className="font-semibold text-kokan-earth mb-4 flex items-center gap-2">
        🌦️ Weather & Climate
      </h3>

      {/* Current season */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl">{data.emoji}</span>
        <div>
          <p className="font-semibold text-kokan-earth">{data.label} Season</p>
          <p className="text-kokan-earth/60 text-sm">{data.temp}</p>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-5 leading-relaxed">{data.desc}</p>

      {/* Rainfall bar chart */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2 font-medium">Monthly Rainfall (mm)</p>
        <div className="flex items-end gap-1 h-16">
          {RAINFALL.map((rain, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              <div
                className={`w-full rounded-t transition-all ${
                  i === currentMonth
                    ? "bg-kokan-green"
                    : "bg-kokan-green/25"
                }`}
                style={{ height: `${(rain / maxRain) * 52}px` }}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-1 mt-1">
          {MONTHS.map((m, i) => (
            <div
              key={m}
              className={`flex-1 text-center text-[9px] font-medium ${
                i === currentMonth ? "text-kokan-green" : "text-gray-400"
              }`}
            >
              {m}
            </div>
          ))}
        </div>
      </div>

      {/* Best season badge */}
      <div className="flex items-center gap-2 pt-3 border-t border-white/50">
        <span className="text-xs text-gray-500">Best time to visit:</span>
        <span className="text-xs font-semibold text-kokan-green bg-kokan-green/10 px-2 py-0.5 rounded-full">
          {bestSeason}
        </span>
      </div>
    </div>
  );
}