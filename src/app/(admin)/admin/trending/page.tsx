'use client'

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import {
  collection, query, getDocs, doc,
  updateDoc, orderBy, where, Timestamp
} from 'firebase/firestore'
import { Flame, Pin, PinOff, TrendingUp } from 'lucide-react'
import { Product } from '@/types/product'

interface TrendingScore { productId: string; score: number; rank: number; computedAt: Timestamp }

export default function AdminTrendingPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [scores, setScores] = useState<Record<string, TrendingScore>>({})
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      // All approved products
      const pSnap = await getDocs(
        query(collection(db, 'products'), where('status', '==', 'approved'))
      )
      const prods = pSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product))
      setProducts(prods)

      // Trending scores
      const sSnap = await getDocs(
        query(collection(db, 'trendingScores'), orderBy('score', 'desc'))
      )
      const scoreMap: Record<string, TrendingScore> = {}
      sSnap.docs.forEach(d => { scoreMap[d.id] = d.data() as TrendingScore })
      setScores(scoreMap)
    }
    load()
  }, [])

  async function togglePin(product: Product) {
    setSaving(product.id)
    const ref = doc(db, 'products', product.id)
    await updateDoc(ref, {
      isFeaturedTrending: !product.isFeaturedTrending,
      trendingPriority: !product.isFeaturedTrending ? Date.now() : 0,
    })
    setProducts(prev =>
      prev.map(p => p.id === product.id
        ? { ...p, isFeaturedTrending: !p.isFeaturedTrending }
        : p
      )
    )
    setSaving(null)
  }

  // Sort: pinned first, then by ML score
  const sorted = [...products].sort((a, b) => {
    if (a.isFeaturedTrending && !b.isFeaturedTrending) return -1
    if (!a.isFeaturedTrending && b.isFeaturedTrending) return 1
    return (scores[b.id]?.score ?? 0) - (scores[a.id]?.score ?? 0)
  })

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center gap-2 mb-6">
        <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
        <h1 className="text-xl font-bold text-kokan-earth">Trending Management</h1>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 text-sm text-orange-800">
        Pinned products always appear first regardless of ML score. ML scores update hourly based on clicks, cart adds, and purchases.
      </div>

      <div className="space-y-2">
        {sorted.map((product) => {
          const score = scores[product.id]
          return (
            <div
              key={product.id}
              className={`flex items-center gap-4 p-3 rounded-xl border transition-colors ${
                product.isFeaturedTrending
                  ? 'bg-orange-50 border-orange-200'
                  : 'bg-white border-kokan-sand/30'
              }`}
            >
              {/* Rank / pin indicator */}
              <div className="w-8 text-center">
                {product.isFeaturedTrending
                  ? <Pin className="w-4 h-4 text-orange-500 mx-auto" />
                  : score
                  ? <span className="text-xs font-bold text-kokan-earth/40">#{score.rank}</span>
                  : <TrendingUp className="w-4 h-4 text-kokan-earth/20 mx-auto" />
                }
              </div>

              {/* Product name */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-kokan-earth text-sm truncate">{product.name}</p>
                <p className="text-xs text-kokan-earth/50">{product.region} · ₹{product.price.toLocaleString('en-IN')}</p>
              </div>

              {/* ML Score */}
              <div className="text-right hidden sm:block">
                {score ? (
                  <>
                    <p className="text-sm font-bold text-kokan-earth">{score.score.toFixed(1)}</p>
                    <p className="text-[10px] text-kokan-earth/40">ML score</p>
                  </>
                ) : (
                  <p className="text-xs text-kokan-earth/30">no data yet</p>
                )}
              </div>

              {/* Pin toggle */}
              <button
                onClick={() => togglePin(product)}
                disabled={saving === product.id}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  product.isFeaturedTrending
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-kokan-earth/10 text-kokan-earth hover:bg-kokan-earth/20'
                }`}
              >
                {saving === product.id ? '...' : product.isFeaturedTrending
                  ? <><PinOff className="w-3.5 h-3.5" /> Unpin</>
                  : <><Pin className="w-3.5 h-3.5" /> Pin</>
                }
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}