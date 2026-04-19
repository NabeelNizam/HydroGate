'use client';

import { Bell, User, LogOut } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="ml-64 bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Left Side - Title */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Dam Gate Monitoring System</h2>
          <p className="text-sm text-slate-500 mt-1">Real-time monitoring and control dashboard</p>
        </div>

        {/* Right Side - User & Notifications */}
        <div className="flex items-center gap-6">
          {/* Notifications */}
          <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors duration-200 group">
            <Bell size={24} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            <div className="absolute right-0 top-12 hidden group-hover:block bg-white rounded-lg shadow-lg p-3 min-w-48 border border-slate-200">
              <p className="text-xs font-semibold text-slate-700 mb-2">Notifications</p>
              <div className="space-y-2 text-xs text-slate-600">
                <p>⚠️ Water level high (Alert)</p>
                <p>✓ Gate A maintenance done</p>
              </div>
            </div>
          </button>

          {/* Divider */}
          <div className="h-6 w-px bg-slate-200"></div>

          {/* User Profile */}
          <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors duration-200 group">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">Admin</p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>

            {/* Dropdown Menu */}
            <div className="absolute right-8 top-16 hidden group-hover:block bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden">
              <button className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 text-left flex items-center gap-2">
                <User size={16} />
                Profile
              </button>
              <button className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 text-left flex items-center gap-2 border-t border-slate-200">
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
