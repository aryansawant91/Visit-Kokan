'use client'

import { useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { logProductEvent, EventType } from '@/lib/trending'

export function useTrackEvent() {
  const { user } = useAuth()

  const track = useCallback(
    (productId: string, eventType: EventType) => {
      logProductEvent(productId, eventType, user?.uid)
    },
    [user]
  )

  return track
}