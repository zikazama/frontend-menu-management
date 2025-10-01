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
  ChevronLeft,
  ChevronRight,
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
  { id: 'systems', label: 'Systems', icon: <Settings size={20} />, href: '/systems' },
  { id: 'system-code', label: 'System Code', icon: <Code size={20} />, href: '/system-code' },
  { id: 'properties', label: 'Properties', icon: <Building2 size={20} />, href: '/properties' },
  { id: 'menus', label: 'Menus', icon: <MenuIcon size={20} />, href: '/menus' },
  { id: 'api-list', label: 'API List', icon: <FileText size={20} />, href: '/api-list' },
  { id: 'users-group', label: 'Users & Group', icon: <Users size={20} />, href: '/users-group' },
  { id: 'competition', label: 'Competition', icon: <Trophy size={20} />, href: '/competition' },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  // Close mobile drawer on route change
  useEffect(() => {
    if (onClose) {
      onClose();
    }
  }, [pathname]);

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
      {onClose && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-200"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 flex flex-col z-50 transition-all duration-200
          ${onClose ? 'lg:translate-x-0' : ''}
          ${onClose && !isOpen ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
          ${isCollapsed ? 'w-16 lg:w-16' : 'w-64 lg:w-60'}
        `}
      >
        {/* Brand/Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SM</span>
              </div>
              <span className="font-semibold text-gray-900">System</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* Desktop collapse button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 transition-colors min-w-[44px] min-h-[44px] items-center justify-center"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>

            {/* Mobile close button */}
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-3 lg:py-2.5 rounded-lg transition-all relative group min-h-[44px] ${
                      isActive
                        ? 'bg-green-50 text-green-700'
                        : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-green-600 rounded-r-full" />
                    )}

                    <span className={`flex-shrink-0 ${isCollapsed ? 'mx-auto' : ''}`}>
                      {item.icon}
                    </span>

                    {!isCollapsed && (
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
