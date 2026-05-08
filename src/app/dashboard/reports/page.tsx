'use client';

import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Calendar, Download, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface Report {
  id: string;
  title: string;
  period: string;
  date: string;
  type: 'daily' | 'weekly' | 'monthly';
  status: 'completed' | 'pending';
}

export default function Reports() {
  const [reports] = useState<Report[]>([
    {
      id: '1',
      title: 'Laporan Harian - 20 April 2026',
      period: '20 April 2026',
      date: '20 Apr 2026',
      type: 'daily',
      status: 'completed',
    },
    {
      id: '2',
      title: 'Laporan Mingguan - 14-20 April 2026',
      period: '14-20 April 2026',
      date: '20 Apr 2026',
      type: 'weekly',
      status: 'completed',
    },
    {
      id: '3',
      title: 'Laporan Bulanan - April 2026',
      period: 'April 2026',
      date: '30 Apr 2026',
      type: 'monthly',
      status: 'pending',
    },
    {
      id: '4',
      title: 'Laporan Harian - 19 April 2026',
      period: '19 April 2026',
      date: '19 Apr 2026',
      type: 'daily',
      status: 'completed',
    },
  ]);

  return (
    <div className="flex bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-64">
        <Navbar />
        <div className="p-8">
          {/* Header */}
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Laporan Sistem</h1>
              <p className="text-gray-600">Laporan operasional dan analisis data monitoring</p>
            </div>
            <button className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Laporan
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-lg border border-cyan-200">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600 text-sm font-medium">Ketinggian Air Main Gate</p>
                <TrendingUp className="w-5 h-5 text-cyan-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">2.45m</p>
              <p className="text-sm text-gray-600 mt-2">Stabil dalam 7 hari terakhir</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-lg border border-emerald-200">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600 text-sm font-medium">Uptime Sistem</p>
                <span className="text-xl font-bold text-emerald-600">99.8%</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">Excellent</p>
              <p className="text-sm text-gray-600 mt-2">Downtime minimal terdeteksi</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600 text-sm font-medium">Flow Rate Average</p>
                <span className="text-xl font-bold text-blue-600">1.2 GW</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">1,200 m³/s</p>
              <p className="text-sm text-gray-600 mt-2">Rata-rata per hari</p>
            </div>
          </div>

          {/* Reports List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Daftar Laporan</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {reports.map((report) => (
                <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <h3 className="font-semibold text-gray-900">{report.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 ml-8">{report.period}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          report.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {report.status === 'completed' ? 'Selesai' : 'Sedang Diproses'}
                      </span>
                      <button className="text-cyan-600 hover:text-cyan-700 p-2 rounded hover:bg-gray-100 transition-colors">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
