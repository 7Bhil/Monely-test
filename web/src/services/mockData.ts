import type { Transaction } from '../types';

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', name: 'Amazon Marketplace', category: 'Électronique', amount: -124.50, date: "Aujourd'hui, 14:45", type: 'expense', status: 'pending', icon: 'shopping_bag' },
  { id: '2', name: 'Salaire Mensuel', category: 'Revenu', amount: 4200.00, date: 'Hier, 9:00', type: 'income', status: 'completed', icon: 'payments' },
  { id: '3', name: 'Starbucks Coffee', category: 'Nourriture', amount: -5.25, date: 'Hier, 8:15', type: 'expense', status: 'completed', icon: 'restaurant' },
  { id: '4', name: 'Course Uber', category: 'Transport', amount: -18.30, date: '14 Oct, 2023', type: 'expense', status: 'completed', icon: 'directions_car' },
  { id: '5', name: 'Projet Freelance', category: 'Revenu', amount: 1500.00, date: '12 Oct, 2023', type: 'income', status: 'completed', icon: 'work_outline' },
  { id: '6', name: 'Abonnement Netflix', category: 'Factures', amount: -15.99, date: '10 Oct, 2023', type: 'expense', status: 'completed', icon: 'subscriptions' },
];
