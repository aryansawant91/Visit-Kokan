const seasons = [
  {
    name: 'Monsoon',
    months: 'Jun – Sep',
    color: 'bg-teal-700',
    image: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=800&q=80',
    desc: 'Lush green landscapes, roaring waterfalls and dramatic skies.',
    best: ['Waterfall treks', 'Fort exploration', 'Nature camps'],
  },
  {
    name: 'Winter',
    months: 'Oct – Feb',
    color: 'bg-kokan-ocean',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    desc: 'Perfect weather for beaches, water sports and outdoor adventures.',
    best: ['Beach stays', 'Scuba diving', 'Coastal cycling'],
  },
  {
    name: 'Summer',
    months: 'Mar – May',
    color: 'bg-kokan-sunset',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
    desc: 'Mango season, Alphonso festivals and early morning beach walks.',
    best: ['Mango trails', 'Sunrise treks', 'Village tours'],
  },
]

export default function SeasonalHighlights() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-14">
          <p className="text-kokan-sand text-sm font-medium tracking-widest uppercase mb-2">
            Plan by Season
          </p>
          <h2 className="text-4xl md:text-5xl font-display text-kokan-earth font-bold">
            Kokan All Year Round
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {seasons.map((s) => (
            <div key={s.name} className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 min-h-[380px]">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${s.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 ${s.color} text-white text-xs font-medium rounded-full`}>
                  {s.months}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white font-display text-2xl font-bold mb-2">{s.name}</h3>
                <p className="text-white/70 text-sm mb-4">{s.desc}</p>
                <div className="flex flex-col gap-1.5">
                  {s.best.map((b) => (
                    <div key={b} className="flex items-center gap-2 text-white/80 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-kokan-sand shrink-0" />
                      {b}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}