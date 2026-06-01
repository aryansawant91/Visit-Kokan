import { adminDb as db } from '@/lib/firebaseAdmin'

interface CategoryScore {
  category: string
  score: number
}

// Get user's category affinity from their order history
export async function getUserCategoryScores(userId: string): Promise<CategoryScore[]> {
  const snap = await db
    .collection('orders')
    .where('userId', '==', userId)
    .where('paymentVerified', '==', true)
    .where('orderType', '==', 'product')
    .get()

  if (snap.empty) return [] // no data yet — caller handles fallback

  // Count category purchases per user
  const categoryCounts: Record<string, number> = {}

  snap.docs.forEach((doc) => {
    const items: { productId: string }[] = doc.data().items ?? []
    // We don't have category on order items — fetch from productEvents instead
    // For now count by order frequency (1 order = 1 signal per item)
    items.forEach(() => {
      // placeholder — real category comes from productEvents below
    })
  })

  // Better signal — use productEvents (click + purchase) per user
  const eventsSnap = await db
    .collection('productEvents')
    .where('userId', '==', userId)
    .get()

  const productIds = new Set<string>()
  const eventsByProduct: Record<string, number> = {}

  eventsSnap.docs.forEach((doc) => {
    const { productId, weight } = doc.data()
    if (!productId) return
    productIds.add(productId)
    eventsByProduct[productId] = (eventsByProduct[productId] ?? 0) + (weight ?? 1)
  })

  if (productIds.size === 0) return []

  // Fetch product categories for these productIds in batches of 10
  const ids = Array.from(productIds)
  const batches = []
  for (let i = 0; i < ids.length; i += 10) {
    batches.push(ids.slice(i, i + 10))
  }

  const productCategoryMap: Record<string, string> = {}
  await Promise.all(
    batches.map(async (batch) => {
      const snap = await db
        .collection('products')
        .where('__name__', 'in', batch)
        .get()
      snap.docs.forEach((d) => {
        productCategoryMap[d.id] = d.data().category
      })
    })
  )

  // Sum scores per category
  Object.entries(eventsByProduct).forEach(([productId, score]) => {
    const category = productCategoryMap[productId]
    if (!category) return
    categoryCounts[category] = (categoryCounts[category] ?? 0) + score
  })

  return Object.entries(categoryCounts)
    .map(([category, score]) => ({ category, score }))
    .sort((a, b) => b.score - a.score)
}

// Get personalized trending product IDs for a user
export async function getPersonalizedTrending(
  userId: string,
  allProducts: { id: string; category: string; trendingScore?: number }[],
  limit = 12
): Promise<string[]> {
  const categoryScores = await getUserCategoryScores(userId)
  const hasRealData = categoryScores.length > 0

  if (!hasRealData) {
    // Fallback — return global trending order
    return allProducts
      .sort((a, b) => (b.trendingScore ?? 0) - (a.trendingScore ?? 0))
      .slice(0, limit)
      .map((p) => p.id)
  }

  // Boost products in user's preferred categories
  const categoryRank: Record<string, number> = {}
  categoryScores.forEach(({ category }, index) => {
    categoryRank[category] = categoryScores.length - index // higher = preferred
  })

  return allProducts
    .map((p) => ({
      id: p.id,
      score: (p.trendingScore ?? 0) + (categoryRank[p.category] ?? 0) * 5,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((p) => p.id)
}