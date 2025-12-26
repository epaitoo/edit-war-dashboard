import type { EditWarAlert } from '../api/client';
import type { CSSProperties } from 'react';

interface NotificationBannerProps {
  newAlerts: EditWarAlert[];
  onView: () => void;
  onDismiss: () => void;
}

export function NotificationBanner({ newAlerts, onView, onDismiss }: NotificationBannerProps) {
  if (newAlerts.length === 0) return null;

  const animationStyle: CSSProperties = {
    animation: 'slideDown 0.3s ease-out',
  };

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from {
            transform: translate(-50%, -100%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
      `}</style>
      
      <div 
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
        style={animationStyle}
      >
        <div className="bg-blue-600 text-white rounded-lg shadow-lg px-6 py-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">↑</span>
            <div>
              <p className="font-bold">
                {newAlerts.length} new edit war{newAlerts.length > 1 ? 's' : ''} detected
              </p>
              {newAlerts.length === 1 && (
                <p className="text-sm opacity-90">{newAlerts[0].pageTitle}</p>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={onView}
              className="bg-white text-blue-600 px-4 py-2 rounded font-medium hover:bg-blue-50 transition"
            >
              View Now
            </button>
            <button
              onClick={onDismiss}
              className="text-white hover:text-blue-100 transition"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </>
  );
}