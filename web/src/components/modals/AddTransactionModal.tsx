import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Icons } from '@/components/ui/icons';

interface AddTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddTransactionModal({ open, onOpenChange, onSuccess }: AddTransactionModalProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Autre');
  const [walletId, setWalletId] = useState<string>('');
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setName('');
      setAmount('');
      setType('expense');
      setCategory('Autre');
      setWalletId('');
      setError(null);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/'}wallets/wallets/`)
        .then(res => setWallets(res.data.results || res.data))
        .catch(err => console.error("Failed to fetch wallets", err));
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletId) return;
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/'}transactions/transactions/`, {
        wallet: parseInt(walletId),
        name,
        amount: parseFloat(amount),
        type,
        category,
        date: new Date().toISOString(),
        status: 'completed'
      });
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to create transaction", error);
      setError(error.response?.data?.detail || "Erreur lors de l'ajout de la transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nouvelle Transaction</DialogTitle>
          <DialogDescription className="sr-only">
            Ajouter une nouvelle transaction à votre portefeuille.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="wallet">Portefeuille</Label>
            <Select value={walletId} onValueChange={setWalletId}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un portefeuille" />
              </SelectTrigger>
              <SelectContent>
                {wallets.map(w => (
                  <SelectItem key={w.id} value={w.id.toString()}>{w.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="t-name">Nom de la transaction</Label>
            <Input id="t-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Courses Monoprix" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Montant</Label>
            <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Dépense</SelectItem>
                  <SelectItem value="income">Revenu</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Shopping">Shopping</SelectItem>
                  <SelectItem value="Nourriture">Nourriture</SelectItem>
                  <SelectItem value="Loisirs">Loisirs</SelectItem>
                  <SelectItem value="Transport">Transport</SelectItem>
                  <SelectItem value="Santé">Santé</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <DialogFooter className="pt-4">
            <Button type="submit" disabled={loading || !walletId} className="w-full">
              {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Ajouter la transaction
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
