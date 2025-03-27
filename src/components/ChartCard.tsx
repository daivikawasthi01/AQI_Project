import React from 'react';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({ title, children, className = '' }: ChartCardProps) {
  return (
    <div className={`bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-700 ${className}`}>
      <div className="p-6 h-full flex flex-col">
        <h2 className="text-lg font-semibold text-gray-100 mb-4 border-b border-gray-700 pb-2">{title}</h2>
        <div className="flex-1 min-h-0">{children}</div>
      </div>
    </div>
  );
}