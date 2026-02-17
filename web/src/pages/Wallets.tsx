import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { AddWalletModal } from '@/components/modals/AddWalletModal';

interface Wallet {
  id: number;
  name: string;
  balance: number;
  currency: string;
  type: string;
  color: string;
}

export default function WalletsPage() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchWallets = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/'}wallets/wallets/`);
      setWallets(response.data.results || response.data);
    } catch (error) {
      console.error("Failed to fetch wallets", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  if (loading) {
    return <div className="p-8 flex justify-center"><Icons.spinner className="animate-spin h-8 w-8" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Mes Portefeuilles</h2>
        <Button onClick={() => setShowAddModal(true)}>
          <Icons.plus className="mr-2 h-4 w-4" />
          Nouveau Portefeuille
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {wallets.map((wallet) => (
          <Card key={wallet.id} className="relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full bg-${wallet.color || 'blue'}-500`} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {wallet.name}
              </CardTitle>
              <Icons.creditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: wallet.currency }).format(Number(wallet.balance))}
              </div>
              <p className="text-xs text-muted-foreground capitalize mt-1">
                {wallet.type === 'checking' ? 'Compte Courant' : wallet.type === 'savings' ? 'Épargne' : wallet.type}
              </p>
            </CardContent>
          </Card>
        ))}
        
      </div>
      <AddWalletModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal} 
        onSuccess={fetchWallets} 
      />
    </div>
  );
}
