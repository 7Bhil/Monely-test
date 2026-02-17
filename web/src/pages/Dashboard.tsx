import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Sparkles, ArrowRight, PlusCircle, Bell, X } from 'lucide-react';
import { AddWalletModal } from '@/components/modals/AddWalletModal';
import { AddTransactionModal } from '@/components/modals/AddTransactionModal';

// Chart placeholders - real logic inside component

// Real calculations will happen inside the component

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [wallets, setWallets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [salaryConfirming, setSalaryConfirming] = useState(false);
  const [hideSalaryBanner, setHideSalaryBanner] = useState(false);

  const isTenthDay = new Date().getDate() === 10;
  // For demo/debug purposes, you can uncomment the line below:
  // const isTenthDay = true; 

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
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalBalance = wallets.reduce((sum, wallet) => sum + Number(wallet.balance), 0);
  const monthlyIncome = user?.monthly_income || 0;
  
  // Real calculations based on transactions
  const currentMonthTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === new Date().getMonth() && d.getFullYear() === new Date().getFullYear();
  });

  const monthlyExpenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
  const budgetLeft = monthlyIncome - monthlyExpenses;
  const budgetPercentage = monthlyIncome > 0 ? Math.round((budgetLeft / monthlyIncome) * 100) : 0;

  // Real chart data aggregation
  const categoryMap = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: any, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {});

  const categoryData = Object.entries(categoryMap).map(([name, value]: [string, any], i) => ({
    name,
    value: Math.round((value / monthlyExpenses) * 100) || 0,
    color: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'][i % 5]
  }));

  // Cash Flow Data Aggregation (Last 6 months)
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  const cashFlowData = Array.from({ length: 6 }, (_, i) => {
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
      expenses: monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0)
    };
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: user?.currency || 'XOF', // Changed to XOF for better alignment with "F CFA"
      maximumFractionDigits: 0 
    }).format(amount).replace('XOF', 'F CFA');
  };

  const handleSalaryConfirm = async () => {
    if (!wallets.length || !user?.monthly_income) return;
    setSalaryConfirming(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/'}transactions/transactions/`, {
        wallet: wallets[0].id, // Default to first wallet
        name: 'Salaire Mensuel',
        amount: user.monthly_income,
        type: 'income',
        category: 'Revenu',
        date: new Date().toISOString(),
        status: 'completed'
      });
      setHideSalaryBanner(true);
      fetchData();
    } catch (error) {
      console.error("Failed to confirm salary", error);
    } finally {
      setSalaryConfirming(false);
    }
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><Icons.spinner className="animate-spin h-8 w-8 text-primary" /></div>;
  }

  return (
    <div className="space-y-8">
      {/* Salary Notification Banner */}
      {isTenthDay && !hideSalaryBanner && (
        <div className="bg-emerald-600 rounded-2xl p-4 text-white flex items-center justify-between shadow-lg animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-4">
              <div className="p-2 bg-white/20 rounded-full">
                  <Bell className="h-5 w-5 animate-bounce" />
              </div>
              <div>
                  <p className="font-bold">C'est le 10 du mois ! 💸</p>
                  <p className="text-sm opacity-90">Avez-vous reçu votre salaire de {formatCurrency(user?.monthly_income || 0)} ?</p>
              </div>
          </div>
          <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="secondary" 
                className="bg-white text-emerald-600 hover:bg-emerald-50"
                onClick={handleSalaryConfirm}
                disabled={salaryConfirming}
              >
                {salaryConfirming ? "Traitement..." : "Oui, reçu !"}
              </Button>
              <Button size="sm" variant="ghost" className="text-white hover:bg-white/10" onClick={() => setHideSalaryBanner(true)}>
                <X className="h-4 w-4" />
              </Button>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Aperçu</h2>
          <p className="text-muted-foreground">Bon retour, {user?.name || 'Utilisateur'} !</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowAddWallet(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Portefeuille
            </Button>
            <Button size="sm" onClick={() => setShowAddTransaction(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Transaction
            </Button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Balance */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Solde Total</CardTitle>
            <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">+2.4%</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
            <div className="h-[40px] mt-2 -mx-2">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                        {v: 100}, {v: 120}, {v: 110}, {v: 140}, {v: 130}, {v: 160}
                    ]}>
                        <defs>
                            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#1919e6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#1919e6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="v" stroke="#1919e6" fillOpacity={1} fill="url(#colorBalance)" strokeWidth={2} />
                    </AreaChart>
                 </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Income */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Revenu</CardTitle>
             <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-0.5 rounded-full">+12%</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(monthlyIncome)}</div>
             <div className="h-[40px] mt-2 flex items-end gap-1">
                {[40, 60, 45, 70, 65, 80].map((h, i) => (
                    <div key={i} style={{height: `${h}%`}} className="flex-1 bg-green-100 rounded-sm"></div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Expenses */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Dépenses</CardTitle>
            <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">-8%</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(monthlyExpenses)}</div>
            <div className="h-[40px] mt-2 flex items-end gap-1">
                {[50, 30, 60, 40, 55, 35].map((h, i) => (
                    <div key={i} style={{height: `${h}%`}} className="flex-1 bg-red-100 rounded-sm"></div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Budget Left */}
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Reste à vivre (Budget)</CardTitle>
            <span className="text-xs font-medium text-muted-foreground">{budgetPercentage}%</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(budgetLeft)}</div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-6">
                <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${Math.max(0, Math.min(100, budgetPercentage))}%` }}></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Row */}
      <div className="grid gap-4 md:grid-cols-7">
        {/* Cash Flow Chart */}
        <Card className="col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Flux Financier</CardTitle>
          </CardHeader>
          <CardContent className="pl-0 min-h-[240px]">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={cashFlowData}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                    dataKey="name" 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                 />
                <YAxis 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `${value > 1000 ? (value/1000).toFixed(1)+'k' : value}`} 
                />
                <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{fill: '#f1f5f9'}} 
                />
                <Bar dataKey="income" fill="#1919e6" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Chart */}
        <Card className="col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Par Catégorie</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="h-[180px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        >
                        {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="text-xs text-muted-foreground">Dépenses</p>
                    <p className="text-lg font-bold">{formatCurrency(monthlyExpenses)}</p>
                </div>
            </div>
            
            {/* Legend */}
            <div className="w-full space-y-2 mt-4">
                 {categoryData.map((cat, i) => (
                     <div key={i} className="flex items-center justify-between text-sm">
                         <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></div>
                             <span className="text-muted-foreground">{cat.name}</span>
                         </div>
                         <span className="font-semibold">{cat.value}%</span>
                     </div>
                 ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* AI Insights Banner */}
      <div className="bg-primary rounded-2xl p-6 text-primary-foreground flex items-center justify-between shadow-lg shadow-primary/20">
          <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 font-semibold">
                  <div className="p-1.5 bg-white/20 rounded-lg">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  Smart AI Insights
              </div>
              <p className="text-sm opacity-90 leading-relaxed">
                  Avec l'augmentation impressionnante de vos revenus freelance et des dépenses quotidiennes modestes, vous avez une opportunité fantastique de mettre de côté ce revenu supplémentaire pour un objectif futur.
              </p>
          </div>
          <Button variant="secondary" className="hidden md:flex whitespace-nowrap bg-white text-primary hover:bg-white/90">
             Voir les recommendations
          </Button>
      </div>

       {/* Recent Transactions List */}
       <Card className="shadow-sm">
           <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base font-semibold">Transactions Récentes</CardTitle>
                <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5" onClick={() => window.location.href = '/transactions'}>
                    Voir tout <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </CardHeader>
           <CardContent>
               <div className="space-y-6">
                   {transactions.slice(0, 5).map((t, i) => (
                       <div key={i} className="flex items-center justify-between group cursor-pointer" onClick={() => navigate('/transactions')}>
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'} group-hover:scale-110 transition-transform`}>
                                     <Icons.creditCard className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">{t.name}</p>
                                    <p className="text-xs text-muted-foreground">{t.category} • {new Date(t.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`font-bold text-sm ${t.type === 'income' ? 'text-green-600' : 'text-foreground'}`}>
                                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                </p>
                                <p className="text-[10px] uppercase font-bold text-muted-foreground bg-slate-50 px-2 py-0.5 rounded-sm inline-block">{t.status || 'Validé'}</p>
                            </div>
                       </div>
                   ))}
                   {transactions.length === 0 && (
                       <p className="text-center text-muted-foreground py-4">Aucune transaction récente.</p>
                   )}
               </div>
           </CardContent>
       </Card>

      <AddWalletModal 
        open={showAddWallet} 
        onOpenChange={setShowAddWallet} 
        onSuccess={fetchData} 
      />
      <AddTransactionModal 
        open={showAddTransaction} 
        onOpenChange={setShowAddTransaction} 
        onSuccess={fetchData} 
      />
    </div>
  );
}
