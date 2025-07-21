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