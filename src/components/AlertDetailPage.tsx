import { Link, useParams } from "react-router-dom";
import { useSearchAlerts } from "../hooks/useAlerts";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { MetricCard } from "./MetricCard";
import { TimelineItem } from "./TimelineItem";

export function AlertDetailPage() {
    const { id } = useParams<{ id: string }>();
  
    // search by page title 
    const { data: alerts, isLoading, error } = useSearchAlerts(id || '');
    
    const alert = alerts?.[0]; // Get first match

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (error || !alert) {
        return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <Link to="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
                    ← Back to Dashboard
                </Link>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-4">
                    <h2 className="text-xl font-bold text-red-800">Alert Not Found</h2>
                    <p className="text-red-700 mt-2">
                        Could not find edit war for: {id}
                    </p>
                </div>  
            </div>
        </div>
        );
    }

    const getSeverityLevel = (score: number): string => {
        if (score >= 0.8) return 'CRITICAL';
        if (score >= 0.6) return 'HIGH';
        if (score >= 0.4) return 'MEDIUM';
        return 'LOW';
    };

    const severityLevel = getSeverityLevel(alert.severityScore);

    const severityColors = {
        CRITICAL: 'bg-red-100 border-red-500 text-red-900',
        HIGH: 'bg-orange-100 border-orange-500 text-orange-900',
        MEDIUM: 'bg-yellow-100 border-yellow-500 text-yellow-900',
        LOW: 'bg-blue-100 border-blue-500 text-blue-900'
    };

    const severityEmojis = {
        CRITICAL: '🚨',
        HIGH: '⚠️',
        MEDIUM: '⚡',
        LOW: 'ℹ️'
    };

    return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link to="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to Dashboard
        </Link>

        {/* Header */}
        <div className={`border-l-4 rounded-lg p-6 mb-6 ${severityColors[severityLevel as keyof typeof severityColors]}`}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{severityEmojis[severityLevel as keyof typeof severityEmojis]}</span>
            <h1 className="text-3xl font-bold">{alert.pageTitle}</h1>
          </div>
          <div className="flex gap-4 text-sm mt-2">
            <span className="font-semibold">Status: {alert.status}</span>
            <span>•</span>
            <span>Severity: {severityLevel}</span>
            <span>•</span>
            <span>{alert.wiki}</span>
          </div>
        </div>

        {/* Combatants Section */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            ⚔️ Combatants
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {alert.involvedUsers.map((user) => {
              const editCount = Math.floor(alert.totalEdits / alert.userCount);
              
              return (
                <div key={user} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="font-bold text-lg mb-2">{user}</div>
                  <div className="text-sm text-gray-600">
                    ~{editCount} edits
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(editCount / alert.totalEdits) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Metrics Section */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            📊 Metrics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="Total Edits" value={alert.totalEdits} />
            <MetricCard label="Conflict Edits" value={alert.conflictEdits} />
            <MetricCard 
              label="Conflict Ratio" 
              value={`${Math.round(alert.conflictRatio * 100)}%`} 
            />
            <MetricCard label="Users Involved" value={alert.userCount} />
          </div>
        </section>

        {/* Timeline Section */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            ⏱️ Timeline
          </h2>
          <div className="space-y-3">
            <TimelineItem 
              timestamp={new Date(alert.firstEditTimestamp * 1000).toLocaleString()}
              label="First Edit"
              color="green"
            />
            <div className="border-l-2 border-dashed border-gray-300 ml-2 h-8" />
            <TimelineItem 
              timestamp={new Date(alert.lastEditTimestamp * 1000).toLocaleString()}
              label="Latest Edit"
              color="red"
            />
            <div className="border-l-2 border-dashed border-gray-300 ml-2 h-8" />
            <TimelineItem 
              timestamp={new Date(alert.detectedAt).toLocaleString()}
              label="War Detected"
              color="orange"
            />
          </div>
        </section>

        {/* Actions */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">External Links</h2>
          <a
            href={`https://${alert.wiki}/wiki/${alert.pageTitle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            View on Wikipedia →
          </a>
        </section>
      </div>
    </div>
  );


}