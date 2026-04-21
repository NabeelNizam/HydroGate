'use client';

import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Clock, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  description: string;
  gateId?: string;
}

export default function Logs() {
  const [logs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: '2026-04-20 14:32:15',
      type: 'success',
      title: 'Main Gate Dibuka',
      description: 'Main Gate dibuka secara manual oleh operator',
      gateId: 'Main Gate',
    },
    {
      id: '2',
      timestamp: '2026-04-20 14:25:08',
      type: 'warning',
      title: 'Ketinggian Air Meningkat',
      description: 'Ketinggian air mencapai 2.8m, mendekati batas aman 3.5m',
      gateId: 'Main Gate',
    },
    {
      id: '3',
      timestamp: '2026-04-20 14:15:42',
      type: 'info',
      title: 'Update Data Sensor',
      description: 'Data dari sensor Main Gate berhasil diperbarui',
    },
    {
      id: '4',
      timestamp: '2026-04-20 14:05:19',
      type: 'success',
      title: 'Main Gate Dikontrol Otomatis',
      description: 'Main Gate diatur ke posisi optimal sesuai algoritma kontrol',
      gateId: 'Main Gate',
    },
    {
      id: '5',
      timestamp: '2026-04-20 13:55:33',
      type: 'info',
      title: 'Sinkronisasi Basis Data',
      description: 'Basis data sistem berhasil disinkronkan dengan server cloud',
    },
    {
      id: '6',
      timestamp: '2026-04-20 13:40:22',
      type: 'warning',
      title: 'Sensor Akurasi Menurun',
      description: 'Sensor Main Gate menunjukkan drift kecil dalam pembacaan ketinggian air',
      gateId: 'Main Gate',
    },
    {
      id: '7',
      timestamp: '2026-04-20 13:35:11',
      type: 'success',
      title: 'Kalibrasi Sensor Selesai',
      description: 'Sensor Main Gate berhasil dikalibrasi ulang dan akurat',
      gateId: 'Main Gate',
    },
    {
      id: '8',
      timestamp: '2026-04-20 13:20:05',
      type: 'info',
      title: 'Sistem Siap',
      description: 'Inisialisasi sistem monitoring selesai, semua komponen berfungsi normal',
    },
  ]);

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="flex bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-64">
        <Navbar />
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Activity Log</h1>
            <p className="text-gray-600">Riwayat aktivitas sistem dan perubahan status pintu</p>
          </div>

          {/* Filter Options */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex gap-4">
            <input
              type="date"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
              <option>Semua Tipe</option>
              <option>Info</option>
              <option>Warning</option>
              <option>Error</option>
              <option>Success</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
              <option>Semua Pintu</option>
              <option>Main Gate</option>
            </select>
          </div>

          {/* Logs Timeline */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Timeline Aktivitas</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {logs.map((log, index) => (
                <div key={log.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 pt-1">{getLogIcon(log.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <h3 className="font-semibold text-gray-900">{log.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{log.description}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-gray-500 font-mono">{log.timestamp}</p>
                          {log.gateId && (
                            <span className="inline-block mt-2 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                              {log.gateId}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-blue-600 text-xs font-medium mb-2">Info</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <p className="text-yellow-600 text-xs font-medium mb-2">Peringatan</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <p className="text-red-600 text-xs font-medium mb-2">Error</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
              <p className="text-emerald-600 text-xs font-medium mb-2">Sukses</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
