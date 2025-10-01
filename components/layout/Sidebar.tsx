'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Code,
  Building2,
  Menu as MenuIcon,
  FileText,
  Users,
  Trophy,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

const navItems: NavItem[] = [
  { id: 'systems', label: 'Systems', icon: <Settings size={16} />, href: '/systems' },
  { id: 'system-code', label: 'System Code', icon: <Code size={16} />, href: '/system-code' },
  { id: 'properties', label: 'Properties', icon: <Building2 size={16} />, href: '/properties' },
  { id: 'menus', label: 'Menus', icon: <MenuIcon size={16} />, href: '/menus' },
  { id: 'api-list', label: 'API List', icon: <FileText size={16} />, href: '/api-list' },
  { id: 'users-group', label: 'Users & Group', icon: <Users size={16} />, href: '/users-group' },
  { id: 'competition', label: 'Competition', icon: <Trophy size={16} />, href: '/competition' },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();

  // Close mobile drawer on route change
  useEffect(() => {
    if (onClose) {
      onClose();
    }
  }, [pathname, onClose]);

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen && onClose) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Mobile Overlay */}
      {onClose && (
        <div
          className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          background: '#1a2332',
        }}
        className={`fixed left-0 top-0 bottom-0 w-[232px] flex flex-col z-50 transition-transform duration-300 ease-in-out
          ${onClose ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
          lg:translate-x-0 lg:rounded-tr-3xl
        `}
      >
        {/* Header/Logo Row */}
        <div className="h-[72px] flex items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--accent)' }}>
              <span style={{ color: 'var(--accent-fg)' }} className="font-bold text-sm">C</span>
            </div>
            <span style={{ color: '#ffffff' }} className="font-semibold text-base">CLOIT</span>
          </div>

          {/* Mobile close button / Hamburger */}
          {onClose ? (
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              style={{ color: 'var(--sidebar-ico)' }}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          ) : (
            <button
              className="p-2 rounded-lg transition-colors hover:bg-white/5"
              style={{ color: '#ffffff' }}
              aria-label="Menu"
            >
              <MenuIcon size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-2">
          <div className="space-y-0">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const isSystemsItem = item.id === 'systems';
              const isUsersGroup = item.id === 'users-group';

              return (
                <div key={item.id} className={isUsersGroup ? 'mt-4' : ''}>
                  {isActive ? (
                    <Link
                      href={item.href}
                      className="flex items-center h-[44px] px-4 gap-3 rounded-[22px] transition-colors font-bold text-sm touch-manipulation"
                      style={{
                        background: '#8fdc3c',
                        color: '#000000',
                      }}
                    >
                      <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  ) : isSystemsItem ? (
                    <Link
                      href={item.href}
                      className="flex items-center h-[44px] px-4 gap-3 rounded-lg transition-colors font-normal text-sm hover:bg-white/5 touch-manipulation ml-[20px]"
                      style={{
                        background: '#252f3e',
                        color: 'rgba(255, 255, 255, 0.9)'
                      }}
                    >
                      <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  ) : (
                    <Link
                      href={item.href}
                      className="flex items-center h-[44px] px-4 gap-3 rounded-lg transition-colors font-normal text-sm hover:bg-white/5 touch-manipulation ml-[20px]"
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)'
                      }}
                    >
                      <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
}
