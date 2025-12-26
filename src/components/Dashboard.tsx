import { useRecentAlerts } from '../hooks/useAlerts';
import { useStats } from '../hooks/useStats';
import type { EditWarAlert } from '../api/client';
import { StatCard } from './StatCard';
import { LoadingSkeleton } from './LoadingSkeleton';
import { useSSE } from '../hooks/useSSE';
import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { NotificationBanner } from './NotificationBanner';
import { Link } from 'react-router-dom';

export function Dashboard() {

  // Fetch initial data
  const { data: alerts, isLoading: alertsLoading, error: alertsError } = useRecentAlerts();
  const { data: stats, isLoading: statsLoading } = useStats();

  // Connect to SSE stream
  const { events, isConnected, error: sseError } = useSSE('http://localhost:8081/stream');
  
  // State for new alerts from SSE
  const [newAlerts, setNewAlerts] = useState<EditWarAlert[]>([]);
  const [displayedAlerts, setDisplayedAlerts] = useState<EditWarAlert[]>([]);

  // Ref for scrolling to top
  const topRef = useRef<HTMLDivElement>(null);

  // Query client for invalidating cache
  const queryClient = useQueryClient();

  // Initialize displayed alerts when data loads
  useEffect(() => {
    if (alerts) {
      setDisplayedAlerts(alerts);
    }
  }, [alerts]);

  // Process SSE events
  useEffect(() => {
    console.log('🔄 Events changed, total:', events.length);
    if (events.length === 0) return;

      if (events.length === 0) return;

    const latestEvent = events[events.length - 1];
    
    if (latestEvent.type === 'EDIT_WAR') {
      console.log('🚨 New edit war detected!', latestEvent.data);
      
      // Parse the alert data
      try {
        let alertData: EditWarAlert;
        
        if (typeof latestEvent.data === 'string') {
          alertData = JSON.parse(latestEvent.data);
        } else {
          alertData = latestEvent.data;
        }

        // Add to new alerts (for notification)
        setNewAlerts(prev => [...prev, alertData]);
        
        // Invalidate queries to refetch latest data
        queryClient.invalidateQueries({ queryKey: ['alerts'] });
        queryClient.invalidateQueries({ queryKey: ['stats'] });
        
      } catch (e) {
        console.error('Failed to parse edit war data:', e);
      }
    }
  }, [events, queryClient]);

  // Handle "View Now" click
  const handleViewNewAlerts = () => {
    // Add new alerts to top of displayed list
    setDisplayedAlerts(prev => [...newAlerts, ...prev]);
    
    // Clear notification
    setNewAlerts([]);
    
    // Scroll to top smoothly
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

   // Handle dismiss notification
  const handleDismissNotification = () => {
    setNewAlerts([]);
  };

  // Show loading state
  if (alertsLoading || statsLoading) {
    return <LoadingSkeleton />;
  }


  // Show error state
  if (alertsError) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-bold text-red-800 mb-2">⚠️ Connection Error</h2>
          <p className="text-red-700 mb-4">
            Failed to connect to backend. Make sure your Spring Boot app is running on port 8081.
          </p>
          <pre className="text-xs bg-red-100 p-2 rounded overflow-auto">
            {alertsError.message}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      {/* Scroll anchor */}
      <div ref={topRef} />
      
      {/* Notification Banner */}
      <NotificationBanner 
        newAlerts={newAlerts}
        onView={handleViewNewAlerts}
        onDismiss={handleDismissNotification}
      />



      {/* Header */}
      <header className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              🚨 Wikipedia Edit War Detector
            </h1>
            <p className="text-gray-600 mt-2">
              Real-time monitoring of Wikipedia conflicts
            </p>
          </div>
          
          {/* Connection Status */}
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className={isConnected ? 'text-green-700' : 'text-red-700'}>
              {isConnected ? 'Live' : 'Disconnected'}
            </span>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total Alerts" 
          value={stats?.totalAlerts ?? 0}
          color="blue"
        />
        <StatCard 
          title="Active Wars" 
          value={stats?.activeAlerts ?? 0}
          trend={stats?.activeAlerts ? `+${stats.activeAlerts}` : undefined}
          color="red"
        />
        <StatCard 
          title="Resolved" 
          value={stats?.resolvedAlerts ?? 0}
          icon="✅"
          color="gray"
        />
      </div>

      

      {/* Live Feed */}
      {/* Live Feed */}
      <section className="bg-white rounded-lg shadow-md p-6">
        {/* Header with View All button - TOP */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <h2 className="text-2xl font-bold">Recent Edit Wars</h2>
          </div>
          
          <Link 
            to="/alerts"
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 transition"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Alerts list */}
        {displayedAlerts && displayedAlerts.length > 0 ? (
          <div className="space-y-4">
            {displayedAlerts.map((alert, idx) => (
              <AlertCard key={`${alert.pageTitle}-${idx}`} alert={alert} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg font-medium">No edit wars detected yet</p>
            <p className="text-sm mt-2">The system is monitoring Wikipedia...</p>
          </div>
        )}

        {/* Bottom button - only show if there are many alerts */}
        {displayedAlerts && displayedAlerts.length > 5 && (
          <div className="mt-6 text-center">
            <Link 
              to="/alerts"
              className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-2"
            >
              View All Past Battles
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </section>

      {/* SSE Error indicator */}
      {sseError && (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            ⚠️ Live updates disconnected. Historical data still available.
          </p>
        </div>
      )}

    </div>
  );
}

// Keep your existing StatCard and AlertCard components
// But update AlertCard to handle the real data structure:

function AlertCard({ alert }: { alert: EditWarAlert }) {
  // Calculate severity level from score
  const getSeverityLevel = (score: number): string => {
    if (score >= 0.8) return 'CRITICAL';
    if (score >= 0.6) return 'HIGH';
    if (score >= 0.4) return 'MEDIUM';
    return 'LOW';
  };

  const severityLevel = getSeverityLevel(alert.severityScore);

  const severityColors = {
    CRITICAL: 'border-red-500 bg-red-50',
    HIGH: 'border-orange-500 bg-orange-50',
    MEDIUM: 'border-yellow-500 bg-yellow-50',
    LOW: 'border-blue-500 bg-blue-50'
  };

  const severityEmojis = {
    CRITICAL: '🚨',
    HIGH: '⚠️',
    MEDIUM: '⚡',
    LOW: 'ℹ️'
  };

  const timeAgo = getTimeAgo(alert.detectedAt);

  return (
    <div className={`border-l-4 rounded-lg p-6 ${severityColors[severityLevel as keyof typeof severityColors]}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{severityEmojis[severityLevel as keyof typeof severityEmojis]}</span>
          <div>
            <h3 className="text-xl font-bold">{severityLevel}: {alert.pageTitle}</h3>
            <p className="text-sm text-gray-600">{timeAgo}</p>
          </div>
        </div>
      </div>

      {/* User Bars */}
      <div className="mb-4 space-y-2">
        {alert.involvedUsers.map((user) => {
          const editCount = Math.floor(alert.totalEdits / alert.userCount);
          const barWidth = (editCount / alert.totalEdits) * 100;
          
          return (
            <div key={user} className="flex items-center gap-3">
              <span className="w-20 text-sm font-medium truncate">{user}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-6">
                <div 
                  className="bg-blue-600 h-6 rounded-full flex items-center justify-end pr-2"
                  style={{ width: `${Math.max(barWidth, 10)}%` }}
                >
                  <span className="text-white text-xs font-bold">{editCount}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm text-gray-700 mb-3">
        <span>{alert.totalEdits} edits</span>
        <span>•</span>
        <span>{Math.round(alert.conflictRatio * 100)}% conflict</span>
        <span>•</span>
        <span className="font-medium">{alert.status}</span>
      </div>

      {/* Action */}
      <Link 
        to={`/alerts/${alert.pageTitle}`}  // We'll use pageTitle as ID for now
        className="text-blue-600 hover:text-blue-800 font-medium text-sm inline-block"
      >
        View Full Battle →
      </Link>
    </div>
  );
}

// Keep your existing helper functions
function getTimeAgo(timestamp: string): string {
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
  
  if (seconds < 60) return `${seconds} seconds ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}

