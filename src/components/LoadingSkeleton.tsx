// Add this component at the bottom of Dashboard.tsx
export function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="h-12 bg-gray-200 rounded w-1/2 mb-8 animate-pulse" />
      
      <div className="grid grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4 animate-pulse" />
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="h-48 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}