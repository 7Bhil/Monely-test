import React from 'react';
import StatCard from '../components/ui/StatCard';
import { IncomeExpensesChart } from '../components/ui/Charts';
import TransactionItem from '../components/ui/TransactionItem';
import { MOCK_TRANSACTIONS } from '../services/mockData';

const Income: React.FC = () => {
  const incomeTransactions = MOCK_TRANSACTIONS.filter(tx => tx.type === 'income');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Revenus</h1>
          <p className="text-sm text-slate-500">Gérez vos sources de revenus</p>
        </div>
        <button className="bg-[#1919e6] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#1515c9] transition-colors flex items-center gap-2 w-fit">
          <span className="material-icons text-lg">add</span>
          Ajouter un revenu
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total ce mois" value="$8,450.00" change="+12%" changeType="positive">
          <div className="flex items-end gap-1 h-6 opacity-20">
            {[30, 50, 70, 80, 60, 90].map((h, i) => <div key={i} className="flex-1 bg-emerald-500 rounded-t-sm" style={{ height: `${h}%` }}></div>)}
          </div>
        </StatCard>
        <StatCard label="Moyenne mensuelle" value="$7,890.00" change="+5%" changeType="positive">
          <div className="flex items-end gap-1 h-6 opacity-20">
            {[40, 60, 55, 70, 65, 80].map((h, i) => <div key={i} className="flex-1 bg-emerald-500 rounded-t-sm" style={{ height: `${h}%` }}></div>)}
          </div>
        </StatCard>
        <StatCard label="Objectif annuel" value="$95,000.00" change="68%" changeType="neutral">
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-4">
            <div className="bg-emerald-500 h-full" style={{ width: '68%' }}></div>
          </div>
        </StatCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Évolution des Revenus</h3>
            <select className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 font-medium">
              <option>6 derniers mois</option>
              <option>12 derniers mois</option>
              <option>Cette année</option>
            </select>
          </div>
          <IncomeExpensesChart />
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-6">Sources de Revenus</h3>
          <div className="space-y-4">
            <SourceItem label="Salaire" amount="$4,200" percentage={50} color="bg-[#1919e6]" />
            <SourceItem label="Freelance" amount="$2,500" percentage={30} color="bg-emerald-500" />
            <SourceItem label="Investissements" amount="$1,200" percentage={14} color="bg-orange-500" />
            <SourceItem label="Autres" amount="$550" percentage={6} color="bg-slate-400" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Tous les Revenus</h3>
          <div className="flex gap-2">
            <select className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 font-medium">
              <option>Tous</option>
              <option>Ce mois</option>
              <option>Mois dernier</option>
            </select>
          </div>
        </div>
        <div className="divide-y divide-slate-50">
          {incomeTransactions.map((tx) => <TransactionItem key={tx.id} transaction={tx} />)}
        </div>
      </div>
    </div>
  );
};

const SourceItem: React.FC<{ label: string; amount: string; percentage: number; color: string }> = ({ label, amount, percentage, color }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-600 font-medium">{label}</span>
      <span className="font-bold text-slate-900">{amount}</span>
    </div>
    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
      <div className={`${color} h-full rounded-full`} style={{ width: `${percentage}%` }}></div>
    </div>
    <span className="text-xs text-slate-400 font-medium">{percentage}% du total</span>
  </div>
);

export default Income;
