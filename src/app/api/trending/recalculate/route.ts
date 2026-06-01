import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc, Timestamp } from 'firebase/firestore'
import { calculateTrendingScores, writeTrendingScores } from '@/lib/trending'

const RECALCULATE_INTERVAL_MS = 60 * 60 * 1000 // 1 hour

export async function GET() {
  try {
    // Check when scores were last computed
    const metaRef = doc(db, 'trendingMeta', 'lastRun')
    const metaSnap = await getDoc(metaRef)

    if (metaSnap.exists()) {
      const lastRun = (metaSnap.data().computedAt as Timestamp).toMillis()
      if (Date.now() - lastRun < RECALCULATE_INTERVAL_MS) {
        return NextResponse.json({ status: 'skipped', reason: 'too_soon' })
      }
    }

    const scores = await calculateTrendingScores()
    await writeTrendingScores(scores)

    return NextResponse.json({ status: 'ok', count: scores.length })
  } catch (err) {
    console.error('Trending recalculate error:', err)
    return NextResponse.json({ status: 'error' }, { status: 500 })
  }
}