export function MetricCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}