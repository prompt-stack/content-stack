import { useState, useEffect } from 'react'

export interface User {
  email: string
  tier: 'free' | 'pro' | 'enterprise'
  avatar?: string
  name?: string
}

interface UseUserReturn {
  user: User | null
  loading: boolean
  error: Error | null
  updateUser: (user: Partial<User>) => void
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Simulate loading user data
    // In production, this would fetch from API
    const loadUser = async () => {
      try {
        setLoading(true)
        
        // Mock delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Mock user data - replace with API call
        const mockUser: User = {
          email: 'user@example.com',
          tier: 'pro',
          name: 'John Doe'
        }
        
        setUser(mockUser)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load user'))
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null)
  }

  return {
    user,
    loading,
    error,
    updateUser
  }
}