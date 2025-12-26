export function TimelineItem({ 
  timestamp, 
  label, 
  color 
}: { 
  timestamp: string; 
  label: string; 
  color: 'green' | 'red' | 'orange';
}) {
  const colors = {
    green: 'bg-green-500',
    red: 'bg-red-500',
    orange: 'bg-orange-500'
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`w-4 h-4 rounded-full ${colors[color]}`} />
      <div>
        <div className="font-semibold">{label}</div>
        <div className="text-sm text-gray-600">{timestamp}</div>
      </div>
    </div>
  );
}