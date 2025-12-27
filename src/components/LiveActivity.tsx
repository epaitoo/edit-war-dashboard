import type { RecentEdit } from '../hooks/useSSE';

interface LiveActivityProps {
  recentEdits: RecentEdit[];
  editCount: number;
  isConnected: boolean;
}

export function LiveActivity({ recentEdits, editCount, isConnected }: LiveActivityProps) {
  if (!isConnected) {
    return null; // Don't show if disconnected
  }

  if (recentEdits.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <h3 className="text-lg font-semibold">🟢 Live Monitoring Active</h3>
        </div>
        <p className="text-gray-600 text-sm">
          Waiting for Wikipedia activity...
        </p>
      </div>
    );
  }

  // Calculate edits per minute
 //const editsPerMin = editCount > 0 ? Math.round(editCount / ((Date.now() - (recentEdits[recentEdits.length - 1]?.timestamp || Date.now())) / 60000)) || editCount : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Header with Stats */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <h3 className="text-lg font-semibold">Live Monitoring</h3>
        </div>
        <div className="flex gap-4 text-sm">
          <span className="text-gray-600">
            ⚡ <strong>{editCount}</strong> edits processed
          </span>
          <span className="text-gray-600">
            🔍 <strong>0</strong> wars detected
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 mb-4"></div>

      {/* Recent Activity Label */}
      <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Activity:</h4>

      {/* Recent Edits List */}
      <div className="space-y-2">
        {recentEdits.map((edit, idx) => (
          <div 
            key={`${edit.pageTitle}-${edit.timestamp}`}
            className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition"
            style={{ 
              animation: idx === 0 ? 'slide-in 0.3s ease-out' : undefined 
            }}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-lg">📝</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate text-sm">
                  {edit.pageTitle}
                </p>
                <p className="text-xs text-gray-500">
                  by {edit.user}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 ml-4">
              <span className={`text-sm font-medium px-2 py-1 rounded ${
                edit.lengthChange > 0 
                  ? 'bg-green-100 text-green-700' 
                  : edit.lengthChange < 0
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {edit.lengthChange > 0 ? '+' : ''}{edit.lengthChange} bytes
              </span>
              <span className="text-xs text-gray-400 w-16 text-right">
                {getTimeAgo(edit.timestamp)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <span>💡</span>
          <span>Showing last {recentEdits.length} edits (not wars). The system is actively monitoring for conflicts.</span>
        </p>
      </div>
    </div>
  );
}

function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 10) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 120) return '1m ago';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}