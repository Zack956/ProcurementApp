import React, { useState } from 'react';
import { BarChart3, TrendingUp, Download, Calendar, Filter } from 'lucide-react';
import { formatMYR } from '../utils/currency';

export default function Reports() {
  const [dateRange, setDateRange] = useState('last-30-days');
  const [reportType, setReportType] = useState('spending');

  const spendingData = [
    { month: 'Jan', amount: 12500, budget: 15000 },
    { month: 'Feb', amount: 13200, budget: 15000 },
    { month: 'Mar', amount: 11800, budget: 15000 },
    { month: 'Apr', amount: 14500, budget: 15000 },
    { month: 'May', amount: 13900, budget: 15000 },
    { month: 'Jun', amount: 15200, budget: 15000 },
  ];

  const topCategories = [
    { category: 'IT Equipment', amount: 45230, percentage: 35 },
    { category: 'Office Supplies', amount: 18400, percentage: 14 },
    { category: 'Furniture', amount: 15600, percentage: 12 },
    { category: 'Software', amount: 12800, percentage: 10 },
    { category: 'Maintenance', amount: 9200, percentage: 7 },
  ];

  const departmentSpending = [
    { department: 'IT', current: 34000, budget: 50000, variance: -16000 },
    { department: 'Marketing', current: 18000, budget: 30000, variance: -12000 },
    { department: 'Operations', current: 28000, budget: 40000, variance: -12000 },
    { department: 'HR', current: 12000, budget: 20000, variance: -8000 },
    { department: 'Finance', current: 8000, budget: 15000, variance: -7000 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Analyze spending patterns and procurement performance
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </button>
          <Link 
            to="/reports/custom"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Custom Report
          </Link>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="spending">Spending Analysis</option>
              <option value="performance">Vendor Performance</option>
              <option value="compliance">Compliance Report</option>
              <option value="budget">Budget Variance</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="last-30-days">Last 30 Days</option>
              <option value="last-90-days">Last 90 Days</option>
              <option value="this-quarter">This Quarter</option>
              <option value="this-year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          <div className="flex items-end space-x-2">
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spending</p>
              <p className="text-2xl font-bold text-gray-900">{formatMYR(129450)}</p>
              <p className="text-sm text-green-600">+8.2% vs last period</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatMYR(1847)}</p>
              <p className="text-sm text-green-600">+5.1% vs last period</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-bold text-lg">RM</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approval Time</p>
              <p className="text-2xl font-bold text-gray-900">2.3 days</p>
              <p className="text-sm text-red-600">+0.5 days vs last period</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Budget Utilization</p>
              <p className="text-2xl font-bold text-gray-900">68%</p>
              <p className="text-sm text-blue-600">On track for quarter</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Trend */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Spending Trend</h3>
          <div className="space-y-4">
            {spendingData.map((data, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">{data.month}</span>
                  <span className="text-sm text-gray-500">
                    {formatMYR(data.amount)} / {formatMYR(data.budget)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(data.amount / data.budget) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Spending Categories</h3>
          <div className="space-y-4">
            {topCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-900">{category.category}</span>
                    <span className="text-sm text-gray-500">{formatMYR(category.amount)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Budget Variance */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Department Budget Variance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Department</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Current Spending</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Budget</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Variance</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Utilization</th>
              </tr>
            </thead>
            <tbody>
              {departmentSpending.map((dept, index) => {
                const utilization = (dept.current / dept.budget) * 100;
                return (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">{dept.department}</td>
                    <td className="py-3 px-4 text-right">{formatMYR(dept.current)}</td>
                    <td className="py-3 px-4 text-right">{formatMYR(dept.budget)}</td>
                    <td className="py-3 px-4 text-right text-green-600">
                      {formatMYR(Math.abs(dept.variance))} under
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${Math.min(utilization, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{utilization.toFixed(0)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}