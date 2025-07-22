import React from 'react';
import { Clock, User, DollarSign } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatMYR } from '../utils/currency';

export default function ApprovalQueue() {
  const pendingApprovals = [
    {
      id: 'REQ-2024-001',
      title: 'Office Supplies Q1',
      requestor: 'John Doe',
      amount: 1250.00,
      priority: 'normal',
      daysWaiting: 2
    },
    {
      id: 'REQ-2024-003',
      title: 'Marketing Materials',
      requestor: 'Mike Johnson',
      amount: 750.00,
      priority: 'low',
      daysWaiting: 1
    },
    {
      id: 'REQ-2024-004',
      title: 'Safety Equipment',
      requestor: 'Sarah Wilson',
      amount: 2100.00,
      priority: 'urgent',
      daysWaiting: 5
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'normal': return 'text-blue-600';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Pending Approvals</h3>
        <span className="text-sm text-gray-500">{pendingApprovals.length} items</span>
      </div>
      
      <div className="space-y-4">
        {pendingApprovals.map((approval) => (
          <div key={approval.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium text-gray-900">{approval.id}</h4>
                <p className="text-sm text-gray-600">{approval.title}</p>
              </div>
              <span className={`text-xs font-medium capitalize px-2 py-1 rounded ${getPriorityColor(approval.priority)}`}>
                {approval.priority}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {approval.requestor}
              </div>
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                {formatMYR(approval.amount)}
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                Waiting {approval.daysWaiting} days
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors duration-200">
                  Approve
                </button>
                <button className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors duration-200">
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          View all approvals
        </button>
      </div>
    </div>
  );
}