import React from 'react';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  DollarSign,
  Package,
  Users,
  FileText
} from 'lucide-react';
import StatsCard from '../components/StatsCard';
import RecentActivity from '../components/RecentActivity';
import BudgetChart from '../components/BudgetChart';
import ApprovalQueue from '../components/ApprovalQueue';
import { formatMYR } from '../utils/currency';

export default function Dashboard() {
  const stats = [
    {
      title: 'Total Requisitions',
      value: '1,247',
      change: '+12%',
      trend: 'up',
      icon: FileText,
      color: 'blue'
    },
    {
      title: 'Pending Approvals',
      value: '23',
      change: '-8%',
      trend: 'down',
      icon: Clock,
      color: 'yellow'
    },
    {
      title: 'Active Vendors',
      value: '156',
      change: '+5%',
      trend: 'up',
      icon: Users,
      color: 'green'
    },
    {
      title: 'Budget Utilized',
      value: '68%',
      change: '+3%',
      trend: 'up',
      icon: DollarSign,
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Here's what's happening with your procurement today.
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">
            Export Dashboard
          </button>
          <button 
            onClick={() => {
              const { exportDashboardToPDF } = require('../utils/pdfExport');
              exportDashboardToPDF({
                totalRequisitions: '1,247',
                pendingApprovals: '23',
                activeVendors: '156',
                budgetUtilized: '68%'
              });
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BudgetChart />
        </div>
        <div>
          <ApprovalQueue />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Create New Requisition</p>
                  <p className="text-sm text-gray-500">Start a new purchase request</p>
                </div>
              </div>
            </button>
            <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <Package className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Check Inventory</p>
                  <p className="text-sm text-gray-500">View current stock levels</p>
                </div>
              </div>
            </button>
            <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Manage Vendors</p>
                  <p className="text-sm text-gray-500">Update vendor information</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}