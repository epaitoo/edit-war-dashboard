import { useEffect, useState } from 'react';
import { hotPages, mockAlerts, mockStats, type EditWarAlert } from '../mockData';
import { LoadingSkeleton } from './LoadingSkeleton';

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return <LoadingSkeleton />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">
          Wikipedia Edit War Detector
        </h1>
        <p className="text-gray-600 mt-2">
          Real-time monitoring of Wikipedia conflicts
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Active Wars" 
          value={mockStats.activeWars} 
          trend="+2"
          color="blue"
        />
        <StatCard 
          title="Edits Today" 
          value={mockStats.editsToday.toLocaleString()} 
          color="gray"
        />
        <StatCard 
          title="Critical" 
          value={mockStats.criticalAlerts} 
          icon="⚠️"
          color="red"
        />
      </div>

      {/* Live Feed */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <h2 className="text-2xl font-bold">LIVE FEED - Edit Wars Detected</h2>
        </div>

        <div className="space-y-4">
          {mockAlerts.map(alert => (
            <AlertCard key={alert.id} alertVal={alert} />
          ))}
        </div>

        <button className="mt-6 text-blue-600 hover:text-blue-800 font-medium">
          View All Past Battles →
        </button>
      </section>

      <section className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">🔥 Hottest Pages (Most Edit Wars)</h2>
        <ol className="space-y-3">
            {hotPages.map((item, idx) => (
            <li key={item.page} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-gray-400">{idx + 1}.</span>
                <span className="font-medium">{item.page}</span>
                </div>
                <span className="text-sm text-gray-600">{item.wars} wars this week</span>
            </li>
            ))}
        </ol>
        </section>
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  icon?: string;
  color: 'blue' | 'gray' | 'red';
}

function StatCard({ title, value, trend, icon, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    gray: 'bg-gray-50 text-gray-700',
    red: 'bg-red-50 text-red-700'
  };

  return (
    <div className={`rounded-lg p-6 ${colorClasses[color]}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {trend && (
            <p className="text-sm mt-1 font-medium">↑ {trend}</p>
          )}
        </div>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
    </div>
  );
}

// Alert Card Component
interface AlertCardProps {
  alertVal: EditWarAlert;
}

function AlertCard({ alertVal }: AlertCardProps) {
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

  const timeAgo = getTimeAgo(alertVal.detectedAt);

  return (
    <div
      className={`border-l-4 rounded-lg p-6 ${
        severityColors[alertVal.severityLevel]
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">
            {severityEmojis[alertVal.severityLevel]}
          </span>
          <div>
            <h3 className="text-xl font-bold">
              {alertVal.severityLevel}: {alertVal.pageTitle}
            </h3>
            <p className="text-sm text-gray-600">{timeAgo}</p>
          </div>
        </div>
      </div>

      {/* User Bars */}
      <div className="mb-4 space-y-2">
        {alertVal.involvedUsers.map(
          (
            user: any,
            idx: any
          ) => {
            const editCount = Math.floor(
              alertVal.totalEdits / alertVal.userCount
            );
            const barWidth = (editCount / alertVal.totalEdits) * 100;

            return (
              <div key={`${user}-${idx}`} className="flex items-center gap-3">
                <span className="w-20 text-sm font-medium">{user}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-6">
                  <div
                    className="bg-blue-600 h-6 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${barWidth}%` }}
                  >
                    <span className="text-white text-xs font-bold">
                      {editCount}
                    </span>
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm text-gray-700 mb-3">
        <span>{alertVal.totalEdits} edits</span>
        <span>•</span>
        <span>{Math.round(alertVal.conflictRatio * 100)}% conflict</span>
        <span>•</span>
        <span className="font-medium">{alertVal.status}</span>
      </div>

      {/* Action */}
      <button
        onClick={() =>
          alert(
            `Would show details for:\n\n${
              alertVal.pageTitle
            }\n\nUsers: ${alertVal.involvedUsers.join(" vs ")}\nEdits: ${
              alertVal.totalEdits
            }\nConflict: ${Math.round(alertVal.conflictRatio * 100)}%`
          )
        }
        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
      >
        View Full Battle →
      </button>
    </div>
  );
}

// Helper function
function getTimeAgo(timestamp: string): string {
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
  
  if (seconds < 60) return `${seconds} seconds ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}