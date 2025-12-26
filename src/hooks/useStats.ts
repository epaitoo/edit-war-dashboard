import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: api.getStats,
    // Refetch stats more frequently since they change often
    staleTime: 1000 * 30, // 30 seconds
  });
}