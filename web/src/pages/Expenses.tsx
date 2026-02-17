import React from 'react';
import StatCard from '../components/ui/StatCard';
import { CategoryPieChart } from '../components/ui/Charts';
import TransactionItem from '../components/ui/TransactionItem';
import { MOCK_TRANSACTIONS } from '../services/mockData';

const Expenses: React.FC = () => {
  const expenseTransactions = MOCK_TRANSACTIONS.filter(tx => tx.type === 'expense');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dépenses</h1>
          <p className="text-sm text-slate-500">Suivez et contrôlez vos dépenses</p>
        </div>
        <button className="bg-[#1919e6] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#1515c9] transition-colors flex items-center gap-2 w-fit">
          <span className="material-icons text-lg">add</span>
          Nouvelle dépense
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total ce mois" value="$3,120.00" change="-8%" changeType="positive">
          <div className="flex items-end gap-1 h-6 opacity-20">
            {[50, 80, 60, 40, 70, 90].map((h, i) => <div key={i} className="flex-1 bg-red-500 rounded-t-sm" style={{ height: `${h}%` }}></div>)}
          </div>
        </StatCard>
        <StatCard label="Budget mensuel" value="$5,000.00" change="62%" changeType="neutral">
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-4">
            <div className="bg-orange-500 h-full" style={{ width: '62%' }}></div>
          </div>
        </StatCard>
        <StatCard label="Économies" value="$1,880.00" change="+15%" changeType="positive">
          <div className="flex items-end gap-1 h-6 opacity-20">
            {[30, 40, 60, 50, 70, 85].map((h, i) => <div key={i} className="flex-1 bg-emerald-500 rounded-t-sm" style={{ height: `${h}%` }}></div>)}
          </div>
        </StatCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-6">Répartition</h3>
          <CategoryPieChart />
          <div className="mt-6 space-y-3">
            <CategoryLegend color="bg-[#1919e6]" label="Shopping" amount="$1,404" percent="45%" />
            <CategoryLegend color="bg-emerald-500" label="Nourriture" amount="$936" percent="30%" />
            <CategoryLegend color="bg-orange-500" label="Factures" amount="$468" percent="15%" />
            <CategoryLegend color="bg-slate-400" label="Autre" amount="$312" percent="10%" />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">Principales Catégories</h3>
            <div className="space-y-3">
              <CategoryBar label="Shopping" amount="$1,404" total={3120} color="bg-[#1919e6]" />
              <CategoryBar label="Nourriture" amount="$936" total={3120} color="bg-emerald-500" />
              <CategoryBar label="Factures" amount="$468" total={3120} color="bg-orange-500" />
              <CategoryBar label="Transport" amount="$312" total={3120} color="bg-purple-500" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-3xl text-white shadow-xl shadow-orange-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="material-icons text-white">warning</span>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1">Alerte Budget</h4>
                <p className="text-sm text-orange-100 leading-relaxed font-medium">
                  Vous avez dépensé 62% de votre budget mensuel. Faites attention aux dépenses non essentielles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Toutes les Dépenses</h3>
          <div className="flex gap-2">
            <select className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 font-medium">
              <option>Toutes les catégories</option>
              <option>Shopping</option>
              <option>Nourriture</option>
              <option>Factures</option>
            </select>
            <select className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 font-medium">
              <option>Ce mois</option>
              <option>Mois dernier</option>
              <option>Cette année</option>
            </select>
          </div>
        </div>
        <div className="divide-y divide-slate-50">
          {expenseTransactions.map((tx) => <TransactionItem key={tx.id} transaction={tx} />)}
        </div>
      </div>
    </div>
  );
};

const CategoryLegend: React.FC<{ color: string; label: string; amount: string; percent: string }> = ({ color, label, amount, percent }) => (
  <div className="flex items-center justify-between text-sm">
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${color}`}></div>
      <span className="text-slate-600 font-medium">{label}</span>
    </div>
    <div className="flex items-center gap-3">
      <span className="text-slate-400 text-xs font-medium">{amount}</span>
      <span className="font-bold text-slate-800">{percent}</span>
    </div>
  </div>
);

const CategoryBar: React.FC<{ label: string; amount: string; total: number; color: string }> = ({ label, amount, total, color }) => {
  const percentage = (parseFloat(amount.replace('$', '').replace(',', '')) / total) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-700 font-semibold">{label}</span>
        <span className="font-bold text-slate-900">{amount}</span>
      </div>
      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
        <div className={`${color} h-full rounded-full`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

export default Expenses;
