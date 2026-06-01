import { db } from '@/lib/firebase'
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  writeBatch,
  doc,
  Timestamp,
} from 'firebase/firestore'

export type EventType = 'view' | 'click' | 'add_to_cart' | 'purchase' | 'wishlist' | 'share'

const EVENT_WEIGHTS: Record<EventType, number> = {
  view: 1,
  click: 2,
  wishlist: 4,
  share: 3,
  add_to_cart: 5,
  purchase: 10,
}

const DECAY_LAMBDA = 0.1 // higher = older events fade faster

function getAnonId(): string {
  if (typeof window === 'undefined') return 'server'
  let id = localStorage.getItem('vk_anon_id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('vk_anon_id', id)
  }
  return id
}

// Log a single product event to Firestore
export async function logProductEvent(
  productId: string,
  eventType: EventType,
  userId?: string
) {
  try {
    await addDoc(collection(db, 'productEvents'), {
      productId,
      eventType,
      weight: EVENT_WEIGHTS[eventType],
      userId: userId ?? null,
      anonId: getAnonId(),
      timestamp: serverTimestamp(),
    })
  } catch (err) {
    // Fail silently — never block UI for analytics
    console.warn('Event log failed:', err)
  }
}

// Calculate trending scores from raw events (last 72 hours)
// Called server-side in the API route
export async function calculateTrendingScores(): Promise<
  { productId: string; score: number }[]
> {
  const cutoff = Timestamp.fromDate(
    new Date(Date.now() - 72 * 60 * 60 * 1000)
  )

  const q = query(
    collection(db, 'productEvents'),
    where('timestamp', '>=', cutoff)
  )

  const snap = await getDocs(q)

  // Group events by productId and sum time-decayed weights
  const scores: Record<string, number> = {}
  const now = Date.now()

  snap.forEach((docSnap) => {
    const data = docSnap.data()
    const { productId, weight, timestamp } = data
    if (!productId || !timestamp) return

    const eventTime = (timestamp as Timestamp).toMillis()
    const hoursAgo = (now - eventTime) / (1000 * 60 * 60)
    const decay = Math.exp(-DECAY_LAMBDA * hoursAgo)
    const decayedScore = weight * decay

    scores[productId] = (scores[productId] ?? 0) + decayedScore
  })

  // Sort and return top 20
  return Object.entries(scores)
    .map(([productId, score]) => ({ productId, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
}

// Write computed scores back to trendingScores collection
export async function writeTrendingScores(
  scores: { productId: string; score: number }[]
) {
  const batch = writeBatch(db)
  const computedAt = serverTimestamp()

  scores.forEach(({ productId, score }, index) => {
    const ref = doc(db, 'trendingScores', productId)
    batch.set(ref, { productId, score, rank: index + 1, computedAt })
  })

  await batch.commit()
}