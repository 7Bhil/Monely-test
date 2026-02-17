import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Icons } from '@/components/ui/icons';

interface AddWalletModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddWalletModal({ open, onOpenChange, onSuccess }: AddWalletModalProps) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [type, setType] = useState('checking');
  const [color, setColor] = useState('blue');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
        setName('');
        setBalance('');
        setColor('blue');
        setError(null);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || '/api/'}wallets/wallets/`, {
        name,
        balance: parseFloat(balance),
        type,
        currency: user?.currency || 'XOF',
        color,
        icon: 'account_balance'
      });
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to create wallet", error);
      setError(error.response?.data?.detail || "Erreur lors de la création du portefeuille");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nouveau Portefeuille</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du portefeuille</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Compte Courant" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="balance">Solde initial</Label>
            <Input id="balance" type="number" value={balance} onChange={(e) => setBalance(e.target.value)} placeholder="0" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checking">Compte Courant</SelectItem>
                <SelectItem value="savings">Épargne</SelectItem>
                <SelectItem value="investment">Investissement</SelectItem>
                <SelectItem value="cash">Espèces</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Couleur</Label>
            <div className="flex gap-2">
                {['blue', 'green', 'yellow', 'red', 'purple', 'slate'].map(c => (
                    <button 
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${color === c ? 'border-primary ring-2 ring-primary/20 scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: c === 'blue' ? '#3b82f6' : c === 'green' ? '#10b981' : c === 'yellow' ? '#f59e0b' : c === 'red' ? '#ef4444' : c === 'purple' ? '#8b5cf6' : '#64748b' }}
                    />
                ))}
            </div>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <DialogFooter className="pt-4">
            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Créer le portefeuille
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
