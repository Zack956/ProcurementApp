import React from 'react';

interface StatusBadgeProps {
  status: string;
}

const statusClasses = {
  draft: 'bg-gray-100 text-gray-700',
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  processing: 'bg-blue-100 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const classes = statusClasses[status as keyof typeof statusClasses] || statusClasses.draft;
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${classes}`}>
      {status}
    </span>
  );
}