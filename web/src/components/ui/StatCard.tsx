import React from 'react';

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  children?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, change, changeType, children }) => {
  const changeColor = changeType === 'positive' ? 'text-green-500' : changeType === 'negative' ? 'text-red-500' : 'text-slate-400';

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
          {change && <span className={`text-[10px] font-bold ${changeColor}`}>{change}</span>}
        </div>
        <div className="text-xl font-bold text-slate-900">{value}</div>
      </div>
      <div className="mt-4">
        {children}
      </div>
    </div>
  );
};

export default StatCard;
