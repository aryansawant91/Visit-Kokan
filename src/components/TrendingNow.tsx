'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { db } from '@/lib/firebase'
import {
  collection, query, orderBy, limit,
  getDocs, doc, getDoc, where
} from 'firebase/firestore'
import { Flame, Sparkles } from 'lucide-react'
import ProductCard from '@/components/products/ProductCard'
import { Product } from '@/types/product'

export default function TrendingNow() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading]   = useState(true)
  const [isPersonalized, setIsPersonalized] = useState(false)

  useEffect(() => {
    fetch('/api/trending/recalculate').catch(() => {})

    async function fetchTrending() {
      try {
        // If logged in — try personalized trending from ML API
        if (user?.uid) {
          const res  = await fetch(`/api/ml/recommendations?type=trending&userId=${user.uid}`)
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            setProducts(data)
            setIsPersonalized(true)
            return
          }
        }

        // Fallback — global trending (pinned + ML scored)
        const pinnedQ = query(
          collection(db, 'products'),
          where('isFeaturedTrending', '==', true),
          where('status', '==', 'approved'),
          orderBy('trendingPriority', 'asc'),
          limit(4)
        )
        const pinnedSnap = await getDocs(pinnedQ)
        const pinned     = pinnedSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product))
        const pinnedIds  = new Set(pinned.map(p => p.id))

        const scoresQ = query(
          collection(db, 'trendingScores'),
          orderBy('score', 'desc'),
          limit(16)
        )
        const scoresSnap     = await getDocs(scoresQ)
        const scoreProductIds = scoresSnap.docs
          .map(d => d.data().productId as string)
          .filter(id => !pinnedIds.has(id))
          .slice(0, 12 - pinned.length)

        const mlProducts = await Promise.all(
          scoreProductIds.map(async (id) => {
            const snap = await getDoc(doc(db, 'products', id))
            if (!snap.exists()) return null
            const data = snap.data()
            if (data.status !== 'approved') return null
            return { id: snap.id, ...data } as Product
          })
        )

        const merged = [
          ...pinned,
          ...(mlProducts.filter(Boolean) as Product[]),
        ].slice(0, 12)

        setProducts(merged)
      } catch (err) {
        console.error('TrendingNow fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTrending()
  }, [user?.uid])

  if (!loading && products.length === 0) return null

  return (
    <section className="py-4">
      <div className="flex items-center gap-2 px-4 mb-3">
        {isPersonalized
          ? <Sparkles className="w-5 h-5 text-kokan-green" />
          : <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
        }
        <h2 className="text-base font-bold text-kokan-earth">
          {isPersonalized ? 'Picked For You' : 'Trending Now'}
        </h2>
        <span className="text-xs text-kokan-earth/40 ml-1">
          {isPersonalized ? 'based on your taste' : 'updated hourly'}
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-none snap-x snap-mandatory">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-36 sm:w-44 rounded-xl bg-kokan-cream/40 animate-pulse snap-start"
                style={{ height: 220 }}
              />
            ))
          : products.map((product, index) => (
              <div key={product.id} className="flex-shrink-0 w-36 sm:w-44 snap-start relative">
                <span className="absolute top-1.5 left-1.5 z-10 w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center shadow">
                  {index + 1}
                </span>
                <ProductCard product={product} />
              </div>
            ))
        }
      </div>
    </section>
  )
}