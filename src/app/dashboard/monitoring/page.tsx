'use client';

import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Activity, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface MonitoringData {
  gateId: string;
  waterLevel: number;
  status: 'open' | 'closed';
  flowRate: number;
  lastUpdate: string;
}

export default function Monitoring() {
  const [data, setData] = useState<MonitoringData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulasi data monitoring
    setData([
      {
        gateId: 'Main Gate',
        waterLevel: 2.45,
        status: 'open',
        flowRate: 1200,
        lastUpdate: new Date().toLocaleTimeString('id-ID'),
      },
    ]);
    setLoading(false);
  }, []);

  return (
    <div className="flex bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-64">
        <Navbar />
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Monitoring Real-time</h1>
            <p className="text-gray-600">Status terkini semua pintu air dan sistem</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Status Pintu</p>
                  <p className="text-3xl font-bold text-emerald-600 mt-1">Terbuka</p>
                </div>
                <Activity className="w-10 h-10 text-cyan-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Ketinggian Air</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">2.45m</p>
                </div>
                <TrendingUp className="w-10 h-10 text-emerald-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Flow Rate</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">1,200 m³/s</p>
                </div>
                <TrendingUp className="w-10 h-10 text-blue-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Status Sistem</p>
                  <p className="text-3xl font-bold text-emerald-600 mt-1">Normal</p>
                </div>
                <CheckCircle className="w-10 h-10 text-emerald-500" />
              </div>
            </div>
          </div>

          {/* Detailed Monitoring Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Main Gate - Status Monitoring</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nama Pintu</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Ketinggian Air</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status Operasi</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Flow Rate</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Update Terakhir</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.map((gate) => (
                    <tr key={gate.gateId} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">{gate.gateId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-700">{gate.waterLevel.toFixed(2)}m</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                            gate.status === 'open'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${gate.status === 'open' ? 'bg-emerald-500' : 'bg-gray-400'}`}
                          />
                          {gate.status === 'open' ? 'Terbuka' : 'Tertutup'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-700">{gate.flowRate} m³/s</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-600 text-sm">{gate.lastUpdate}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
