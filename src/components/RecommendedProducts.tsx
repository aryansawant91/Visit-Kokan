'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Sparkles } from 'lucide-react'
import ProductCard from '@/components/products/ProductCard'
import { Product } from '@/types/product'

export default function RecommendedProducts({ productId }: { productId: string }) {
  const { user }                        = useAuth()
  const [products, setProducts]         = useState<Product[]>([])
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const params = new URLSearchParams({
          type: 'similar',
          productId,
          limit: '5',
          ...(user?.uid ? { userId: user.uid } : {}),
        })
        const res  = await fetch(`/api/ml/recommendations?${params}`)
        const data = await res.json()
        if (Array.isArray(data)) setProducts(data)
      } catch {
        // fail silently
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [productId, user?.uid])

  if (!loading && products.length === 0) return null

  return (
    <div className="mt-12 space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-kokan-green" />
        <h2 className="font-playfair text-2xl font-bold text-kokan-earth">
          You May Also Like
        </h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden border border-kokan-sand/20">
              <div className="bg-kokan-sand/20 animate-pulse" style={{ paddingBottom: '100%' }} />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-kokan-sand/20 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-kokan-sand/20 rounded animate-pulse w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}