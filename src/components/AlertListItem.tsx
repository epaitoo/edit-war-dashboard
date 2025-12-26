import { Link } from "react-router-dom";

export function AlertListItem({ alert }: { alert: any }) {
  const getSeverityLevel = (score: number): string => {
    if (score >= 0.8) return 'CRITICAL';
    if (score >= 0.6) return 'HIGH';
    if (score >= 0.4) return 'MEDIUM';
    return 'LOW';
  };

  const severityLevel = getSeverityLevel(alert.severityScore);
  const timeAgo = getTimeAgo(alert.detectedAt);

  return (
    <Link
      to={`/alerts/${alert.pageTitle}`}
      className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold">{severityLevel}: {alert.pageTitle}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {alert.involvedUsers.join(' vs ')} • {alert.totalEdits} edits • {alert.status}
          </p>
        </div>
        <div className="text-sm text-gray-500">{timeAgo}</div>
      </div>
    </Link>
  );
}

function getTimeAgo(timestamp: string): string {
  const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
  
  if (seconds < 60) return `${seconds} seconds ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour(s) ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}