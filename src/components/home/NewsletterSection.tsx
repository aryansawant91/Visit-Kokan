'use client'

import { useState } from 'react'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
    setEmail('')
  }

  return (
    <section className="py-20 bg-kokan-green">
      <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
        <p className="text-kokan-sand text-sm font-medium tracking-widest uppercase mb-3">
          Stay in the Loop
        </p>
        <h2 className="text-4xl md:text-5xl font-display text-white font-bold mb-4">
          Never Miss a Kokan Moment
        </h2>
        <p className="text-white/70 mb-10 text-lg">
          Get seasonal travel guides, hidden gem alerts and exclusive deals — straight to your inbox.
        </p>

        {submitted ? (
          <div className="bg-white/20 rounded-2xl px-8 py-6 text-white font-medium">
            Thank you! You're on the list.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-5 py-3.5 rounded-full text-gray-700 text-sm outline-none placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="px-8 py-3.5 bg-kokan-sand text-white rounded-full font-medium hover:bg-kokan-sunset transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  )
}