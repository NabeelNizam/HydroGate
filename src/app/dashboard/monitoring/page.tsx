'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

import {
  Activity,
  Waves,
  Ruler,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';

type DynamoItem = {
  device_id?: string;
  jarak_cm?: number | string;
  hcsr_cm?: number | string;
  water_level?: number | string;
  water_status?: string;
  status?: string;
  gate_status?: string;
  servo_angle?: number | string;
  source?: string;
  timestamp?: string | number;
  createdAt?: string | number;
};

interface MonitoringData {
  gateId: string;
  waterLevel: number;
  ultrasonicCm: number;
  waterStatus: string;
  systemStatus: string;
  gateStatus: 'open' | 'half' | 'closed';
  gateLabel: string;
  servoAngle: number;
  lastUpdate: string;
}

function formatLastUpdate(value?: string | number) {
  if (!value) return '-';

  const asNumber = Number(value);

  if (!Number.isNaN(asNumber) && asNumber > 1000000000000) {
    return new Date(asNumber).toLocaleTimeString('id-ID');
  }

  return String(value);
}

export default function Monitoring() {
  const [items, setItems] = useState<DynamoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDynamoData = useCallback(async () => {
    try {
      const res = await fetch('/api/dynamodb', {
        cache: 'no-store',
      });

      const json: {
        items?: DynamoItem[];
        error?: string;
        detail?: string;
      } = await res.json();

      if (!res.ok) {
        throw new Error(json.detail || json.error || 'Gagal mengambil data');
      }

      setItems(json.items || []);
      setError('');
    } catch (err: unknown) {
      console.error('Fetch DynamoDB error:', err);
      setItems([]);
      setError(
        err instanceof Error ? err.message : 'Gagal mengambil data DynamoDB'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchDynamoData();
    }, 0);

    const interval = setInterval(() => {
      void fetchDynamoData();
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [fetchDynamoData]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const dateA = Number(a.timestamp || a.createdAt || 0);
      const dateB = Number(b.timestamp || b.createdAt || 0);

      return dateB - dateA;
    });
  }, [items]);

  const physicalItems = useMemo(() => {
    return sortedItems.filter((item) => item.device_id === 'ESP-001');
  }, [sortedItems]);

  const monitoringData: MonitoringData[] = useMemo(() => {
    return physicalItems.map((item, index) => {
      const ultrasonicCm =
        parseFloat(String(item.hcsr_cm ?? item.jarak_cm ?? 0)) || 0;

      const waterLevel =
        parseFloat(String(item.water_level ?? 0)) || 0;

      const servoAngle =
        parseFloat(String(item.servo_angle ?? 0)) || 0;

      const rawGateStatus = String(item.gate_status ?? item.status ?? 'AMAN');

      const gateStatus =
        rawGateStatus === 'BAHAYA'
          ? 'open'
          : rawGateStatus === 'SIAGA'
            ? 'half'
            : 'closed';

      const gateLabel =
        rawGateStatus === 'BAHAYA'
          ? 'Terbuka'
          : rawGateStatus === 'SIAGA'
            ? 'Separuh Terbuka'
            : 'Tertutup';

      return {
        gateId: item.device_id || `Gate-${index + 1}`,
        waterLevel,
        ultrasonicCm,
        waterStatus: String(item.water_status ?? '-'),
        systemStatus: String(item.status ?? '-'),
        gateStatus,
        gateLabel,
        servoAngle,
        lastUpdate: formatLastUpdate(item.timestamp || item.createdAt),
      };
    });
  }, [physicalItems]);

  const latest = monitoringData[0];

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />

      <main className="flex-1 ml-64">
        <Navbar />

        <div className="p-8">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Monitoring Real-time
              </h1>

              <p className="text-gray-600">
                Data fisik ESP-001 dari AWS IoT dan DynamoDB
              </p>
            </div>

            <button
              onClick={fetchDynamoData}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-300"
            >
              <RefreshCw
                size={16}
                className={loading ? 'animate-spin' : ''}
              />
              Refresh
            </button>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <b>Error:</b> {error}
            </div>
          )}

          {loading && (
            <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
              Mengambil data terbaru dari DynamoDB...
            </div>
          )}

          {!loading && monitoringData.length === 0 && (
            <div className="mb-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-700">
              Data monitoring ESP-001 masih kosong.
            </div>
          )}

          {latest && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Status Gate</p>

                    <p
                      className={`text-3xl font-bold mt-1 ${latest.gateStatus === 'open'
                        ? 'text-red-600'
                        : latest.gateStatus === 'half'
                          ? 'text-yellow-600'
                          : 'text-emerald-600'
                        }`}
                    >
                      {latest.gateLabel}
                    </p>
                  </div>

                  <Activity className="w-10 h-10 text-cyan-500" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Water Level</p>

                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {latest.waterLevel}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {latest.waterStatus}
                    </p>
                  </div>

                  <Waves className="w-10 h-10 text-blue-500" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Ultrasonik</p>

                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {latest.ultrasonicCm.toFixed(1)} cm
                    </p>
                  </div>

                  <Ruler className="w-10 h-10 text-indigo-500" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Status Sistem</p>

                    <p
                      className={`text-3xl font-bold mt-1 ${latest.systemStatus === 'BAHAYA'
                        ? 'text-red-600'
                        : latest.systemStatus === 'SIAGA'
                          ? 'text-yellow-600'
                          : 'text-emerald-600'
                        }`}
                    >
                      {latest.systemStatus}
                    </p>
                  </div>

                  <CheckCircle className="w-10 h-10 text-emerald-500" />
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Monitoring Pintu Air
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Device
                    </th>

                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Water Level
                    </th>

                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Ultrasonik
                    </th>

                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Status Air
                    </th>

                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Status Gate
                    </th>

                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Servo
                    </th>

                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Update Terakhir
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {monitoringData.map((gate, index) => (
                    <tr
                      key={`${gate.gateId}-${gate.lastUpdate}-${index}`}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">
                          {gate.gateId}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-gray-700">
                          {gate.waterLevel}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-gray-700">
                          {gate.ultrasonicCm.toFixed(1)} cm
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${gate.waterStatus === 'MERAH'
                            ? 'bg-red-100 text-red-700'
                            : gate.waterStatus === 'KUNING'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-emerald-100 text-emerald-700'
                            }`}
                        >
                          {gate.waterStatus}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${gate.gateStatus === 'open'
                            ? 'bg-red-100 text-red-700'
                            : gate.gateStatus === 'half'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-emerald-100 text-emerald-700'
                            }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${gate.gateStatus === 'open'
                              ? 'bg-red-500'
                              : gate.gateStatus === 'half'
                                ? 'bg-yellow-500'
                                : 'bg-emerald-500'
                              }`}
                          />

                          {gate.gateLabel}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-gray-700">
                          {gate.servoAngle}°
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-gray-600 text-sm">
                          {gate.lastUpdate}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {!loading && monitoringData.length === 0 && (
                <div className="p-6 text-sm text-gray-500">
                  Belum ada data untuk ditampilkan.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}