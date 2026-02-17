import { type ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-muted/40 border-collapse">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden w-full">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 w-full pb-20 lg:pb-6">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
