import React from 'react';
import { formatMYR } from '../utils/currency';

export default function BudgetChart() {
  const departments = [
    { name: 'IT', budget: 50000, spent: 34000, color: 'bg-blue-500' },
    { name: 'Marketing', budget: 30000, spent: 18000, color: 'bg-green-500' },
    { name: 'Operations', budget: 40000, spent: 28000, color: 'bg-purple-500' },
    { name: 'HR', budget: 20000, spent: 12000, color: 'bg-yellow-500' },
    { name: 'Finance', budget: 15000, spent: 8000, color: 'bg-red-500' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Budget Utilization by Department</h3>
        <select className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option>This Quarter</option>
          <option>This Month</option>
          <option>This Year</option>
        </select>
      </div>
      
      <div className="space-y-4">
        {departments.map((dept) => {
          const percentage = (dept.spent / dept.budget) * 100;
          return (
            <div key={dept.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">{dept.name}</span>
                <span className="text-sm text-gray-500">
                  {formatMYR(dept.spent)} / {formatMYR(dept.budget)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${dept.color} transition-all duration-300`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{percentage.toFixed(1)}% utilized</span>
                <span className="text-xs text-gray-500">
                  {formatMYR(dept.budget - dept.spent)} remaining
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}