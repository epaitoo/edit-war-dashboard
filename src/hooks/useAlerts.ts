import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

// Hook to get recent active alerts
export function useRecentAlerts() {
    return useQuery({
        queryKey:  ['alerts', 'recent'],
        queryFn: api.getRecentAlerts
    })
}

// Hook to get paginated alerts
export function useAlerts(params?: {
    page?: number;
    size?: number;
    status?: string;
    severity?: string;
}) {
    return useQuery({
        queryKey: ['alerts', 'paginated', params],
        queryFn: () => api.getAlerts(params),
    });
}

// Hook to get single alert
export function useAlert(id: number) {
  return useQuery({
    queryKey: ['alerts', id],
    queryFn: () => api.getAlert(id),
    enabled: !!id, // Only run if id exists
  });
}

// Hook to search alerts
export function useSearchAlerts(query: string) {
  return useQuery({
    queryKey: ['alerts', 'search', query],
    queryFn: () => api.searchAlerts(query),
    enabled: query.length > 0, // Only search if query exists
  });
}

