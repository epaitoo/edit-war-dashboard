import { useEffect, useRef, useState } from "react";

export interface SSEEvent {
  type: 'EDIT' | 'EDIT_WAR';
  data: any;
}

export function useSSE(url: string) {
    const [events, setEvents] = useState<SSEEvent[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const eventSourceRef = useRef<EventSource | null>(null);

    useEffect(() => {
        console.log('Connecting to SSE:', url);

        // Create EventSource connection
        const eventSource = new EventSource(url);
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
            console.log('SSE Connected');
            setIsConnected(true);
            setError(null);
        };

        

        eventSource.onmessage = (event) => {
            // console.log('📨 RAW SSE Event:', event.data);
            
            try {
                // Try to parse as JSON
                const data = JSON.parse(event.data);
                console.log('📦 Parsed SSE Data:', data);
                
                // Determine event type
                const eventType: SSEEvent = {
                type: data.type === 'EDIT_WAR' ? 'EDIT_WAR' : 'EDIT',
                data: data
                };

                console.log('🎯 Event Type:', eventType.type);
                setEvents((prev) => [...prev, eventType]);
            } catch (e) {
                console.log('📝 Non-JSON event (regular edit)');
                setEvents((prev) => [...prev, { type: 'EDIT', data: event.data }]);
            }
        };

        eventSource.onerror = (err) => {
            console.error('❌ SSE Error:', err);
            setError(new Error('SSE connection failed'));
            setIsConnected(false);
            eventSource.close();
        };

        // Cleanup on unmount
        return () => {
            console.log('Closing SSE connection');
            eventSource.close();
        };
    }, [url]);

    // Function to clear events
    const clearEvents = () => setEvents([]);

    // Function to manually reconnect
    const reconnect = () => {
        if (eventSourceRef.current) {
        eventSourceRef.current.close();
        }
        setEvents([]);
        setError(null);
    };

    return {
        events,
        isConnected,
        error,
        clearEvents,
        reconnect
    };
}

