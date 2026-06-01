import { adminDb as db } from '@/lib/firebaseAdmin'

interface CoMatrix {
  [productId: string]: { [otherProductId: string]: number }
}

// Build co-purchase matrix from verified orders
export async function buildCoPurchaseMatrix(): Promise<CoMatrix> {
  const snap = await db
    .collection('orders')
    .where('paymentVerified', '==', true)
    .where('orderType', '==', 'product')
    .get()

  const matrix: CoMatrix = {}

  snap.docs.forEach((doc) => {
    const items: { productId: string }[] = doc.data().items ?? []
    const ids = items.map((i) => i.productId).filter(Boolean)

    // For every pair in this order, increment co-purchase count
    for (let i = 0; i < ids.length; i++) {
      for (let j = 0; j < ids.length; j++) {
        if (i === j) continue
        if (!matrix[ids[i]]) matrix[ids[i]] = {}
        matrix[ids[i]][ids[j]] = (matrix[ids[i]][ids[j]] ?? 0) + 1
      }
    }
  })

  return matrix
}

// Get top N recommendations for a product
export async function getCollaborativeRecommendations(
  productId: string,
  allProducts: { id: string; category: string; region: string }[],
  limit = 4
): Promise<string[]> {
  const matrix = await buildCoPurchaseMatrix()
  const coScores = matrix[productId] ?? {}
  const hasRealData = Object.keys(coScores).length > 0

  if (hasRealData) {
    // Real ML path — sort by co-purchase count
    return Object.entries(coScores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => id)
  }

  // Fallback — same category + same region first, then same category
  const current = allProducts.find((p) => p.id === productId)
  if (!current) return []

  const sameRegionCategory = allProducts
    .filter((p) => p.id !== productId && p.category === current.category && p.region === current.region)
    .map((p) => p.id)

  const sameCategory = allProducts
    .filter((p) => p.id !== productId && p.category === current.category && p.region !== current.region)
    .map((p) => p.id)

  return [...sameRegionCategory, ...sameCategory].slice(0, limit)
}