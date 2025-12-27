import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';

export function useHealthCheck() {
  return useQuery({
    queryKey: ['health'],
    queryFn: api.getHealth,
    retry: 2,
    refetchInterval: 30000, // Check every 30 seconds
  });
}