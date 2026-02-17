import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowUpRight, 
  Settings, 
  PieChart 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  
  return (
    <aside className="hidden lg:flex w-64 bg-background border-r border-border flex-col p-6 sticky top-0 h-screen">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
          <Wallet className="h-6 w-6" />
        </div>
        <span className="text-xl font-bold tracking-tight">Monely</span>
      </div>
      
      <nav className="flex-1 space-y-2">
        <NavItem to="/" icon={LayoutDashboard} label="Tableau de Bord" />
        <NavItem to="/wallets" icon={Wallet} label="Portefeuilles" />
        <NavItem to="/transactions" icon={ArrowUpRight} label="Transactions" />
        <NavItem to="/analytics" icon={PieChart} label="Analytiques" />
        <NavItem to="/settings" icon={Settings} label="Paramètres" />
      </nav>

      <div className="mt-auto pt-6 border-t border-border flex items-center gap-3">
        {user?.avatar_url ? (
            <img src={user.avatar_url} className="w-10 h-10 rounded-full border-2 border-background shadow-sm" alt="Profile" />
        ) : (
             <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center border-2 border-background shadow-sm">
                <span className="text-sm font-semibold text-muted-foreground">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
             </div>
        )}
        <div className="overflow-hidden">
          <p className="text-sm font-bold truncate">{user?.name || 'Utilisateur'}</p>
          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
        </div>
      </div>
    </aside>
  );
};

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
}

const NavItem = ({ icon: Icon, label, to }: NavItemProps) => (
  <NavLink 
    to={to} 
    end={to === "/"}
    className={({ isActive }) => cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group",
      isActive 
        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" 
        : "text-muted-foreground hover:bg-white hover:text-primary hover:shadow-sm"
    )}
  >
    <Icon className="h-5 w-5" />
    <span className="text-sm">{label}</span>
  </NavLink>
);

export default Sidebar;
