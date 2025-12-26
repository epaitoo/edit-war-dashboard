import { useEffect, useState, useRef, useCallback } from 'react';

export interface SSEEvent {
  type: 'EDIT' | 'EDIT_WAR';
  data: any;
}

export function useSSE(url: string) {
  const [events, setEvents] = useState<SSEEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null); 

  const connect = useCallback(() => {
    console.log('Connecting to SSE:', url);
    
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
        console.log('📦 Parsed SSE Data:', parsed);
        
        if (parsed.type === 'EDIT_WAR') {
          console.log('🚨 EDIT WAR EVENT!', parsed.data);
          setEvents((prev) => [...prev, { type: 'EDIT_WAR', data: parsed.data }]);
        } else {
          setEvents((prev) => [...prev, { type: 'EDIT', data: parsed }]);
        }
      } catch (e) {
        console.log('Non-JSON event');
        setEvents((prev) => [...prev, { type: 'EDIT', data: event.data }]);
      }
    };

    eventSource.onerror = (err) => {
      console.error('❌ SSE Error:', err);
      setError(new Error('SSE connection failed'));
      setIsConnected(false);
      eventSource.close();
      
      // Auto-reconnect after 5 seconds
      console.log('⏳ Reconnecting in 5 seconds...');
      reconnectTimeoutRef.current = window.setTimeout(() => { 
        connect();
      }, 5000);
    };
  }, [url]);

  useEffect(() => {
    connect();

    // Cleanup
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
    setError(null);
    connect();
  };

  return {
    events,
    isConnected,
    error,
    clearEvents,
    reconnect
  };
}