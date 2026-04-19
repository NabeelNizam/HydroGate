'use client';

import { Bell, User, LogOut } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-8 py-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Dam Gate Monitoring System
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Real-time monitoring and control dashboard
          </p>
        </div>

        <div className="flex items-center gap-6">
          <button className="group relative rounded-lg p-2 text-slate-600 transition-colors duration-200 hover:bg-slate-100">
            <Bell size={24} />
            <span className="absolute right-1 top-1 h-2 w-2 animate-pulse rounded-full bg-red-500"></span>
            <div className="absolute right-0 top-12 hidden min-w-48 rounded-lg border border-slate-200 bg-white p-3 shadow-lg group-hover:block">
              <p className="mb-2 text-xs font-semibold text-slate-700">Notifications</p>
              <div className="space-y-2 text-xs text-slate-600">
                <p>⚠️ Water level high (Alert)</p>
                <p>✓ Gate A maintenance done</p>
              </div>
            </div>
          </button>

          <div className="h-6 w-px bg-slate-200"></div>

          <div className="group relative flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-slate-50">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-purple-600 text-sm font-bold text-white">
              A
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">Admin</p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>

            <div className="absolute right-0 top-16 hidden overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg group-hover:block">
              <button className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
                <User size={16} />
                Profile
              </button>
              <button className="flex w-full items-center gap-2 border-t border-slate-200 px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">
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