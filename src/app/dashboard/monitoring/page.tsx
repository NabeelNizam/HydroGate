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
  Trash2,
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
  datetime?: string;
  unix_time?: number | string;
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

function getItemTime(item: DynamoItem) {
  if (item.unix_time) {
    return Number(item.unix_time);
  }

  if (item.datetime) {
    return Math.floor(new Date(item.datetime.replace(' ', 'T')).getTime() / 1000);
  }

  if (item.createdAt) {
    return Number(item.createdAt);
  }

  return Number(item.timestamp || 0);
}

function formatLastUpdate(item: DynamoItem) {
  if (item.datetime) return item.datetime;

  if (item.unix_time) {
    return new Date(Number(item.unix_time) * 1000).toLocaleString('id-ID');
  }

  if (item.createdAt) {
    const asNumber = Number(item.createdAt);

    if (!Number.isNaN(asNumber) && asNumber > 1000000000000) {
      return new Date(asNumber).toLocaleString('id-ID');
    }

    return String(item.createdAt);
  }

  if (item.timestamp) {
    return String(item.timestamp);
  }

  return '-';
}

export default function Monitoring() {
  const [items, setItems] = useState<DynamoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
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

  const clearAllData = async () => {
    const confirmed = confirm('Yakin ingin menghapus SEMUA data monitoring?');

    if (!confirmed) return;

    try {
      setClearing(true);

      const res = await fetch('/api/dynamodb/clear', {
        method: 'DELETE',
      });

      const json: {
        success?: boolean;
        error?: string;
      } = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Gagal menghapus data');
      }

      setItems([]);
      setError('');
    } catch (err: unknown) {
      console.error('Clear DynamoDB error:', err);
      alert(err instanceof Error ? err.message : 'Gagal menghapus data');
    } finally {
      setClearing(false);
    }
  };

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
      return getItemTime(b) - getItemTime(a);
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
        lastUpdate: formatLastUpdate(item),
      };
    });
  }, [physicalItems]);

  const latest = monitoringData[0];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="ml-64 flex-1">
        <Navbar />

        <div className="p-8">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                Monitoring Real-time
              </h1>

              <p className="text-gray-600">
                Data fisik ESP-001 dari AWS IoT dan DynamoDB
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={clearAllData}
                disabled={loading || clearing}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700 disabled:bg-red-300"
              >
                <Trash2 size={16} />
                {clearing ? 'Clearing...' : 'CLEAR ALL DATA'}
              </button>

              <button
                onClick={fetchDynamoData}
                disabled={loading || clearing}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-300"
              >
                <RefreshCw
                  size={16}
                  className={loading ? 'animate-spin' : ''}
                />
                Refresh
              </button>
            </div>
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
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Status Gate</p>

                    <p
                      className={`mt-1 text-3xl font-bold ${latest.gateStatus === 'open'
                          ? 'text-red-600'
                          : latest.gateStatus === 'half'
                            ? 'text-yellow-600'
                            : 'text-emerald-600'
                        }`}
                    >
                      {latest.gateLabel}
                    </p>
                  </div>

                  <Activity className="h-10 w-10 text-cyan-500" />
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Water Level</p>

                    <p className="mt-1 text-3xl font-bold text-gray-900">
                      {latest.waterLevel}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {latest.waterStatus}
                    </p>
                  </div>

                  <Waves className="h-10 w-10 text-blue-500" />
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Ultrasonik</p>

                    <p className="mt-1 text-3xl font-bold text-gray-900">
                      {latest.ultrasonicCm.toFixed(1)} cm
                    </p>
                  </div>

                  <Ruler className="h-10 w-10 text-indigo-500" />
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Status Sistem</p>

                    <p
                      className={`mt-1 text-3xl font-bold ${latest.systemStatus === 'BAHAYA'
                          ? 'text-red-600'
                          : latest.systemStatus === 'SIAGA'
                            ? 'text-yellow-600'
                            : 'text-emerald-600'
                        }`}
                    >
                      {latest.systemStatus}
                    </p>
                  </div>

                  <CheckCircle className="h-10 w-10 text-emerald-500" />
                </div>
              </div>
            </div>
          )}

          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Monitoring Pintu Air
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
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
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${gate.waterStatus === 'MERAH'
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
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${gate.gateStatus === 'open'
                              ? 'bg-red-100 text-red-700'
                              : gate.gateStatus === 'half'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${gate.gateStatus === 'open'
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
                        <span className="text-sm text-gray-600">
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