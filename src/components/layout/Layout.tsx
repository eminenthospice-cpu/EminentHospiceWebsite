'use client';

import { TooltipProvider } from '@/components/ui/primitives/Tooltip';
import { Header } from './Header';
import { Footer } from './Footer';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={300} skipDelayDuration={150}>
      <div className="flex flex-col min-h-dvh">
        <Header />
        <main id="main-content" className="flex-1 focus:outline-none" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </div>
    </TooltipProvider>
  );
}
