'use client';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import StatusCard from './components/StatusCard';
import WaterLevelChart from './components/WaterLevelChart';
import GateControlPanel from './components/GateControlPanel';
import ActivityLog from './components/ActivityLog';
import { Droplet, Lock, Zap, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="flex bg-slate-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Navbar */}
        <Navbar />

        {/* Dashboard Content */}
        <div className="p-8">
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatusCard
              title="Water Level"
              value={65}
              unit="meters"
              icon="💧"
              status="normal"
              trend="up"
              trendValue="+1.2m"
            />
            <StatusCard
              title="Gate Status"
              value="1"
              unit="Active"
              icon="🚪"
              status="normal"
              trend="down"
              trendValue="Auto-Controlled"
            />
            <StatusCard
              title="Flow Rate"
              value={1500}
              unit="m³/s"
              icon="⚡"
              status="normal"
              trend="up"
              trendValue="+50 m³/s"
            />
            <StatusCard
              title="Alerts"
              value={0}
              unit="Active"
              icon="⚠️"
              status="normal"
              trend="down"
              trendValue="All clear"
            />
          </div>

          {/* Charts and Control Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Water Level Chart - Takes 2 columns */}
            <div className="lg:col-span-2">
              <WaterLevelChart />
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              {/* System Health */}
              <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
                <h3 className="text-lg font-bold text-slate-900 mb-4">System Health</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <span className="text-sm font-medium text-slate-700">Uptime</span>
                    <span className="text-sm font-bold text-green-600">99.98%</span>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <span className="text-sm font-medium text-slate-700">CPU Usage</span>
                    <span className="text-sm font-bold text-blue-600">42%</span>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <span className="text-sm font-medium text-slate-700">Memory</span>
                    <span className="text-sm font-bold text-blue-600">67%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Sensors</span>
                    <span className="text-sm font-bold text-green-600">All OK</span>
                  </div>
                </div>
              </div>

              {/* Alert Summary */}
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border-2 border-red-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
                <h3 className="text-lg font-bold text-slate-900 mb-4">⚠️ Active Alerts</h3>
                <div className="space-y-3">
                  <div className="text-sm">
                    <p className="font-semibold text-red-700">Critical: Water Level High</p>
                    <p className="text-xs text-red-600 mt-1">Level exceeded 82m threshold</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-orange-700">Warning: Flow Anomaly</p>
                    <p className="text-xs text-orange-600 mt-1">Gate B outlet pressure unusual</p>
                  </div>
                </div>
                <button className="w-full mt-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200">
                  View All Alerts
                </button>
              </div>
            </div>
          </div>

          {/* Gate Control Panel */}
          <div className="mb-8">
            <GateControlPanel />
          </div>

          {/* Activity Log and Footer */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ActivityLog />
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                    <Lock size={18} />
                    Emergency Close All
                  </button>
                  <button className="w-full py-2 px-4 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                    📊 Generate Report
                  </button>
                  <button className="w-full py-2 px-4 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                    🔧 System Settings
                  </button>
                  <button className="w-full py-2 px-4 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                    📞 Contact Support
                  </button>
                </div>
              </div>

              {/* Key Information */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-3">ℹ️ Key Information</h3>
                <div className="text-xs text-slate-700 space-y-2">
                  <p><span className="font-semibold">Capacity:</span> 100m</p>
                  <p><span className="font-semibold">Max Flow:</span> 5000 m³/s</p>
                  <p><span className="font-semibold">Last Update:</span> Just now</p>
                  <p><span className="font-semibold">Next Inspection:</span> 15 days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-slate-200 text-center text-sm text-slate-500">
            <p>HydroGate © 2024 | Dam Gate Monitoring System | Status: <span className="text-green-600 font-semibold">● Online</span></p>
          </footer>
        </div>
      </main>
    </div>
  );
}
