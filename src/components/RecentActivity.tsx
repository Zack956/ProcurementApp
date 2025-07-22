import React from 'react';
import { Clock, User, FileText, CheckCircle } from 'lucide-react';

export default function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: 'approval',
      user: 'John Manager',
      action: 'approved requisition',
      target: 'REQ-2024-001',
      time: '2 hours ago',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'creation',
      user: 'Jane Smith',
      action: 'created new requisition',
      target: 'REQ-2024-005',
      time: '4 hours ago',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      id: 3,
      type: 'update',
      user: 'Mike Johnson',
      action: 'updated vendor information',
      target: 'Acme Corp',
      time: '6 hours ago',
      icon: User,
      color: 'text-purple-600'
    },
    {
      id: 4,
      type: 'approval',
      user: 'Sarah Wilson',
      action: 'submitted for approval',
      target: 'REQ-2024-004',
      time: '8 hours ago',
      icon: Clock,
      color: 'text-yellow-600'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center ${activity.color}`}>
              <activity.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900">
                <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                <span className="font-medium">{activity.target}</span>
              </p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          View all activity
        </button>
      </div>
    </div>
  );
}