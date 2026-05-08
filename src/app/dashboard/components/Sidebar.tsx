'use client';

import { LayoutDashboard, BarChart3, ClipboardList, Settings, Activity } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { id: 'monitoring', icon: Activity, label: 'Monitoring', href: '/dashboard/monitoring' },
    { id: 'reports', icon: BarChart3, label: 'Reports', href: '/dashboard/reports' },
    { id: 'logs', icon: ClipboardList, label: 'Logs', href: '/dashboard/logs' },
    { id: 'settings', icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl flex flex-col h-screen fixed left-0 top-0 border-r border-slate-700">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">
            ⚙️
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">HydroGate</h1>
            <p className="text-xs text-slate-400">Dam Monitoring</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                active
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <div className="bg-slate-700 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-300">System Status</p>
          <p className="text-sm font-bold text-green-400 mt-1">● Online</p>
        </div>
      </div>
    </aside>
  );
}
