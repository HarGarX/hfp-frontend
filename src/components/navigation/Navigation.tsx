'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  CreditCard, 
  ArrowRightLeft, 
  FolderOpen, 
  Target, 
  TrendingUp, 
  CreditCard as LoanIcon,
  Bell,
  BarChart3,
  Settings,
  User,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  description?: string;
}

interface NavigationSection {
  id: string;
  label: string;
  items: NavigationItem[];
}

const navigationSections: NavigationSection[] = [
  {
    id: 'main',
    label: 'Main',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/',
        icon: Home,
        description: 'Overview of your finances'
      },
    ]
  },
  {
    id: 'finance',
    label: 'Financial Management',
    items: [
      {
        id: 'accounts',
        label: 'Accounts',
        href: '/accounts',
        icon: CreditCard,
        description: 'Manage your bank accounts'
      },
      {
        id: 'transactions',
        label: 'Transactions',
        href: '/transactions',
        icon: ArrowRightLeft,
        description: 'Track your transactions'
      },
      {
        id: 'categories',
        label: 'Categories',
        href: '/categories',
        icon: FolderOpen,
        description: 'Organize transaction categories'
      }
    ]
  },
  {
    id: 'planning',
    label: 'Planning & Goals',
    items: [
      {
        id: 'goals',
        label: 'Goals',
        href: '/goals',
        icon: Target,
        description: 'Track your financial goals'
      },
      {
        id: 'insights',
        label: 'Insights',
        href: '/insights',
        icon: TrendingUp,
        description: 'Financial insights and analytics'
      }
    ]
  },
  {
    id: 'debt',
    label: 'Debt Management',
    items: [
      {
        id: 'loans',
        label: 'Loans & BNPL',
        href: '/loans',
        icon: LoanIcon,
        description: 'Manage loans and buy-now-pay-later'
      }
    ]
  },
  {
    id: 'tools',
    label: 'Tools & Reports',
    items: [
      {
        id: 'reports',
        label: 'Reports',
        href: '/reports',
        icon: BarChart3,
        description: 'Financial reports and exports'
      },
      {
        id: 'notifications',
        label: 'Notifications',
        href: '/notifications',
        icon: Bell,
        description: 'Alerts and notifications'
      }
    ]
  }
];

const userMenuItems: NavigationItem[] = [
  {
    id: 'profile',
    label: 'Profile',
    href: '/profile',
    icon: User,
    description: 'Manage your profile'
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'App settings and preferences'
  }
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const isActiveItem = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out z-50",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="font-bold text-xl text-gray-900">HFP</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-8">
          {navigationSections.map((section) => (
            <div key={section.id}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {section.label}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActiveItem(item.href);
                  
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-blue-100 text-blue-900 border border-blue-200"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      )}
                    >
                      <Icon className={cn(
                        "w-5 h-5 mr-3",
                        isActive ? "text-blue-600" : "text-gray-400"
                      )} />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className={cn(
                          "px-2 py-1 text-xs rounded-full",
                          isActive
                            ? "bg-blue-200 text-blue-800"
                            : "bg-gray-200 text-gray-600"
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Menu */}
        <div className="p-4 border-t border-gray-200">
          <div className="space-y-1">
            {userMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveItem(item.href);
              
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-3 text-gray-400" />
              Logout
            </button>
                >
                  <Icon className="w-4 h-4 mr-3 text-gray-400" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

interface TopBarProps {
  onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  
  const getPageTitle = () => {
    const allItems = navigationSections.flatMap(section => section.items);
    const currentItem = allItems.find(item => item.href === pathname || (item.href !== '/' && pathname.startsWith(item.href)));
    return currentItem?.label || 'Dashboard';
  };

  const getPageDescription = () => {
    const allItems = navigationSections.flatMap(section => section.items);
    const currentItem = allItems.find(item => item.href === pathname || (item.href !== '/' && pathname.startsWith(item.href)));
    return currentItem?.description;
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
            {getPageDescription() && (
              <p className="text-sm text-gray-600 mt-1">{getPageDescription()}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </Button>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            {user && (
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

interface BreadcrumbsProps {
  items?: Array<{
    label: string;
    href?: string;
  }>;
}

export function Breadcrumbs({ items = [] }: BreadcrumbsProps) {
  const pathname = usePathname();
  
  // Auto-generate breadcrumbs if not provided
  const breadcrumbs = items.length > 0 ? items : (() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const crumbs = [{ label: 'Home', href: '/' }];
    
    pathSegments.forEach((segment, index) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/');
      const label = segment.charAt(0).toUpperCase() + segment.slice(1);
      crumbs.push({ label, href });
    });
    
    return crumbs;
  })();

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav className="px-6 py-3 bg-gray-50 border-b border-gray-200">
      <ol className="flex items-center space-x-2 text-sm">
        {breadcrumbs.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-gray-400">/</span>
            )}
            {item.href && index < breadcrumbs.length - 1 ? (
              <Link 
                href={item.href} 
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}