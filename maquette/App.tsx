
import React, { useState, useEffect } from 'react';
import { StatCard } from './components/StatCard';
import { IncomeExpensesChart, CategoryPieChart, TrendChart } from './components/Charts';
import { Transaction } from './types';
import { getSmartInsights } from './services/geminiService';

type View = 'dashboard' | 'income' | 'expenses' | 'wallets' | 'analytics' | 'settings';

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', name: 'Amazon Marketplace', category: 'Electronics', amount: -124.50, date: 'Today, 2:45 PM', type: 'expense', status: 'pending', icon: 'shopping_bag' },
  { id: '2', name: 'Monthly Salary', category: 'Income', amount: 4200.00, date: 'Yesterday, 9:00 AM', type: 'income', status: 'completed', icon: 'payments' },
  { id: '3', name: 'Starbucks Coffee', category: 'Food & Drink', amount: -5.25, date: 'Yesterday, 8:15 AM', type: 'expense', status: 'completed', icon: 'restaurant' },
  { id: '4', name: 'Uber Ride', category: 'Transport', amount: -18.30, date: 'Oct 14, 2023', type: 'expense', status: 'completed', icon: 'directions_car' },
  { id: '5', name: 'Freelance Project', category: 'Income', amount: 1500.00, date: 'Oct 12, 2023', type: 'income', status: 'completed', icon: 'work_outline' },
  { id: '6', name: 'Netflix Subscription', category: 'Bills', amount: -15.99, date: 'Oct 10, 2023', type: 'expense', status: 'completed', icon: 'subscriptions' },
];

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
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

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard': return <DashboardView insight={insight} isLoadingInsight={isLoadingInsight} />;
      case 'income': return <TransactionsView type="income" />;
      case 'expenses': return <TransactionsView type="expense" />;
      case 'wallets': return <WalletsView />;
      case 'analytics': return <AnalyticsView />;
      case 'settings': return <SettingsView />;
      default: return <DashboardView insight={insight} isLoadingInsight={isLoadingInsight} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-[#1919e6] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <span className="material-icons">account_balance_wallet</span>
          </div>
          <span className="text-xl font-bold tracking-tight">ZenBudget</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <NavItem icon="dashboard" label="Dashboard" active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
          <NavItem icon="trending_up" label="Income" active={activeView === 'income'} onClick={() => setActiveView('income')} />
          <NavItem icon="trending_down" label="Expenses" active={activeView === 'expenses'} onClick={() => setActiveView('expenses')} />
          <NavItem icon="account_balance" label="Wallets" active={activeView === 'wallets'} onClick={() => setActiveView('wallets')} />
          <NavItem icon="insert_chart_outlined" label="Analytics" active={activeView === 'analytics'} onClick={() => setActiveView('analytics')} />
          <NavItem icon="settings" label="Settings" active={activeView === 'settings'} onClick={() => setActiveView('settings')} />
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
        <header className="sticky top-0 z-20 bg-[#f6f6f8]/80 backdrop-blur-md px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="lg:hidden w-10 h-10 bg-[#1919e6] rounded-lg flex items-center justify-center text-white">
            <span className="material-icons">account_balance_wallet</span>
          </div>
          
          <div className="flex-1 max-w-lg mx-4">
            <div className="relative">
              <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-white border-none rounded-full py-2 pl-9 pr-4 text-xs focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm"
              />
            </div>
          </div>

          <button className="relative p-2 text-slate-500 bg-white rounded-full shadow-sm hover:bg-slate-50">
            <span className="material-icons text-xl">notifications_none</span>
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </header>

        <div className="px-4 lg:px-8 max-w-6xl mx-auto py-4">
          {renderContent()}
        </div>
      </main>

      {/* Bottom Nav - Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 px-6 py-3 flex items-center justify-between z-40 shadow-[0_-1px_10px_rgba(0,0,0,0.05)]">
        <MobileNavItem icon="dashboard" label="Dash" active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
        <MobileNavItem icon="account_balance" label="Wallets" active={activeView === 'wallets'} onClick={() => setActiveView('wallets')} />
        <div className="relative -top-6">
          <button className="w-14 h-14 bg-[#1919e6] rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-300 active:scale-90 transition-transform border-4 border-white">
            <span className="material-icons text-3xl">add</span>
          </button>
        </div>
        <MobileNavItem icon="pie_chart" label="Stats" active={activeView === 'analytics'} onClick={() => setActiveView('analytics')} />
        <MobileNavItem icon="settings" label="Config" active={activeView === 'settings'} onClick={() => setActiveView('settings')} />
      </nav>
    </div>
  );
};

/* --- VIEWS --- */

const DashboardView: React.FC<{ insight: string, isLoadingInsight: boolean }> = ({ insight, isLoadingInsight }) => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Overview</h1>
        <p className="text-sm text-slate-500">Welcome back, Alex!</p>
      </div>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Total Balance" value="$45,230.00" change="+2.4%" changeType="positive">
        <div className="flex items-end gap-1 h-6 opacity-20">
          {[40, 60, 80, 50, 70, 100].map((h, i) => <div key={i} className="flex-1 bg-[#1919e6] rounded-t-sm" style={{ height: `${h}%` }}></div>)}
        </div>
      </StatCard>
      <StatCard label="Income" value="$8,450.00" change="+12%" changeType="positive">
        <div className="flex items-end gap-1 h-6 opacity-20">
          {[30, 50, 70, 80, 60, 90].map((h, i) => <div key={i} className="flex-1 bg-emerald-500 rounded-t-sm" style={{ height: `${h}%` }}></div>)}
        </div>
      </StatCard>
      <StatCard label="Expenses" value="$3,120.00" change="-8%" changeType="negative">
        <div className="flex items-end gap-1 h-6 opacity-20">
          {[50, 80, 60, 40, 70, 90].map((h, i) => <div key={i} className="flex-1 bg-red-500 rounded-t-sm" style={{ height: `${h}%` }}></div>)}
        </div>
      </StatCard>
      <StatCard label="Budget Left" value="$5,330.00" change="75%" changeType="neutral">
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-4">
          <div className="bg-[#1919e6] h-full" style={{ width: '75%' }}></div>
        </div>
      </StatCard>
    </div>

    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-800">Cash Flow</h3>
        </div>
        <IncomeExpensesChart />
      </div>
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-6">By Category</h3>
        <CategoryPieChart />
        <div className="mt-6 space-y-3">
          <CategoryLegend color="bg-[#1919e6]" label="Shopping" percent="45%" />
          <CategoryLegend color="bg-emerald-500" label="Food & Drink" percent="30%" />
          <CategoryLegend color="bg-orange-500" label="Bills" percent="15%" />
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-br from-[#1919e6] to-[#4f46e5] p-6 rounded-3xl text-white shadow-xl shadow-blue-200 flex gap-4 relative overflow-hidden group">
      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
        <span className="material-icons text-white">auto_awesome</span>
      </div>
      <div className="z-10">
        <h4 className="font-bold text-lg mb-1 flex items-center gap-2">Smart AI Insights</h4>
        <p className="text-sm text-blue-100 leading-relaxed font-medium">
          {isLoadingInsight ? "Deep diving into your data..." : insight}
        </p>
      </div>
    </div>

    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
        <h3 className="font-bold text-slate-800">Recent Transactions</h3>
      </div>
      <div className="divide-y divide-slate-50">
        {MOCK_TRANSACTIONS.slice(0, 4).map((tx) => <TransactionItem key={tx.id} transaction={tx} />)}
      </div>
    </div>
  </div>
);

const TransactionsView: React.FC<{ type: 'income' | 'expense' }> = ({ type }) => {
  const filtered = MOCK_TRANSACTIONS.filter(t => t.type === type);
  const total = filtered.reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
  
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold capitalize text-slate-900">{type}s</h1>
        <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total {type}</p>
          <p className="text-lg font-bold text-slate-900">${total.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="divide-y divide-slate-50">
          {filtered.length > 0 ? (
            filtered.map((tx) => <TransactionItem key={tx.id} transaction={tx} />)
          ) : (
            <div className="p-10 text-center text-slate-400 italic">No transactions found for this category.</div>
          )}
        </div>
      </div>
    </div>
  );
};

const WalletsView: React.FC = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <h1 className="text-2xl font-bold text-slate-900">My Wallets</h1>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <WalletCard name="Main Savings" balance="32,400.00" last4="8821" color="from-indigo-600 to-blue-500" />
      <WalletCard name="Daily Expenses" balance="2,120.50" last4="1024" color="from-emerald-600 to-teal-500" />
      <WalletCard name="Investment Portfolio" balance="10,709.50" last4="3391" color="from-slate-800 to-slate-900" />
    </div>
    
    <div className="mt-8">
      <h3 className="font-bold text-slate-800 mb-4">Financial Goals</h3>
      <div className="grid gap-4">
        <GoalItem label="House Deposit" target={100000} current={65400} />
        <GoalItem label="New Car" target={45000} current={12000} />
      </div>
    </div>
  </div>
);

const AnalyticsView: React.FC = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
      <h3 className="font-bold text-slate-800 mb-6">Net Worth Trend</h3>
      <TrendChart />
    </div>
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-4">Top Spending</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span>Electronics</span>
            <span className="font-bold">$1,200.00</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full" style={{ width: '80%' }}></div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Dining Out</span>
            <span className="font-bold">$450.00</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-300 h-full" style={{ width: '30%' }}></div>
          </div>
        </div>
      </div>
      <div className="bg-[#1919e6] p-6 rounded-3xl text-white">
        <h3 className="font-bold mb-4">Optimization Tip</h3>
        <p className="text-sm opacity-80">You've spent 20% more on dining this month. Consider cooking at home next week to save roughly $120.</p>
        <button className="mt-4 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-xs font-bold transition-colors">Apply Savings Plan</button>
      </div>
    </div>
  </div>
);

const SettingsView: React.FC = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-2xl">
    <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-8">
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Personal Info</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Full Name</label>
            <input type="text" defaultValue="Alex Johnson" className="w-full bg-slate-50 border-none rounded-xl py-3 text-sm focus:ring-2 focus:ring-blue-100" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Email</label>
            <input type="email" defaultValue="alex.j@example.com" className="w-full bg-slate-50 border-none rounded-xl py-3 text-sm focus:ring-2 focus:ring-blue-100" />
          </div>
        </div>
      </section>
      
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Preferences</h3>
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
          <div>
            <p className="text-sm font-bold text-slate-900">Push Notifications</p>
            <p className="text-xs text-slate-500">Alerts for large transactions</p>
          </div>
          <div className="w-12 h-6 bg-[#1919e6] rounded-full relative">
            <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
          </div>
        </div>
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
          <div>
            <p className="text-sm font-bold text-slate-900">Currency Display</p>
            <p className="text-xs text-slate-500">Default: USD ($)</p>
          </div>
          <span className="material-icons text-slate-400">chevron_right</span>
        </div>
      </section>

      <button className="w-full bg-[#1919e6] text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 hover:scale-[1.01] transition-transform">
        Save Changes
      </button>
    </div>
  </div>
);

/* --- COMPONENTS --- */

const NavItem: React.FC<{ icon: string, label: string, active?: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all ${active ? 'bg-[#1919e6] text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:bg-slate-50'}`}>
    <span className="material-icons text-xl">{icon}</span>
    <span className="text-sm">{label}</span>
  </button>
);

const MobileNavItem: React.FC<{ icon: string, label: string, active?: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 flex-1 transition-all ${active ? 'text-[#1919e6]' : 'text-slate-400'}`}>
    <span className="material-icons">{icon}</span>
    <span className={`text-[10px] ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
  </button>
);

const WalletCard: React.FC<{ name: string, balance: string, last4: string, color: string }> = ({ name, balance, last4, color }) => (
  <div className={`p-6 rounded-[2rem] bg-gradient-to-br ${color} text-white shadow-xl relative overflow-hidden group`}>
    <div className="absolute top-4 right-6 opacity-40">
      <span className="material-icons text-4xl">contactless</span>
    </div>
    <p className="text-xs font-medium opacity-70 mb-1">{name}</p>
    <p className="text-2xl font-bold mb-8">${balance}</p>
    <div className="flex justify-between items-center">
      <p className="text-sm font-mono tracking-widest">•••• •••• •••• {last4}</p>
      <div className="flex -space-x-2">
        <div className="w-6 h-6 rounded-full bg-red-400 opacity-80"></div>
        <div className="w-6 h-6 rounded-full bg-yellow-400 opacity-80"></div>
      </div>
    </div>
  </div>
);

const GoalItem: React.FC<{ label: string, target: number, current: number }> = ({ label, target, current }) => {
  const percent = (current / target) * 100;
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100">
      <div className="flex justify-between text-sm font-bold mb-2">
        <span>{label}</span>
        <span>{percent.toFixed(0)}%</span>
      </div>
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div className="bg-[#1919e6] h-full" style={{ width: `${percent}%` }}></div>
      </div>
      <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
        <span>${current.toLocaleString()}</span>
        <span>Target: ${target.toLocaleString()}</span>
      </div>
    </div>
  );
};

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
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${transaction.icon === 'payments' ? 'bg-emerald-100 text-emerald-600' : transaction.icon === 'shopping_bag' ? 'bg-orange-100 text-orange-600' : transaction.icon === 'restaurant' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
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
