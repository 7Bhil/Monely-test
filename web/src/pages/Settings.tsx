import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Paramètres</h2>

      <Card>
        <CardHeader>
          <CardTitle>Profil Utilisateur</CardTitle>
          <CardDescription>Gérez vos informations personnelles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Nom complet</Label>
            <Input defaultValue={user?.name} disabled />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input defaultValue={user?.email} disabled />
          </div>
           <div className="space-y-2">
            <Label>Devise</Label>
            <Input defaultValue={user?.currency} disabled />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
          <Button variant="destructive" onClick={logout}>
              Se déconnecter
          </Button>
      </div>
    </div>
  );
}
