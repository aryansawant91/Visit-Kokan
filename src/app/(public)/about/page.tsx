import PublicTopBar from "@/components/layout/PublicTopBar";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-kokan-cream/20">
      {/* Hero */}
      <div className="relative h-64 bg-kokan-green overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80)", backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-playfair text-4xl font-bold text-white mb-2">About Visit Kokan</h1>
          <p className="text-white/70 max-w-xl text-sm">Your trusted guide to the Konkan coast</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Mission */}
        <div className="bg-white rounded-2xl p-8 border border-kokan-sand/30">
          <div className="text-4xl mb-4">🌿</div>
          <h2 className="font-playfair text-2xl font-bold text-kokan-earth mb-4">Our Mission</h2>
          <p className="text-kokan-earth/70 leading-relaxed">
            Visit Kokan was built with one goal — to make the magic of the Konkan coast accessible to everyone.
            From the mango orchards of Ratnagiri to the pristine beaches of Sindhudurg, we connect travellers
            with authentic local experiences, genuine products and the warm hospitality that defines this region.
          </p>
        </div>

        {/* What we offer */}
        <div>
          <h2 className="font-playfair text-2xl font-bold text-kokan-earth mb-6">What We Offer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { emoji: "🏖️", title: "Destinations", desc: "Curated guides to 50+ Konkan beaches, forts and villages" },
              { emoji: "🧗", title: "Treks", desc: "Guided treks through the Sahyadri ranges and coastal trails" },
              { emoji: "🏡", title: "Homestays", desc: "Verified local homestays and boutique stays along the coast" },
              { emoji: "🥭", title: "Local Products", desc: "Authentic Konkan produce — mangoes, cashews, kokum and more" },
              { emoji: "📝", title: "Travel Blogs", desc: "Stories from travellers, vendors and explorers of the coast" },
              { emoji: "🗺️", title: "Trip Planner", desc: "AI-powered itinerary builder for your perfect Kokan trip" },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-5 border border-kokan-sand/30 flex gap-4">
                <span className="text-3xl flex-shrink-0">{item.emoji}</span>
                <div>
                  <h3 className="font-semibold text-kokan-earth mb-1">{item.title}</h3>
                  <p className="text-sm text-kokan-earth/60 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-kokan-green rounded-2xl p-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: "50+", label: "Destinations" },
              { value: "5k+", label: "Travellers" },
              { value: "120+", label: "Local Vendors" },
              { value: "4.8★", label: "Avg Rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-white/60 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="bg-white rounded-2xl p-8 border border-kokan-sand/30">
          <h2 className="font-playfair text-2xl font-bold text-kokan-earth mb-2">Built with ❤️ for Kokan</h2>
          <p className="text-kokan-earth/70 leading-relaxed">
            Visit Kokan is a student project built by a team passionate about the Konkan coast.
            We are from Maharashtra and believe the Konkan deserves to be discovered by the world.
            Every feature on this platform is designed to make your Kokan journey easier, richer and more authentic.
          </p>
        </div>
      </div>
    </div>
  );
}