import React, { useState } from 'react';
import { ArrowLeft, Download, BarChart3, Calendar, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { exportCustomReportToPDF } from '../utils/pdfExport';
import { formatMYR } from '../utils/currency';

export default function CustomReport() {
  const [reportConfig, setReportConfig] = useState({
    title: '',
    reportType: 'spending',
    dateRange: 'last-30-days',
    startDate: '',
    endDate: '',
    department: 'all',
    category: 'all',
    status: 'all',
    groupBy: 'department',
    includeCharts: true,
    includeDetails: true
  });

  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock report data based on configuration
      const mockData = {
        title: reportConfig.title || 'Custom Report',
        dateRange: reportConfig.dateRange,
        department: reportConfig.department,
        summary: {
          totalAmount: 125430,
          totalItems: 234,
          averageAmount: 536,
          topCategory: 'IT Equipment'
        },
        data: [
          ['IT Department', formatMYR(45230), 'Active'],
          ['Marketing', formatMYR(18400), 'Active'],
          ['Operations', formatMYR(28000), 'Active'],
          ['HR', formatMYR(12000), 'Active'],
          ['Finance', formatMYR(8000), 'Active']
        ],
        headers: ['Department', 'Amount', 'Status'],
        chartData: [
          { name: 'IT', value: 45230 },
          { name: 'Marketing', value: 18400 },
          { name: 'Operations', value: 28000 },
          { name: 'HR', value: 12000 },
          { name: 'Finance', value: 8000 }
        ]
      };
      
      setReportData(mockData);
    } catch (error) {
      alert('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    if (reportData) {
      exportCustomReportToPDF(reportData);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link
            to="/reports"
            className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Custom Report Builder</h1>
            <p className="mt-1 text-sm text-gray-500">
              Create customized reports with specific filters and parameters
            </p>
          </div>
        </div>
        {reportData && (
          <button
            onClick={exportToPDF}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Configuration */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Report Configuration</h3>
            
            {/* Basic Settings */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Title
              </label>
              <input
                type="text"
                value={reportConfig.title}
                onChange={(e) => setReportConfig({ ...reportConfig, title: e.target.value })}
                placeholder="Enter report title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type
              </label>
              <select
                value={reportConfig.reportType}
                onChange={(e) => setReportConfig({ ...reportConfig, reportType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="spending">Spending Analysis</option>
                <option value="requisitions">Requisitions Report</option>
                <option value="vendors">Vendor Performance</option>
                <option value="inventory">Inventory Report</option>
                <option value="budget">Budget Analysis</option>
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <select
                value={reportConfig.dateRange}
                onChange={(e) => setReportConfig({ ...reportConfig, dateRange: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="last-7-days">Last 7 Days</option>
                <option value="last-30-days">Last 30 Days</option>
                <option value="last-90-days">Last 90 Days</option>
                <option value="this-quarter">This Quarter</option>
                <option value="this-year">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {reportConfig.dateRange === 'custom' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={reportConfig.startDate}
                    onChange={(e) => setReportConfig({ ...reportConfig, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={reportConfig.endDate}
                    onChange={(e) => setReportConfig({ ...reportConfig, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                value={reportConfig.department}
                onChange={(e) => setReportConfig({ ...reportConfig, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Departments</option>
                <option value="IT">IT</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={reportConfig.category}
                onChange={(e) => setReportConfig({ ...reportConfig, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="office-supplies">Office Supplies</option>
                <option value="it-equipment">IT Equipment</option>
                <option value="furniture">Furniture</option>
                <option value="services">Services</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={reportConfig.status}
                onChange={(e) => setReportConfig({ ...reportConfig, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Grouping */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group By
              </label>
              <select
                value={reportConfig.groupBy}
                onChange={(e) => setReportConfig({ ...reportConfig, groupBy: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="department">Department</option>
                <option value="category">Category</option>
                <option value="vendor">Vendor</option>
                <option value="month">Month</option>
                <option value="status">Status</option>
              </select>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={reportConfig.includeCharts}
                  onChange={(e) => setReportConfig({ ...reportConfig, includeCharts: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">Include Charts</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={reportConfig.includeDetails}
                  onChange={(e) => setReportConfig({ ...reportConfig, includeDetails: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">Include Detailed Data</span>
              </label>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateReport}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <BarChart3 className="w-5 h-5 mr-2" />
              )}
              Generate Report
            </button>
          </div>
        </div>

        {/* Report Preview */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Generating Report...</h3>
              <p className="text-gray-500">Please wait while we compile your custom report</p>
            </div>
          ) : reportData ? (
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              {/* Report Header */}
              <div className="border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-900">{reportData.title}</h2>
                <div className="mt-2 text-sm text-gray-500 space-x-4">
                  <span>Generated: {new Date().toLocaleDateString()}</span>
                  <span>Date Range: {reportData.dateRange}</span>
                  <span>Department: {reportData.department}</span>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Total Amount</p>
                  <p className="text-2xl font-bold text-blue-900">{formatMYR(reportData.summary.totalAmount)}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Total Items</p>
                  <p className="text-2xl font-bold text-green-900">{reportData.summary.totalItems}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600 font-medium">Average Amount</p>
                  <p className="text-2xl font-bold text-purple-900">{formatMYR(reportData.summary.averageAmount)}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-orange-600 font-medium">Top Category</p>
                  <p className="text-lg font-bold text-orange-900">{reportData.summary.topCategory}</p>
                </div>
              </div>

              {/* Chart Placeholder */}
              {reportConfig.includeCharts && (
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Chart visualization would appear here</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Showing {reportConfig.groupBy} breakdown
                  </p>
                </div>
              )}

              {/* Data Table */}
              {reportConfig.includeDetails && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Data</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {reportData.headers.map((header: string, index: number) => (
                            <th
                              key={index}
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {reportData.data.map((row: any[], index: number) => (
                          <tr key={index} className="hover:bg-gray-50">
                            {row.map((cell: any, cellIndex: number) => (
                              <td
                                key={cellIndex}
                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Report Generated</h3>
              <p className="text-gray-500">
                Configure your report settings and click "Generate Report" to see the results
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}