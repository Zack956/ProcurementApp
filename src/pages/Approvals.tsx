import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, User, DollarSign, Calendar, MessageSquare } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { formatMYR } from '../utils/currency';

export default function Approvals() {
  const [selectedTab, setSelectedTab] = useState('pending');

  const approvals = [
    {
      id: 'REQ-2024-001',
      title: 'Office Supplies Q1',
      requestor: 'John Doe',
      department: 'Administration',
      amount: 1250.00,
      submittedDate: '2024-01-15',
      priority: 'normal',
      status: 'pending',
      description: 'Quarterly office supplies including paper, pens, folders, and other stationery items.',
      items: 12,
      approver: 'Current: Department Manager',
      daysWaiting: 2
    },
    {
      id: 'REQ-2024-002',
      title: 'IT Equipment Upgrade',
      requestor: 'Jane Smith',
      department: 'IT',
      amount: 5890.00,
      submittedDate: '2024-01-14',
      priority: 'high',
      status: 'approved',
      description: 'New laptops and monitors for development team to improve productivity.',
      items: 8,
      approver: 'Approved by: IT Director',
      daysWaiting: 0
    },
    {
      id: 'REQ-2024-003',
      title: 'Marketing Materials',
      requestor: 'Mike Johnson',
      department: 'Marketing',
      amount: 750.00,
      submittedDate: '2024-01-13',
      priority: 'low',
      status: 'rejected',
      description: 'Promotional materials for upcoming product launch campaign.',
      items: 5,
      approver: 'Rejected by: Finance Manager',
      daysWaiting: 0
    }
  ];

  const filteredApprovals = approvals.filter(approval => {
    if (selectedTab === 'pending') return approval.status === 'pending';
    if (selectedTab === 'approved') return approval.status === 'approved';
    if (selectedTab === 'rejected') return approval.status === 'rejected';
    return true;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'normal': return 'bg-blue-100 text-blue-700';
      case 'low': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Approvals</h1>
          <p className="mt-1 text-sm text-gray-500">
            Review and approve purchase requisitions
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-yellow-600">23</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved Today</p>
              <p className="text-2xl font-bold text-green-600">8</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected Today</p>
              <p className="text-2xl font-bold text-red-600">2</p>
            </div>
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Processing Time</p>
              <p className="text-2xl font-bold text-gray-900">2.3 days</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'pending', label: 'Pending', count: 23 },
              { key: 'approved', label: 'Approved', count: 156 },
              { key: 'rejected', label: 'Rejected', count: 12 },
              { key: 'all', label: 'All', count: 191 }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  selectedTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        {/* Approval Items */}
        <div className="p-6 space-y-4">
          {filteredApprovals.map((approval) => (
            <div key={approval.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{approval.id}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getPriorityColor(approval.priority)}`}>
                      {approval.priority}
                    </span>
                    <StatusBadge status={approval.status} />
                  </div>
                  <h4 className="text-base font-medium text-gray-800 mb-2">{approval.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{approval.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{formatMYR(approval.amount)}</p>
                  <p className="text-sm text-gray-500">{approval.items} items</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-4 h-4 mr-2 text-gray-400" />
                  <div>
                    <p className="font-medium">{approval.requestor}</p>
                    <p>{approval.department}</p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  <div>
                    <p>Submitted: {approval.submittedDate}</p>
                    {approval.daysWaiting > 0 && (
                      <p className="text-yellow-600">Waiting {approval.daysWaiting} days</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 mr-2 text-gray-400" />
                  <p>{approval.approver}</p>
                </div>
              </div>

              {approval.status === 'pending' && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Add Comment
                    </button>
                    <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                      View Details
                    </button>
                  </div>
                  <div className="flex space-x-3">
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200">
                      Reject
                    </button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                      Approve
                    </button>
                  </div>
                </div>
              )}

              {approval.status !== 'pending' && (
                <div className="pt-4 border-t border-gray-200">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                    View Details
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}