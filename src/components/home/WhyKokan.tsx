const reasons = [
  {
    icon: '🌊',
    title: 'Untouched Coastline',
    desc: 'Over 720 km of pristine beaches, hidden coves and dramatic sea cliffs — mostly crowd-free.',
  },
  {
    icon: '🏰',
    title: 'Living History',
    desc: 'Maratha sea forts, Portuguese churches and ancient temples dot the entire coastline.',
  },
  {
    icon: '🦞',
    title: 'Authentic Cuisine',
    desc: 'Malvani fish curry, Solkadhi, Modak and fresh catch straight from the Arabian Sea.',
  },
  {
    icon: '🌿',
    title: 'Lush Sahyadris',
    desc: 'Dense forests, cascading waterfalls and rich biodiversity just inland from the coast.',
  },
  {
    icon: '🛖',
    title: 'Warm Homestays',
    desc: 'Stay with local families and experience genuine Konkani hospitality and culture.',
  },
  {
    icon: '🧭',
    title: 'Year-Round Trails',
    desc: 'Coastal treks, fort hikes and nature walks suitable for all levels of fitness.',
  },
]

export default function WhyKokan() {
  return (
    <section className="py-20 bg-kokan-cream">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-14">
          <p className="text-kokan-sand text-sm font-medium tracking-widest uppercase mb-2">
            Why Choose Kokan
          </p>
          <h2 className="text-4xl md:text-5xl font-display text-kokan-earth font-bold">
            A World Apart
          </h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto text-lg">
            The Konkan coast is one of India's best kept secrets — raw, real and breathtaking.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((r) => (
            <div
              key={r.title}
              className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow border border-gray-50"
            >
              <div className="text-4xl mb-4">{r.icon}</div>
              <h3 className="text-lg font-display font-bold text-kokan-earth mb-2">{r.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}