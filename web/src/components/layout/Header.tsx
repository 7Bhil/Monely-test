import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-8 py-4 flex items-center justify-between border-b lg:border-none border-border">
      <div className="lg:hidden flex items-center gap-2">
         <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
         </Button>
      </div>
      
      <div className="flex-1 max-w-lg mx-4 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            type="text" 
            placeholder="Rechercher..." 
            className="w-full pl-9 rounded-full bg-muted/50 border-transparent focus:bg-background transition-all"
          />
        </div>
      </div>

      <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground rounded-full">
        <Bell className="h-5 w-5" />
        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-destructive rounded-full border-2 border-background"></span>
      </Button>
    </header>
  );
};

export default Header;
