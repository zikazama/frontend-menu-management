'use client';

import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Mobile Navbar */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-30 flex items-center px-4 safe-area-inset-top"
        style={{ borderColor: 'var(--line)' }}>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-[var(--surface)]"
          aria-label="Open menu"
        >
          <Menu size={24} style={{ color: 'var(--text-700)' }} />
        </button>
        <div className="ml-3 flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--accent)' }}>
            <span style={{ color: 'var(--accent-fg)' }} className="font-bold text-sm">C</span>
          </div>
          <span style={{ color: 'var(--text-900)' }} className="font-semibold">CLOIT</span>
        </div>
      </nav>

      {/* Sidebar - Desktop persistent, Mobile drawer */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto transition-all duration-200 pt-16 lg:pt-0 lg:ml-[232px]">
        <div className="p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
