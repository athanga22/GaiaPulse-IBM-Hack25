import { useQuery } from '@tanstack/react-query'
import { fetchPulseHistory } from '../lib/api'

export function usePulseHistory(days: number = 7) {
  return useQuery({
    queryKey: ['pulseHistory', days],
    queryFn: () => fetchPulseHistory(days),
    refetchInterval: 20000, // Poll every 20 seconds
    refetchIntervalInBackground: false,
    staleTime: 10000, // Consider data stale after 10 seconds
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  })
}
