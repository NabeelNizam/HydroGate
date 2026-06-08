"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { DeviceSnapshot } from "@/lib/device-monitoring";
import DeviceCard from "../components/multi-device/DeviceCard";

type DevicesResponse = {
  devices?: DeviceSnapshot[];
  error?: string;
  detail?: string;
};

const ONLINE_WINDOW_MS = 60_000;

export default function MultiDevicePage() {
  const router = useRouter();
  const [devices, setDevices] = useState<DeviceSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nowMs, setNowMs] = useState(0);

  const fetchDevices = useCallback(async () => {
    try {
      const response = await fetch("/api/dynamodb/devices", {
        cache: "no-store",
      });

      const json: DevicesResponse = await response.json();

      if (!response.ok) {
        throw new Error(json.detail || json.error || "Gagal mengambil data multi device");
      }

      setDevices(json.devices || []);
      setError("");
    } catch (err: unknown) {
      setDevices([]);
      setError(err instanceof Error ? err.message : "Gagal mengambil data multi device");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const bootstrap = setTimeout(() => {
      void fetchDevices();
      setNowMs(Date.now());
    }, 0);

    const polling = setInterval(() => {
      void fetchDevices();
    }, 5000);
    const clock = setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    return () => {
      clearTimeout(bootstrap);
      clearInterval(polling);
      clearInterval(clock);
    };
  }, [fetchDevices]);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <main className="ml-64 flex-1">
        <Navbar />
        <div className="p-8">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-black text-slate-900">Multi Device Monitoring</h1>
              <p className="mt-1 text-sm text-slate-600">
                Pantau dan kontrol seluruh device HydroGate berdasarkan device_id
              </p>
            </div>
            <button
              type="button"
              onClick={() => void fetchDevices()}
              className="w-fit rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700"
            >
              Refresh
            </button>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading && (
            <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
              Mengambil data terbaru dari DynamoDB...
            </div>
          )}

          {!loading && devices.length === 0 && (
            <div className="mb-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-700">
              Belum ada device yang tersedia.
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {devices.map((device) => (
              <DeviceCard
                key={`${device.deviceId}-${device.timestampMs}`}
                device={device}
                isOnline={
                  device.timestampMs > 0 &&
                  nowMs > 0 &&
                  nowMs - device.timestampMs < ONLINE_WINDOW_MS
                }
                onClick={() => router.push(`/dashboard/device/${encodeURIComponent(device.deviceId)}`)}
                onControlSent={fetchDevices}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
