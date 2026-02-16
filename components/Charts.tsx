
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

const BAR_DATA = [
  { name: 'Jan', income: 4000, expense: 2400 },
  { name: 'Feb', income: 3000, expense: 1398 },
  { name: 'Mar', income: 2000, expense: 9800 },
  { name: 'Apr', income: 2780, expense: 3908 },
  { name: 'May', income: 1890, expense: 4800 },
  { name: 'Jun', income: 2390, expense: 3800 },
];

const PIE_DATA = [
  { name: 'Shopping', value: 45, color: '#1919e6' },
  { name: 'Food & Drink', value: 30, color: '#10b981' },
  { name: 'Bills', value: 15, color: '#f97316' },
  { name: 'Other', value: 10, color: '#94a3b8' },
];

export const IncomeExpensesChart = () => (
  <div className="h-64 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={BAR_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 10, fill: '#94a3b8' }} 
        />
        <YAxis hide />
        <Tooltip 
          cursor={{ fill: '#f8fafc' }}
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
        />
        <Bar dataKey="income" fill="#1919e6" radius={[4, 4, 0, 0]} barSize={10} />
        <Bar dataKey="expense" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={10} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export const CategoryPieChart = () => (
  <div className="h-48 w-full flex flex-col items-center justify-center relative">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={PIE_DATA}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={70}
          paddingAngle={5}
          dataKey="value"
        >
          {PIE_DATA.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <span className="text-[10px] text-slate-400 font-semibold">Total</span>
      <span className="text-lg font-bold text-slate-800">$3.1k</span>
    </div>
  </div>
);
