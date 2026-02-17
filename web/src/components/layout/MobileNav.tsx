import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowUpRight, 
  Settings, 
  Plus,
  PieChart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const MobileNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between border-t border-border bg-background/95 px-6 py-2 pb-safe backdrop-blur-md lg:hidden">
      <MobileNavItem to="/" icon={LayoutDashboard} label="Dash" />
      <MobileNavItem to="/wallets" icon={Wallet} label="Wallets" />
      
      <div className="relative -top-5">
        <Button 
          size="icon" 
          className="h-14 w-14 rounded-full border-4 border-background shadow-xl hover:scale-105 transition-transform"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
      
      <MobileNavItem to="/transactions" icon={ArrowUpRight} label="Transac" />
      <MobileNavItem to="/analytics" icon={PieChart} label="Stats" />
      <MobileNavItem to="/settings" icon={Settings} label="Config" />
    </nav>
  );
};

interface MobileNavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
}

const MobileNavItem = ({ to, icon: Icon, label }: MobileNavItemProps) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => cn(
      "flex flex-1 flex-col items-center gap-1 py-2 transition-all",
      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
    )}
  >
    {({ isActive }) => (
      <>
        <Icon className="h-5 w-5" />
        <span className={cn("text-[10px] font-medium", isActive && "font-bold")}>{label}</span>
      </>
    )}
  </NavLink>
);

export default MobileNav;
