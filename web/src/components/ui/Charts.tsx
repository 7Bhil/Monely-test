import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

// Types for dynamic charts
export interface ChartItem {
  name: string;
  income: number;
  expense: number;
}

export interface PieItem {
  name: string;
  value: number;
  color: string;
}

export interface TrendItem {
  date: string;
  amount: number;
}

export const IncomeExpensesChart = ({ data, expenseColor = "#e2e8f0" }: { data?: ChartItem[], expenseColor?: string }) => (
  <div className="h-64 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
        />
        <Bar dataKey="income" fill="#1919e6" radius={[4, 4, 0, 0]} barSize={12} />
        <Bar dataKey="expense" fill={expenseColor} radius={[4, 4, 0, 0]} barSize={12} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export const CategoryPieChart = ({ data, totalValue }: { data?: PieItem[], totalValue?: string }) => (
  <div className="h-48 w-full flex flex-col items-center justify-center relative">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data || []}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={70}
          paddingAngle={5}
          dataKey="value"
        >
          {(data || []).map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <span className="text-[10px] text-slate-400 font-semibold uppercase">Total</span>
      <span className="text-lg font-bold text-slate-800">{totalValue || '$0'}</span>
    </div>
  </div>
);

export const TrendChart = ({ data }: { data?: TrendItem[] }) => (
  <div className="h-64 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1919e6" stopOpacity={0.1}/>
            <stop offset="95%" stopColor="#1919e6" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="date" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 10, fill: '#94a3b8' }} 
        />
        <YAxis hide domain={['auto', 'auto']} />
        <Tooltip 
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
        />
        <Area type="monotone" dataKey="amount" stroke="#1919e6" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);
