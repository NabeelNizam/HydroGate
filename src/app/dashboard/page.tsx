'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

import {
  Activity,
  Gauge,
  RefreshCw,
  Radio,
  ShieldCheck,
  Waves,
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

function formatTime(value?: string | number) {
  if (!value) return '-';

  const numberValue = Number(value);

  if (!Number.isNaN(numberValue) && numberValue > 1000000000000) {
    return new Date(numberValue).toLocaleString('id-ID');
  }

  return String(value);
}

function getGateLabel(status?: string) {
  if (status === 'BAHAYA') return 'Terbuka';
  if (status === 'SIAGA') return 'Separuh Terbuka';
  return 'Tertutup';
}

function getStatusStyle(status?: string) {
  if (status === 'BAHAYA') {
    return {
      text: 'text-red-700',
      bg: 'bg-red-50',
      border: 'border-red-200',
      badge: 'bg-red-100 text-red-700',
    };
  }

  if (status === 'SIAGA') {
    return {
      text: 'text-yellow-700',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      badge: 'bg-yellow-100 text-yellow-700',
    };
  }

  return {
    text: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-700',
  };
}

export default function Dashboard() {
  const [items, setItems] = useState<DynamoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
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
        err instanceof Error
          ? err.message
          : 'Gagal mengambil data DynamoDB'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const sendGateCommand = async (
    command: 'OPEN' | 'HALF' | 'CLOSE'
  ) => {
    try {
      setSending(true);

      const res = await fetch('/api/gate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Gagal mengirim command');
      }

      await fetchDynamoData();
    } catch (err) {
      console.error(err);

      alert('Gagal mengontrol gate');
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchDynamoData();
    }, 0);

    const interval = setInterval(() => {
      void fetchDynamoData();
    }, 3000);

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
    return sortedItems.filter(
      (item) => item.device_id === 'ESP-001'
    );
  }, [sortedItems]);

  const latest = physicalItems[0];

  const ultrasonicCm = Number(
    latest?.hcsr_cm ?? latest?.jarak_cm ?? 0
  );

  const waterLevel = Number(
    latest?.water_level ?? 0
  );

  const waterStatus = String(
    latest?.water_status ?? '-'
  );

  const systemStatus = String(
    latest?.status ?? '-'
  );

  const gateRawStatus = String(
    latest?.gate_status ??
    latest?.status ??
    'AMAN'
  );

  const gateLabel = getGateLabel(gateRawStatus);

  const servoAngle = Number(
    latest?.servo_angle ?? 0
  );

  const lastUpdate = formatTime(
    latest?.timestamp || latest?.createdAt
  );

  const style = getStatusStyle(systemStatus);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <main className="ml-64 flex-1">
        <Navbar />

        <div className="p-8">

          {/* HERO */}

          <section className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-cyan-50 p-8 shadow-xl">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700">
                  <Radio size={16} />
                  ESP-001 Live Monitoring
                </div>

                <h1 className="text-4xl font-black tracking-tight text-slate-900">
                  HydroGate Dashboard
                </h1>

                <p className="mt-3 max-w-2xl text-slate-600">
                  Monitoring ketinggian air, sensor ultrasonik,
                  dan kontrol pintu air secara realtime melalui AWS IoT Core.
                </p>
              </div>

              <button
                onClick={fetchDynamoData}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-600 px-5 py-3 font-bold text-white transition hover:bg-cyan-700 disabled:opacity-60"
              >
                <RefreshCw
                  size={18}
                  className={loading ? 'animate-spin' : ''}
                />

                Refresh Data
              </button>
            </div>
          </section>

          {/* ERROR */}

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <b>Error:</b> {error}
            </div>
          )}

          {/* EMPTY */}

          {!loading && !latest && (
            <div className="mb-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-700">
              Belum ada data dari ESP-001.
            </div>
          )}

          {/* CARDS */}

          <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

            {/* WATER */}

            <div className="rounded-3xl border border-cyan-100 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <p className="font-semibold text-slate-600">
                  Water Level
                </p>

                <div className="rounded-2xl bg-cyan-100 p-3 text-cyan-700">
                  <Waves size={24} />
                </div>
              </div>

              <p className="text-5xl font-black text-slate-900">
                {waterLevel}
              </p>

              <p className="mt-3 text-sm font-semibold text-cyan-700">
                Status: {waterStatus}
              </p>
            </div>

            {/* ULTRASONIC */}

            <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <p className="font-semibold text-slate-600">
                  Ultrasonik
                </p>

                <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
                  <Gauge size={24} />
                </div>
              </div>

              <p className="text-5xl font-black text-slate-900">
                {ultrasonicCm.toFixed(1)}

                <span className="ml-2 text-xl text-slate-500">
                  cm
                </span>
              </p>

              <p className="mt-3 text-sm font-semibold text-blue-700">
                HC-SR04 Reading
              </p>
            </div>

            {/* STATUS */}

            <div
              className={`rounded-3xl border p-6 shadow-sm ${style.bg} ${style.border}`}
            >
              <div className="mb-5 flex items-center justify-between">
                <p className="font-semibold text-slate-700">
                  Status Sistem
                </p>

                <div className="rounded-2xl bg-white p-3">
                  <ShieldCheck
                    size={24}
                    className={style.text}
                  />
                </div>
              </div>

              <p className={`text-5xl font-black ${style.text}`}>
                {systemStatus}
              </p>

              <p className="mt-3 text-sm font-semibold text-slate-600">
                Kondisi air saat ini
              </p>
            </div>

            {/* GATE */}

            <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <p className="font-semibold text-slate-600">
                  Status Gate
                </p>

                <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                  <Activity size={24} />
                </div>
              </div>

              <p className="text-4xl font-black text-slate-900">
                {gateLabel}
              </p>

              <p className="mt-3 text-sm font-semibold text-emerald-700">
                Servo: {servoAngle}°
              </p>
            </div>
          </section>

          {/* CONTENT */}

          <section className="grid grid-cols-1 gap-8 xl:grid-cols-3">

            {/* INFO */}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">

              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Data Terbaru
                  </h2>

                  <p className="text-sm text-slate-500">
                    Update terakhir: {lastUpdate}
                  </p>
                </div>

                <span
                  className={`rounded-full px-4 py-2 text-sm font-bold ${style.badge}`}
                >
                  {systemStatus}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                <InfoRow
                  label="Device ID"
                  value={latest?.device_id || '-'}
                />

                <InfoRow
                  label="Source"
                  value={latest?.source || 'physical'}
                />

                <InfoRow
                  label="Water Status"
                  value={waterStatus}
                />

                <InfoRow
                  label="Gate Status"
                  value={gateLabel}
                />

                <InfoRow
                  label="Water Level"
                  value={String(waterLevel)}
                />

                <InfoRow
                  label="Ultrasonik"
                  value={`${ultrasonicCm.toFixed(1)} cm`}
                />
              </div>
            </div>

            {/* CONTROL */}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-6">
                <h2 className="text-2xl font-black text-slate-900">
                  Kontrol Manual
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Kirim command langsung ke ESP32 via AWS IoT.
                </p>
              </div>

              <div className="space-y-4">

                <button
                  disabled={sending}
                  onClick={() => sendGateCommand('OPEN')}
                  className="w-full rounded-2xl bg-red-600 px-5 py-4 font-black text-white shadow-sm transition hover:bg-red-700 disabled:opacity-60"
                >
                  Buka Penuh
                </button>

                <button
                  disabled={sending}
                  onClick={() => sendGateCommand('HALF')}
                  className="w-full rounded-2xl bg-yellow-500 px-5 py-4 font-black text-white shadow-sm transition hover:bg-yellow-600 disabled:opacity-60"
                >
                  Buka Separuh
                </button>

                <button
                  disabled={sending}
                  onClick={() => sendGateCommand('CLOSE')}
                  className="w-full rounded-2xl bg-emerald-600 px-5 py-4 font-black text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
                >
                  Tutup Gate
                </button>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                Status tombol:{' '}
                {sending
                  ? 'Mengirim command...'
                  : 'Siap'}
              </div>
            </div>
          </section>

          {/* FOOTER */}

          <footer className="mt-10 text-center text-sm text-slate-500">
            HydroGate © 2024 | AWS IoT Core Connected System
          </footer>
        </div>
      </main>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-semibold text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-lg font-black text-slate-900">
        {value}
      </p>
    </div>
  );
}