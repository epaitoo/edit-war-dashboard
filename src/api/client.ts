// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

// Helper function for making requests
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export const api = {
    // Get all alerts (paginated)
     getAlerts: (params?: {
        page?: number;
        size?: number;
        status?: string;
        severity?: string;
    }) => {
        const searchParams = new URLSearchParams();
        if (params?.page !== undefined) searchParams.set('page', params.page.toString());
        if (params?.size !== undefined) searchParams.set('size', params.size.toString());
        if (params?.status) searchParams.set('status', params.status);
        if (params?.severity) searchParams.set('severity', params.severity);
        
        const query = searchParams.toString();
        return fetchAPI<AlertsResponse>(`/alerts${query ? `?${query}` : ''}`);
    },


    // Get recent active alerts
    getRecentAlerts: () => {
        return fetchAPI<EditWarAlert[]>('/alerts/recent');
    },

    // Get single alert by ID
    getAlert: (id: number) => {
        return fetchAPI<EditWarAlert>(`/alerts/${id}`);
    },

    // Get statistics
    getStats: () => {
        return fetchAPI<Stats>('/stats');
    },

    // Search alerts
    searchAlerts: (query: string) => {
        return fetchAPI<EditWarAlert[]>(`/alerts/search?q=${encodeURIComponent(query)}`);
    },

    // Health check
    getHealth: () => {
        return fetchAPI<HealthResponse>('/health');
    },
}

export interface EditWarAlert {
  severityLevel: any;
  pageTitle: string;
  wiki: string;
  severityScore: number;
  totalEdits: number;
  conflictEdits: number;
  conflictRatio: number;
  userCount: number;
  involvedUsers: string[];
  firstEditTimestamp: number;
  lastEditTimestamp: number;
  detectedAt: string;
  status: 'ACTIVE' | 'RESOLVED' | 'ESCALATING' | 'COOLING_DOWN';
}

export interface AlertsResponse {
  content: EditWarAlert[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface Stats {
  totalAlerts: number;
  activeAlerts: number;
  resolvedAlerts: number;
}

export interface HealthResponse {
  status: string;
  service: string;
  totalAlerts: number;
}
