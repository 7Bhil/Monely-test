import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { TrendChart, IncomeExpensesChart, CategoryPieChart } from '../components/ui/Charts';
import StatCard from '../components/ui/StatCard';
import { 
  HeartPulse, 
  PiggyBank, 
  CheckCircle2, 
  TrendingUp, 
  Lightbulb, 
  TrendingDown, 
  Landmark,
  Loader2
} from 'lucide-react';

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const [wallets, setWallets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [walletsRes, transactionsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/'}wallets/wallets/`),
        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/'}transactions/transactions/`)
      ]);
      setWallets(walletsRes.data.results || walletsRes.data);
      setTransactions(transactionsRes.data.results || transactionsRes.data);
    } catch (error) {
      console.error("Failed to fetch analytics data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalBalance = wallets.reduce((sum, wallet) => sum + Number(wallet.balance), 0);
  
  const currentMonthTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === new Date().getMonth() && d.getFullYear() === new Date().getFullYear();
  });

  const mExpenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
  
  const mIncome = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

  const savingsRate = mIncome > 0 ? Math.round(((mIncome - mExpenses) / mIncome) * 100) : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: user?.currency || 'XOF',
      maximumFractionDigits: 0 
    }).format(amount).replace('XOF', 'F CFA');
  };

  // Pie Chart Data
  const categoryMap = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: any, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {});

  const pieData = Object.entries(categoryMap).map(([name, value]: [string, any], i) => ({
    name,
    value: Math.round((value / mExpenses) * 100) || 0,
    color: ['#1919e6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'][i % 5]
  }));

  // Bar Chart Data (Last 6 months)
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  const barData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const monthIndex = d.getMonth();
    const year = d.getFullYear();
    
    const monthTransactions = transactions.filter(t => {
      const td = new Date(t.date);
      return td.getMonth() === monthIndex && td.getFullYear() === year;
    });

    return {
      name: months[monthIndex],
      income: monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0),
      expense: monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0)
    };
  });

  // Trend Data (Last 30 days evolution)
  const trendData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (5 - i) * 5);
    return {
      date: `${d.getDate()}/${d.getMonth() + 1}`,
      amount: totalBalance - (5 - i) * 1000 // Mocking evolution for trend
    };
  });

  if (loading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytiques</h1>
        <p className="text-sm text-slate-500">Analyses détaillées de vos finances</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Solde Total" value={formatCurrency(totalBalance)} change="+2.4%" changeType="positive" />
        <StatCard label="Taux d'Épargne" value={`${savingsRate}%`} change="+3%" changeType="positive" />
        <StatCard label="Dépenses (Mois)" value={formatCurrency(mExpenses)} change="-5%" changeType="positive" />
        <StatCard label="Revenus (Mois)" value={formatCurrency(mIncome)} change="+12%" changeType="positive" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Évolution Patrimoine</h3>
            <select className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 font-medium">
              <option>6 derniers mois</option>
              <option>12 derniers mois</option>
              <option>Tout</option>
            </select>
          </div>
          <TrendChart data={trendData} />
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-6">Comparaison Mensuelle</h3>
          <IncomeExpensesChart data={barData} expenseColor="#ef4444" />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-6">Répartition Dépenses</h3>
          <CategoryPieChart data={pieData} totalValue={formatCurrency(mExpenses)} />
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-6">Tendances Mensuelles</h3>
          <div className="space-y-4">
            {barData.reverse().map((item, id) => (
              <TrendRow 
                key={id} 
                month={item.name} 
                income={item.income} 
                expenses={item.expense} 
                savings={item.income - item.expense}
                currencySymbol={user?.currency === 'XOF' ? 'F CFA' : user?.currency || '$'}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-primary to-blue-700 p-6 rounded-3xl text-white shadow-xl">
          <h3 className="font-bold text-lg mb-4">Performance Financière</h3>
          <div className="space-y-3">
            <MetricRow label="Score de Santé Financière" value={`${Math.min(100, 70 + savingsRate/2)}/100`} icon={HeartPulse} />
            <MetricRow label="Taux d'Épargne Moyen" value={`${savingsRate}%`} icon={PiggyBank} />
            <MetricRow label="Budget Respect" value="92%" icon={CheckCircle2} />
            <MetricRow label="Prévisions 3 mois" value={`+${formatCurrency(totalBalance * 0.1)}`} icon={TrendingUp} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4">Conseils Personnalisés</h3>
          <div className="space-y-3">
            <TipCard
              icon={Lightbulb}
              color="bg-yellow-50 text-yellow-600"
              tip="Augmentez votre épargne de 5% pour atteindre vos objectifs plus rapidement"
            />
            <TipCard
              icon={TrendingDown}
              color="bg-blue-50 text-blue-600"
              tip="Vos dépenses en transport ont diminué ce mois-ci, excellent travail!"
            />
            <TipCard
              icon={Landmark}
              color="bg-emerald-50 text-emerald-600"
              tip="Envisagez de transférer 10% de votre solde vers votre compte épargne"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const TrendRow: React.FC<{ month: string; income: number; expenses: number; savings: number; currencySymbol: string }> = ({ month, income, expenses, savings, currencySymbol }) => {
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;
  
  return (
    <div className="flex items-center gap-4 pb-4 border-b border-slate-100 last:border-0">
      <div className="w-20 text-sm font-semibold text-slate-700">{month}</div>
      <div className="flex-1 grid grid-cols-3 gap-4 text-xs">
        <div>
          <span className="text-slate-400 block mb-1">Revenus</span>
          <span className="font-bold text-emerald-600">{income.toLocaleString()} {currencySymbol}</span>
        </div>
        <div>
          <span className="text-slate-400 block mb-1">Dépenses</span>
          <span className="font-bold text-red-500">{expenses.toLocaleString()} {currencySymbol}</span>
        </div>
        <div>
          <span className="text-slate-400 block mb-1">Épargne</span>
          <span className="font-bold text-primary">{savings.toLocaleString()} {currencySymbol} ({savingsRate.toFixed(0)}%)</span>
        </div>
      </div>
    </div>
  );
};

const MetricRow: React.FC<{ label: string; value: string; icon: React.ElementType }> = ({ label, value, icon: Icon }) => (
  <div className="flex items-center justify-between bg-white/10 rounded-xl p-3">
    <div className="flex items-center gap-3">
      <Icon className="h-5 w-5" />
      <span className="text-sm font-medium">{label}</span>
    </div>
    <span className="font-bold">{value}</span>
  </div>
);

const TipCard: React.FC<{ icon: React.ElementType; color: string; tip: string }> = ({ icon: Icon, color, tip }) => (
  <div className={`${color} rounded-xl p-4 flex gap-3`}>
    <Icon className="h-5 w-5 flex-shrink-0" />
    <p className="text-sm font-medium leading-relaxed">{tip}</p>
  </div>
);

export default Analytics;
