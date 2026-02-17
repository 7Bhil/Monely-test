import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';
import { Progress } from "@/components/ui/progress"

export default function OnboardingPage() {
  const { updateUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Personal Finances
  const [income, setIncome] = useState('');
  const [frequency, setFrequency] = useState('monthly');
  const [currency, setCurrency] = useState('USD');

  // Step 2: Fixed Expenses
  const [expenses, setExpenses] = useState<{name: string, amount: string, periodicity: string}[]>([
      { name: 'Loyer', amount: '', periodicity: 'monthly' }
  ]);

  const handleStep1 = async () => {
    setLoading(true);
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/'}auth/profile/update/`, {
        monthly_income: parseFloat(income),
        income_frequency: frequency,
        currency: currency
      });
      updateUser({ 
          monthly_income: parseFloat(income), 
          income_frequency: frequency, 
          currency: currency 
      });
      setStep(2);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addExpenseRow = () => {
      setExpenses([...expenses, { name: '', amount: '', periodicity: 'monthly' }]);
  };

  const updateExpense = (index: number, field: string, value: string) => {
      const newExpenses = [...expenses];
      newExpenses[index] = { ...newExpenses[index], [field]: value };
      setExpenses(newExpenses);
  };

  const handleStep2 = async () => {
    setLoading(true);
    try {
      // Filter out empty expenses
      const validExpenses = expenses.filter(e => e.name && e.amount);
      
      for (const expense of validExpenses) {
          await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/'}wallets/fixed-expenses/`, {
              name: expense.name,
              amount: parseFloat(expense.amount),
              periodicity: expense.periodicity,
              currency: currency // Use user's currency
          });
      }
      navigate('/');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
              <CardTitle>Configuration de votre profil</CardTitle>
              <span className="text-sm text-muted-foreground">Étape {step} sur 2</span>
          </div>
          <Progress value={step === 1 ? 50 : 100} className="w-full" />
          <CardDescription className="pt-4">
              {step === 1 
                  ? "Commençons par configurer vos revenus pour établir votre budget." 
                  : "Indiquez vos charges fixes récurrentes (Loyer, Abonnements, etc.)."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Devise principale</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une devise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">Dollar (USD)</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    <SelectItem value="GBP">Livre Sterling (GBP)</SelectItem>
                    <SelectItem value="XOF">Franc CFA (XOF)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Revenu</Label>
                    <Input 
                        type="number" 
                        placeholder="0.00" 
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Fréquence</Label>
                    <Select value={frequency} onValueChange={setFrequency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Mensuel</SelectItem>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                        <SelectItem value="yearly">Annuel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
                {expenses.map((expense, index) => (
                    <div key={index} className="flex gap-2 items-end">
                        <div className="flex-1 space-y-1">
                            <Label className={index !== 0 ? "sr-only" : ""}>Nom</Label>
                            <Input 
                                placeholder="Ex: Loyer" 
                                value={expense.name}
                                onChange={(e) => updateExpense(index, 'name', e.target.value)}
                            />
                        </div>
                        <div className="w-24 space-y-1">
                             <Label className={index !== 0 ? "sr-only" : ""}>Montant</Label>
                            <Input 
                                type="number" 
                                placeholder="0.00" 
                                value={expense.amount}
                                onChange={(e) => updateExpense(index, 'amount', e.target.value)}
                            />
                        </div>
                         <div className="w-32 space-y-1">
                             <Label className={index !== 0 ? "sr-only" : ""}>Fréquence</Label>
                            <Select 
                                value={expense.periodicity} 
                                onValueChange={(val: string) => updateExpense(index, 'periodicity', val)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="monthly">Mensuel</SelectItem>
                                <SelectItem value="yearly">Annuel</SelectItem>
                              </SelectContent>
                            </Select>
                        </div>
                    </div>
                ))}
                <Button variant="outline" size="sm" onClick={addExpenseRow} className="w-full mt-2">
                    <Icons.plus className="mr-2 h-4 w-4" /> Ajouter une charge
                </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
           {step === 2 && (
               <Button variant="ghost" onClick={() => setStep(1)}>Précédent</Button>
           )}
           <div className="flex-1"></div>
           <Button onClick={step === 1 ? handleStep1 : handleStep2} disabled={loading}>
            {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            {step === 1 ? 'Suivant' : 'Terminer'}
            {step === 1 && <Icons.chevronRight className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
