import { NextRequest, NextResponse } from 'next/server'
import { adminDb as db } from '@/lib/firebaseAdmin'
import { getCollaborativeRecommendations } from '@/lib/ml/collaborative'
import { getPersonalizedTrending } from '@/lib/ml/personalized'

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get('productId')
  const userId    = req.nextUrl.searchParams.get('userId')
  const type      = req.nextUrl.searchParams.get('type') // 'similar' | 'trending'

  try {
    // Fetch all approved products (lightweight — id, category, region, trendingScore only)
    const snap = await db
      .collection('products')
      .where('approved', '==', true)
      .get()

    const allProducts = snap.docs.map((d) => ({
      id: d.id,
      category: d.data().category,
      region: d.data().region,
      trendingScore: d.data().trendingScore ?? 0,
      isFeaturedTrending: d.data().isFeaturedTrending ?? false,
      trendingPriority: d.data().trendingPriority ?? 0,
    }))

    // Collaborative filtering — similar products for product detail page
    if (type === 'similar' && productId) {
      const limit = parseInt(req.nextUrl.searchParams.get('limit') ?? '5')
      const ids = await getCollaborativeRecommendations(productId, allProducts, limit)
      const productDocs = await Promise.all(
        ids.map(async (id) => {
          const d = await db.collection('products').doc(id).get()
          if (!d.exists) return null
          return { id: d.id, ...d.data() }
        })
      )
      return NextResponse.json(productDocs.filter(Boolean))
    }

    // Personalized trending — for homepage
    if (type === 'trending' && userId) {
      const ids = await getPersonalizedTrending(userId, allProducts)
      const productDocs = await Promise.all(
        ids.map(async (id) => {
          const d = await db.collection('products').doc(id).get()
          if (!d.exists) return null
          return { id: d.id, ...d.data() }
        })
      )
      return NextResponse.json(productDocs.filter(Boolean))
    }

    return NextResponse.json({ error: 'Invalid params' }, { status: 400 })
  } catch (err: any) {
    console.error('ML recommendations error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}