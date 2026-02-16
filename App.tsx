
import React, { useState, useEffect } from 'react';
import { StatCard } from './components/StatCard';
import { IncomeExpensesChart, CategoryPieChart } from './components/Charts';
import { Transaction } from './types';
import { getSmartInsights } from './services/geminiService';

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', name: 'Amazon Marketplace', category: 'Electronics', amount: -124.50, date: 'Today, 2:45 PM', type: 'expense', status: 'pending', icon: 'shopping_bag' },
  { id: '2', name: 'Monthly Salary', category: 'Income', amount: 4200.00, date: 'Yesterday, 9:00 AM', type: 'income', status: 'completed', icon: 'payments' },
  { id: '3', name: 'Starbucks Coffee', category: 'Food & Drink', amount: -5.25, date: 'Yesterday, 8:15 AM', type: 'expense', status: 'completed', icon: 'restaurant' },
  { id: '4', name: 'Uber Ride', category: 'Transport', amount: -18.30, date: 'Oct 14, 2023', type: 'expense', status: 'completed', icon: 'directions_car' },
];

const App: React.FC = () => {
  const [insight, setInsight] = useState<string>("Analyzing your spending habits...");
  const [isLoadingInsight, setIsLoadingInsight] = useState(true);

  useEffect(() => {
    const fetchInsight = async () => {
      setIsLoadingInsight(true);
      const text = await getSmartInsights(MOCK_TRANSACTIONS);
      setInsight(text);
      setIsLoadingInsight(false);
    };
    fetchInsight();
  }, []);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar - Hidden on mobile */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-[#1919e6] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <span className="material-icons">account_balance_wallet</span>
          </div>
          <span className="text-xl font-bold tracking-tight">ZenBudget</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <NavItem icon="dashboard" label="Dashboard" active />
          <NavItem icon="trending_up" label="Income" />
          <NavItem icon="trending_down" label="Expenses" />
          <NavItem icon="account_balance" label="Wallets" />
          <NavItem icon="insert_chart_outlined" label="Analytics" />
          <NavItem icon="settings" label="Settings" />
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100 flex items-center gap-3">
          <img src="https://picsum.photos/seed/user1/40/40" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="Profile" />
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate">Alex Johnson</p>
            <p className="text-xs text-slate-400">Premium Plan</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pb-24 lg:pb-8">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-[#f6f6f8]/80 backdrop-blur-md px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="lg:hidden w-10 h-10 bg-[#1919e6] rounded-lg flex items-center justify-center text-white">
            <span className="material-icons">account_balance_wallet</span>
          </div>
          
          <div className="flex-1 max-w-lg mx-4">
            <div className="relative">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
              <input 
                type="text" 
                placeholder="Search transactions..." 
                className="w-full bg-white border-none rounded-full py-2 pl-9 pr-4 text-xs focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          <button className="relative p-2 text-slate-500 bg-white rounded-full shadow-sm hover:bg-slate-50">
            <span className="material-icons text-xl">notifications_none</span>
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </header>

        <div className="px-4 lg:px-8 max-w-6xl mx-auto space-y-6">
          {/* Welcome & Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
              <p className="text-sm text-slate-500">Welcome back, Alex!</p>
            </div>
            <button className="bg-[#1919e6] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all">
              <span className="material-icons text-sm">add</span> New Transaction
            </button>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Balance" value="$45,230.00" change="+2.4%" changeType="positive">
              <div className="flex items-end gap-1 h-6 opacity-20">
                {[40, 60, 80, 50, 70, 100].map((h, i) => (
                  <div key={i} className="flex-1 bg-[#1919e6] rounded-t-sm" style={{ height: `${h}%` }}></div>
                ))}
              </div>
            </StatCard>
            <StatCard label="Income" value="$8,450.00" change="+12%" changeType="positive">
              <div className="flex items-end gap-1 h-6 opacity-20">
                {[30, 50, 70, 80, 60, 90].map((h, i) => (
                  <div key={i} className="flex-1 bg-emerald-500 rounded-t-sm" style={{ height: `${h}%` }}></div>
                ))}
              </div>
            </StatCard>
            <StatCard label="Expenses" value="$3,120.00" change="-8%" changeType="negative">
              <div className="flex items-end gap-1 h-6 opacity-20">
                {[50, 80, 60, 40, 70, 90].map((h, i) => (
                  <div key={i} className="flex-1 bg-red-500 rounded-t-sm" style={{ height: `${h}%` }}></div>
                ))}
              </div>
            </StatCard>
            <StatCard label="Budget Left" value="$5,330.00" change="75%" changeType="neutral">
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-4">
                <div className="bg-[#1919e6] h-full" style={{ width: '75%' }}></div>
              </div>
            </StatCard>
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800">Income vs Expenses</h3>
                <select className="bg-slate-50 border-none rounded-lg text-[10px] font-bold py-1 px-3 outline-none cursor-pointer">
                  <option>Last 6 months</option>
                  <option>Last year</option>
                </select>
              </div>
              <IncomeExpensesChart />
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-6">By Category</h3>
              <CategoryPieChart />
              <div className="mt-6 space-y-3">
                <CategoryLegend color="bg-[#1919e6]" label="Shopping" percent="45%" />
                <CategoryLegend color="bg-emerald-500" label="Food & Drink" percent="30%" />
                <CategoryLegend color="bg-orange-500" label="Bills" percent="15%" />
              </div>
            </div>
          </div>

          {/* Smart AI Insights */}
          <div className="bg-gradient-to-br from-[#1919e6] to-[#4f46e5] p-6 rounded-2xl text-white shadow-xl shadow-blue-200 flex gap-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-150 transition-transform duration-700">
              <span className="material-icons text-8xl">auto_awesome</span>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse">
              <span className="material-icons text-white">auto_awesome</span>
            </div>
            <div className="z-10">
              <h4 className="font-bold text-lg mb-1 flex items-center gap-2">
                Smart AI Insights
                {isLoadingInsight && <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>}
              </h4>
              <p className="text-sm text-blue-100 leading-relaxed font-medium">
                {insight}
              </p>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Recent Transactions</h3>
              <button className="text-[#1919e6] text-xs font-bold hover:underline">View All</button>
            </div>
            <div className="divide-y divide-slate-50">
              {MOCK_TRANSACTIONS.map((tx) => (
                <TransactionItem key={tx.id} transaction={tx} />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Nav - Mobile Only */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 px-6 py-3 flex items-center justify-between z-40">
        <MobileNavItem icon="dashboard" label="Dash" active />
        <MobileNavItem icon="account_balance" label="Wallets" />
        <div className="relative -top-6">
          <button className="w-14 h-14 bg-[#1919e6] rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-300 active:scale-90 transition-transform border-4 border-white">
            <span className="material-icons text-3xl">add</span>
          </button>
        </div>
        <MobileNavItem icon="pie_chart" label="Stats" />
        <MobileNavItem icon="person" label="Profile" />
      </nav>
    </div>
  );
};

const NavItem: React.FC<{ icon: string, label: string, active?: boolean }> = ({ icon, label, active }) => (
  <a href="#" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${active ? 'bg-[#1919e6]/10 text-[#1919e6]' : 'text-slate-500 hover:bg-slate-50'}`}>
    <span className="material-icons text-xl">{icon}</span>
    <span className="text-sm">{label}</span>
  </a>
);

const MobileNavItem: React.FC<{ icon: string, label: string, active?: boolean }> = ({ icon, label, active }) => (
  <a href="#" className={`flex flex-col items-center gap-1 ${active ? 'text-[#1919e6]' : 'text-slate-400'}`}>
    <span className="material-icons">{icon}</span>
    <span className={`text-[10px] ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
  </a>
);

const CategoryLegend: React.FC<{ color: string, label: string, percent: string }> = ({ color, label, percent }) => (
  <div className="flex items-center justify-between text-xs">
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${color}`}></div>
      <span className="text-slate-500 font-medium">{label}</span>
    </div>
    <span className="font-bold text-slate-800">{percent}</span>
  </div>
);

const TransactionItem: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? 'text-emerald-500' : 'text-slate-900';
  const prefix = isIncome ? '+' : '-';

  return (
    <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-pointer">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.icon === 'payments' ? 'bg-emerald-100 text-emerald-600' : transaction.icon === 'shopping_bag' ? 'bg-orange-100 text-orange-600' : transaction.icon === 'restaurant' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
          <span className="material-icons text-xl">{transaction.icon}</span>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">{transaction.name}</p>
          <p className="text-[10px] text-slate-400 font-medium">{transaction.category} • {transaction.date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm font-bold ${amountColor}`}>{prefix}${Math.abs(transaction.amount).toFixed(2)}</p>
        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter ${transaction.status === 'pending' ? 'bg-slate-100 text-slate-400' : 'bg-emerald-50 text-emerald-600'}`}>
          {transaction.status}
        </span>
      </div>
    </div>
  );
};

export default App;
