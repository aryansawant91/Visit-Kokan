const testimonials = [
  {
    name: 'Priya Sharma',
    location: 'Mumbai',
    text: 'Visit Kokan helped me plan the most perfect coastal getaway. The homestay recommendations were spot on and the trek booking was seamless.',
    avatar: 'PS',
    rating: 5,
  },
  {
    name: 'Rahul Desai',
    location: 'Pune',
    text: 'Found a hidden beach village I never knew existed. The AI trip planner suggested it based on my love for offbeat places. Absolutely magical.',
    avatar: 'RD',
    rating: 5,
  },
  {
    name: 'Ananya Joshi',
    location: 'Bangalore',
    text: 'The vendor listings are genuine and the photos are accurate. Booked a Malvani cooking experience — best food of my life.',
    avatar: 'AJ',
    rating: 5,
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-kokan-ocean">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-14">
          <p className="text-kokan-sand text-sm font-medium tracking-widest uppercase mb-2">
            Traveller Stories
          </p>
          <h2 className="text-4xl md:text-5xl font-display text-white font-bold">
            What People Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-7"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-kokan-sand text-lg">★</span>
                ))}
              </div>
              <p className="text-white/85 text-sm leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-kokan-sand text-white flex items-center justify-center text-sm font-bold">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{t.name}</p>
                  <p className="text-white/50 text-xs">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}