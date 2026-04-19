'use client';

import { ReactNode } from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface StatusCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: ReactNode;
  status: 'normal' | 'warning' | 'critical';
  trend?: 'up' | 'down';
  trendValue?: string;
}

export default function StatusCard({
  title,
  value,
  unit,
  icon,
  status,
  trend,
  trendValue,
}: StatusCardProps) {
  const statusColors = {
    normal: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    critical: 'bg-red-50 border-red-200',
  };

  const statusIndicators = {
    normal: 'bg-green-500',
    warning: 'bg-yellow-500',
    critical: 'bg-red-500',
  };

  const textColors = {
    normal: 'text-green-700',
    warning: 'text-yellow-700',
    critical: 'text-red-700',
  };

  return (
    <div
      className={`rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg ${statusColors[status]}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
        <div className={`w-12 h-12 rounded-lg bg-white flex items-center justify-center text-xl`}>
          {icon}
        </div>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-3 h-3 rounded-full ${statusIndicators[status]} animate-pulse`}></div>
        <span className={`text-xs font-semibold ${textColors[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-3xl font-bold text-slate-900">{value}</span>
        {unit && <span className="text-sm font-medium text-slate-600">{unit}</span>}
      </div>

      {/* Trend */}
      {trend && (
        <div className="flex items-center gap-1">
          {trend === 'up' ? (
            <ArrowUpRight size={16} className="text-red-500" />
          ) : (
            <ArrowDownLeft size={16} className="text-green-500" />
          )}
          <span className={`text-xs font-medium ${trend === 'up' ? 'text-red-600' : 'text-green-600'}`}>
            {trendValue}
          </span>
        </div>
      )}
    </div>
  );
}
