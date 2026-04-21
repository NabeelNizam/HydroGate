'use client';

import { AlertCircle, CheckCircle2, Info, Wrench } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';

interface Activity {
  id: string;
  type: 'alert' | 'success' | 'info' | 'maintenance';
  title: string;
  description: string;
  timestamp: Date;
  user?: string;
}

const createActivities = (): Activity[] => [
  {
    id: '1',
    type: 'alert',
    title: 'Water Level Critical - Auto Gate Open',
    description: 'Water level exceeded 75m threshold - Main gate automatically opened to 85% capacity',
    timestamp: new Date(Date.now() - 5 * 60000),
    user: 'System (Auto)',
  },
  {
    id: '2',
    type: 'alert',
    title: 'High Water Level Detected',
    description: 'Current water level: 78m (Critical threshold: 75m)',
    timestamp: new Date(Date.now() - 15 * 60000),
    user: 'Water Level Sensor',
  },
  {
    id: '3',
    type: 'success',
    title: 'Gate Auto-Closed Successfully',
    description: 'Water level dropped to 68m - Main gate automatically closed to prevent overflow',
    timestamp: new Date(Date.now() - 1.5 * 3600000),
    user: 'System (Auto)',
  },
  {
    id: '4',
    type: 'info',
    title: 'Auto-Control Mode Enabled',
    description: 'Main gate switched to automatic control mode',
    timestamp: new Date(Date.now() - 2 * 3600000),
    user: 'System',
  },
  {
    id: '5',
    type: 'success',
    title: 'System Initialization Complete',
    description: 'HydroGate monitoring system initialized with auto-control enabled',
    timestamp: new Date(Date.now() - 4 * 3600000),
    user: 'System',
  },
  {
    id: '6',
    type: 'info',
    title: 'Sensor Calibration Done',
    description: 'Gate C closed to prevent overflow',
    timestamp: new Date(Date.now() - 6 * 3600000),
    user: 'Sarah Johnson',
  },
];

export default function ActivityLog() {
  const [isClient, setIsClient] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    setIsClient(true);
    setActivities(createActivities());
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="text-red-500" size={20} />;
      case 'success':
        return <CheckCircle2 className="text-green-500" size={20} />;
      case 'maintenance':
        return <Wrench className="text-orange-500" size={20} />;
      case 'info':
        return <Info className="text-blue-500" size={20} />;
      default:
        return null;
    }
  };

  const getActivityBgColor = (type: string) => {
    switch (type) {
      case 'alert':
        return 'bg-red-50 border-l-4 border-red-500';
      case 'success':
        return 'bg-green-50 border-l-4 border-green-500';
      case 'maintenance':
        return 'bg-orange-50 border-l-4 border-orange-500';
      case 'info':
        return 'bg-blue-50 border-l-4 border-blue-500';
      default:
        return '';
    }
  };

  const formatTime = (timestamp: Date) => {
    if (!isClient) return 'recently';
    return formatDistanceToNow(timestamp, { addSuffix: true });
  };
  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
          <p className="text-sm text-slate-500 mt-1">Latest system events and operations</p>
        </div>
        <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 px-3 py-2 hover:bg-blue-50 rounded-lg transition-all duration-200">
          View All
        </button>
      </div>

      {/* Activity List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities.map((activity) => (
          <div key={activity.id} className={`rounded-lg p-4 ${getActivityBgColor(activity.type)} transition-all duration-200 hover:shadow-sm`}>
            <div className="flex gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 pt-1">
                {getActivityIcon(activity.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{activity.title}</p>
                    <p className="text-xs text-slate-600 mt-1">{activity.description}</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 flex-shrink-0 ml-2">
                    {formatTime(activity.timestamp)}
                  </span>
                </div>

                {/* User Info */}
                {activity.user && (
                  <p className="text-xs text-slate-500 mt-2">
                    <span className="font-semibold">By:</span> {activity.user}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-slate-200">
        <button className="w-full py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
          → View Complete Activity Log
        </button>
      </div>
    </div>
  );
}
