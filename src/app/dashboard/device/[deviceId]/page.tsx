"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import DeviceStatusBadge from "../../components/multi-device/DeviceStatusBadge";
import DeviceHistoryTable from "../../components/multi-device/DeviceHistoryTable";
import GateControlButtons from "../../components/multi-device/GateControlButtons";
import { DeviceSnapshot } from "@/lib/device-monitoring";

type DeviceDetailResponse = {
  deviceId?: string;
  latest?: DeviceSnapshot | null;
  history?: DeviceSnapshot[];
  error?: string;
  detail?: string;
};

const ONLINE_WINDOW_MS = 60_000;

export default function DeviceDetailPage() {
  const params = useParams<{ deviceId: string }>();
  const deviceId = decodeURIComponent(params.deviceId || "");
  const [history, setHistory] = useState<DeviceSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nowMs, setNowMs] = useState(0);

  const fetchDeviceHistory = useCallback(async () => {
    try {
      if (!deviceId) {
        setHistory([]);
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/dynamodb/device/${encodeURIComponent(deviceId)}?limit=20`, {
        cache: "no-store",
      });

      const json: DeviceDetailResponse = await response.json();

      if (!response.ok) {
        throw new Error(json.detail || json.error || "Gagal mengambil data detail device");
      }

      setHistory(json.history || []);
      setError("");
    } catch (err: unknown) {
      setHistory([]);
      setError(err instanceof Error ? err.message : "Gagal mengambil data detail device");
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

  useEffect(() => {
    const bootstrap = setTimeout(() => {
      void fetchDeviceHistory();
      setNowMs(Date.now());
    }, 0);

    const polling = setInterval(() => {
      void fetchDeviceHistory();
    }, 5000);

    const clock = setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    return () => {
      clearTimeout(bootstrap);
      clearInterval(polling);
      clearInterval(clock);
    };
  }, [fetchDeviceHistory]);

  const latest = useMemo(() => history[0] ?? null, [history]);
  const isOnline =
    latest !== null &&
    latest.timestampMs > 0 &&
    nowMs > 0 &&
    nowMs - latest.timestampMs < ONLINE_WINDOW_MS;

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <main className="ml-64 flex-1">
        <Navbar />
        <div className="p-8">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-black text-slate-900">Device Detail</h1>
              <p className="mt-1 text-sm text-slate-600">Riwayat dan kontrol per device_id</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/multi-device"
                className="rounded-xl bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
              >
                Kembali
              </Link>
              <button
                type="button"
                onClick={() => void fetchDeviceHistory()}
                className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700"
              >
                Refresh
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading && (
            <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
              Mengambil data detail device dari DynamoDB...
            </div>
          )}

          {!loading && !latest && (
            <div className="mb-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-700">
              Data device {deviceId || "-"} belum tersedia.
            </div>
          )}

          {latest && (
            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <DeviceStatusBadge kind="connection" value={isOnline ? "ONLINE" : "OFFLINE"} />
                <DeviceStatusBadge kind="water" value={latest.waterStatus} />
              </div>

              <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                <InfoItem label="Device ID" value={latest.deviceId} />
                <InfoItem label="Status Koneksi" value={isOnline ? "ONLINE" : "OFFLINE"} />
                <InfoItem label="Status Air" value={latest.waterStatus} />
                <InfoItem label="Water Level" value={String(latest.waterLevel)} />
                <InfoItem label="Jarak HC-SR04" value={`${latest.distanceCm} cm`} />
                <InfoItem label="Gate Status" value={latest.gateStatus} />
                <InfoItem label="Servo Angle" value={`${latest.servoAngle}°`} />
                <InfoItem label="Timestamp" value={String(latest.timestamp ?? latest.createdAt ?? "-")} />
                <InfoItem label="Datetime" value={latest.datetime || latest.lastUpdateLabel} />
              </div>

              <GateControlButtons deviceId={latest.deviceId} onSent={fetchDeviceHistory} />
            </div>
          )}

          <DeviceHistoryTable
            items={history}
            resolveOnline={(timestampMs) =>
              timestampMs > 0 && nowMs > 0 && nowMs - timestampMs < ONLINE_WINDOW_MS
            }
          />
        </div>
      </main>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}
