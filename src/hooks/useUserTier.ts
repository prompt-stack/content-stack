/**
 * @file hooks/useUserTier.ts
 * @purpose Hook for UserTier management
 * @layer hook
 * @deps none
 * @used-by none
 * @css none
 * @llm-read true
 * @llm-write full-edit
 * @llm-role utility
 */

import { useQuery } from '@tanstack/react-query'
import { api } from '@/services/api'
import type { TierLevel } from '@/types'

export function useUserTier(): TierLevel {
  const { data: userInfo } = useQuery({
    queryKey: ['user-info'],
    queryFn: api.getUserInfo,
  })

  return userInfo?.tier || 'free'
}
