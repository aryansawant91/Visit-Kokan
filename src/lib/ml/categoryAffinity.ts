import { db } from '@/lib/firebase'
import {
  collection, query, where, getDocs,
  Timestamp
} from 'firebase/firestore'

// Client-side: get user's category affinity from productEvents
export async function getUserCategoryAffinity(userId: string): Promise<string[]> {
  try {
    // Look at last 30 days of events
    const cutoff = Timestamp.fromDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))

    const q = query(
      collection(db, 'productEvents'),
      where('userId', '==', userId),
      where('timestamp', '>=', cutoff)
    )

    const snap = await getDocs(q)
    if (snap.empty) return [] // fallback to default order

    // Get unique productIds from events
    const productIds = new Set<string>()
    const scoreByProduct: Record<string, number> = {}

    snap.docs.forEach((doc) => {
      const { productId, weight } = doc.data()
      if (!productId) return
      productIds.add(productId)
      scoreByProduct[productId] = (scoreByProduct[productId] ?? 0) + (weight ?? 1)
    })

    if (productIds.size === 0) return []

    // Fetch categories for these products (client-side Firestore)
    const ids = Array.from(productIds)
    const batches: string[][] = []
    for (let i = 0; i < ids.length; i += 10) batches.push(ids.slice(i, i + 10))

    const { collection: col, query: q2, where: w, getDocs: gd, getFirestore } = await import('firebase/firestore')
    const { db: clientDb } = await import('@/lib/firebase')

    const categoryScores: Record<string, number> = {}

    await Promise.all(
      batches.map(async (batch) => {
        const batchQuery = query(
          collection(clientDb, 'products'),
          where('__name__', 'in', batch)
        )
        const batchSnap = await getDocs(batchQuery)
        batchSnap.docs.forEach((d) => {
          const category = d.data().category
          if (!category) return
          categoryScores[category] = (categoryScores[category] ?? 0) + (scoreByProduct[d.id] ?? 1)
        })
      })
    )

    // Return categories sorted by affinity score
    return Object.entries(categoryScores)
      .sort((a, b) => b[1] - a[1])
      .map(([cat]) => cat)
  } catch {
    return [] // always fall back gracefully
  }
}