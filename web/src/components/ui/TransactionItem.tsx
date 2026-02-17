import React from 'react';
import type { Transaction } from '../../types';

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? 'text-emerald-500' : 'text-slate-900';
  const prefix = isIncome ? '+' : '-';

  const iconBgColor = 
    transaction.icon === 'payments' ? 'bg-emerald-100 text-emerald-600' :
    transaction.icon === 'shopping_bag' ? 'bg-orange-100 text-orange-600' :
    transaction.icon === 'restaurant' ? 'bg-blue-100 text-blue-600' :
    'bg-purple-100 text-purple-600';

  return (
    <div className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-pointer">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${iconBgColor}`}>
          <span className="material-icons text-xl">{transaction.icon}</span>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">{transaction.name}</p>
          <p className="text-[10px] text-slate-400 font-medium">{transaction.category} • {transaction.date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm font-bold ${amountColor}`}>{prefix}${Math.abs(transaction.amount).toFixed(2)}</p>
        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter ${
          transaction.status === 'pending' ? 'bg-slate-100 text-slate-400' : 'bg-emerald-50 text-emerald-600'
        }`}>
          {transaction.status === 'pending' ? 'En attente' : 'Complété'}
        </span>
      </div>
    </div>
  );
};

export default TransactionItem;
