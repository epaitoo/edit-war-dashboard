import { useState } from "react";
import { useAlerts } from "../hooks/useAlerts";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { Link } from "react-router-dom";
import { AlertListItem } from "./AlertListItem";

export function AlertsListPage() {
    const [page, setPage] = useState(0);
    const [status, setStatus] = useState<string>('');
    const [severity, setSeverity] = useState<string>('');

    const { data: alertsPage, isLoading } = useAlerts({ 
        page, 
        size: 20,
        status: status || undefined,
        severity: severity || undefined
    });

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    return (
        <div className="animate-fade-in">
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <Link to="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
                            ← Back to Dashboard
                        </Link>
                        <h1 className="text-4xl font-bold text-gray-900 mt-4">
                            Edit War History
                        </h1>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="flex gap-4 flex-wrap">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="border border-gray-300 rounded px-3 py-2"
                            >
                                <option value="">All</option>
                                <option value="ACTIVE">Active</option>
                                <option value="RESOLVED">Resolved</option>
                                <option value="ESCALATING">Escalating</option>
                                <option value="COOLING_DOWN">Cooling Down</option>
                            </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Severity
                                </label>
                                <select
                                    value={severity}
                                    onChange={(e) => setSeverity(e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2"
                                >
                                    <option value="">All</option>
                                    <option value="CRITICAL">Critical</option>
                                    <option value="HIGH">High</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="LOW">Low</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold">
                                Results: {alertsPage?.totalElements || 0} edit wars
                            </h2>
                        </div>

                        {alertsPage?.content && alertsPage.content.length > 0 ? (
                            <div className="space-y-4">
                                {alertsPage.content.map((alert, idx) => (
                                    <AlertListItem key={idx} alert={alert} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                No edit wars found
                            </div>
                        )}

                        {/* Pagination */}
                        {alertsPage && alertsPage.totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-6">
                                <button
                                    onClick={() => setPage(Math.max(0, page - 1))}
                                    disabled={page === 0}
                                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
                                >
                                    ← Previous
                                </button>
                                <span className="text-gray-700">
                                    Page {page + 1} of {alertsPage.totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(Math.min(alertsPage.totalPages - 1, page + 1))}
                                    disabled={page >= alertsPage.totalPages - 1}
                                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

    );

}