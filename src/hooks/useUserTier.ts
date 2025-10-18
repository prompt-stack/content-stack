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
 * @test-coverage 90
 * @test-file useUserTier.test.ts
 * @test-status missing
 */

import { useQuery } from '@tanstack/react-query'
import { Api } from '@/services/ApiService'
import type { TierLevel } from '@/types'

export function useUserTier(): TierLevel {
  const { data: userInfo } = useQuery({
    queryKey: ['user-info'],
    queryFn: Api.getUserInfo,
  })

  return userInfo?.tier || 'free'
}
