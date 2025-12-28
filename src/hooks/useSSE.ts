import { useEffect, useState, useRef, useCallback } from 'react';
import type { EditWarAlert } from '../api/client';

export interface SSEEvent {
  type: 'EDIT' | 'EDIT_WAR';
  data: EditWarAlert | string | Record<string, unknown>;
}

export interface RecentEdit {
  pageTitle: string;
  user: string;
  lengthChange: number;
  timestamp: number;
}

export function useSSE(url: string) {
  const [events, setEvents] = useState<SSEEvent[]>([]);
  const [recentEdits, setRecentEdits] = useState<RecentEdit[]>([]); 
  const [editCount, setEditCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);

  const connect = useCallback(() => {
    console.log('🔌 Connecting to SSE:', url);
    
    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('✅ SSE Connected');
      setIsConnected(true);
      setError(null);
    };

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        
        if (parsed.type === 'EDIT_WAR') {
          console.log('🚨 EDIT WAR EVENT!', parsed.data);
          setEvents((prev) => [...prev, { type: 'EDIT_WAR', data: parsed.data }]);
        } else {
          // Regular edit 
          setEvents((prev) => [...prev, { type: 'EDIT', data: parsed }]);
          
          // Extract edit info from Wikipedia event
          if (parsed.title) {
            const edit: RecentEdit = {
              pageTitle: parsed.title,
              user: parsed.user || parsed.bot ? `${parsed.user} (bot)` : 'Anonymous',
              lengthChange: (parsed.length?.new || 0) - (parsed.length?.old || 0),
              timestamp: Date.now()
            };
            
            // Keep only last 5 edits
            setRecentEdits((prev) => [edit, ...prev].slice(0, 5));
            setEditCount((prev) => prev + 1);
          }
        }
      } catch {
        console.log('📝 Non-JSON event');
        setEvents((prev) => [...prev, { type: 'EDIT', data: event.data }]);
      }
    };

    eventSource.onerror = (err) => {
      console.error('❌ SSE Error:', err);
      setError(new Error('SSE connection failed'));
      setIsConnected(false);
      eventSource.close();
      
      console.log('⏳ Reconnecting in 5 seconds...');
      reconnectTimeoutRef.current = window.setTimeout(() => {
        connect();
      }, 5000);
    };
  }, [url]);

  useEffect(() => {
    connect();

    return () => {
      console.log('🔌 Closing SSE connection');
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);

  const clearEvents = () => setEvents([]);

  const reconnect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    if (reconnectTimeoutRef.current) {
      window.clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    setEvents([]);
    setRecentEdits([]);
    setEditCount(0);
    setError(null);
    connect();
  };

  return {
    events,
    recentEdits, 
    editCount,  
    isConnected,
    error,
    clearEvents,
    reconnect
  };
}