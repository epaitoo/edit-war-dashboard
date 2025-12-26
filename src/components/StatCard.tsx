// Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  icon?: string;
  color: 'blue' | 'gray' | 'red';
}

export function StatCard({ title, value, trend, icon, color }: StatCardProps) {
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
