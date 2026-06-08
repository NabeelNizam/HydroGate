"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  Clock,
  Cpu,
  Eye,
  Monitor,
  Radio,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Tablet,
  Wifi,
  WifiOff,
} from "lucide-react";
import {
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { DeviceSnapshot } from "@/lib/device-monitoring";

type DevicesResponse = {
  devices?: DeviceSnapshot[];
  error?: string;
  detail?: string;
};

const ONLINE_WINDOW_MS = 60_000;

const fallbackDevices: DeviceSnapshot[] = [
  {
    deviceId: "ESP-001",
    waterStatus: "AMAN",
    waterLevel: 2.4,
    distanceCm: 42,
    gateStatus: "Closed",
    servoAngle: 0,
    source: "physical",
    timestamp: null,
    createdAt: null,
    datetime: "",
    timestampMs: 0,
    lastUpdateLabel: "Sample data",
  },
  {
    deviceId: "MOBILE-OPS-02",
    waterStatus: "AMAN",
    waterLevel: 1.8,
    distanceCm: 58,
    gateStatus: "Online",
    servoAngle: 0,
    source: "mobile",
    timestamp: null,
    createdAt: null,
    datetime: "",
    timestampMs: 0,
    lastUpdateLabel: "Sample data",
  },
  {
    deviceId: "TABLET-FIELD-03",
    waterStatus: "SIAGA",
    waterLevel: 3.1,
    distanceCm: 34,
    gateStatus: "Review",
    servoAngle: 45,
    source: "tablet",
    timestamp: null,
    createdAt: null,
    datetime: "",
    timestampMs: 0,
    lastUpdateLabel: "Sample data",
  },
  {
    deviceId: "DESKTOP-CONTROL-04",
    waterStatus: "AMAN",
    waterLevel: 2.1,
    distanceCm: 49,
    gateStatus: "Online",
    servoAngle: 0,
    source: "desktop",
    timestamp: null,
    createdAt: null,
    datetime: "",
    timestampMs: 0,
    lastUpdateLabel: "Sample data",
  },
];

const activityData = [
  { day: "Mon", activity: 42 },
  { day: "Tue", activity: 58 },
  { day: "Wed", activity: 51 },
  { day: "Thu", activity: 76 },
  { day: "Fri", activity: 68 },
  { day: "Sat", activity: 84 },
  { day: "Sun", activity: 79 },
];

const typeColors = ["#111111", "#525252", "#A3A3A3", "#E5E5E5"];

function getDeviceType(device: DeviceSnapshot, index: number) {
  const id = device.deviceId.toLowerCase();
  const source = device.source.toLowerCase();

  if (id.includes("mobile") || source.includes("mobile")) return "Mobile";
  if (id.includes("tablet") || source.includes("tablet")) return "Tablet";
  if (id.includes("desktop") || source.includes("desktop")) return "Desktop";

  return index % 4 === 0 ? "Other" : index % 3 === 0 ? "Tablet" : index % 2 === 0 ? "Desktop" : "Mobile";
}

function isDeviceOnline(device: DeviceSnapshot, nowMs: number, hasLiveData: boolean) {
  if (!hasLiveData) return device.waterStatus !== "SIAGA";
  return device.timestampMs > 0 && nowMs > 0 && nowMs - device.timestampMs < ONLINE_WINDOW_MS;
}

function statusBadgeClass(online: boolean) {
  return online
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-[#E5E5E5] bg-[#F5F5F5] text-[#6B7280]";
}

function formatLastSeen(device: DeviceSnapshot, online: boolean) {
  if (device.lastUpdateLabel && device.lastUpdateLabel !== "-") return device.lastUpdateLabel;
  return online ? "Just now" : "No recent signal";
}

export default function Dashboard() {
  const router = useRouter();
  const [devices, setDevices] = useState<DeviceSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [chartsReady, setChartsReady] = useState(false);

  const fetchDevices = useCallback(async () => {
    try {
      const response = await fetch("/api/dynamodb/devices", {
        cache: "no-store",
      });

      const json: DevicesResponse = await response.json();

      if (!response.ok) {
        throw new Error(json.detail || json.error || "Failed to load devices");
      }

      setDevices(json.devices || []);
      setError("");
    } catch (err: unknown) {
      setDevices([]);
      setError(err instanceof Error ? err.message : "Failed to load devices");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const bootstrap = setTimeout(() => {
      void fetchDevices();
      setChartsReady(true);
    }, 0);

    const polling = setInterval(() => {
      setNowMs(Date.now());
      void fetchDevices();
    }, 30_000);

    const clock = setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    return () => {
      clearTimeout(bootstrap);
      clearInterval(polling);
      clearInterval(clock);
    };
  }, [fetchDevices]);

  const hasLiveData = devices.length > 0;
  const displayDevices = hasLiveData ? devices : fallbackDevices;

  const enrichedDevices = useMemo(() => {
    return displayDevices.map((device, index) => ({
      ...device,
      type: getDeviceType(device, index),
      online: isDeviceOnline(device, nowMs, hasLiveData),
    }));
  }, [displayDevices, hasLiveData, nowMs]);

  const onlineCount = enrichedDevices.filter((device) => device.online).length;
  const warningCount = enrichedDevices.filter((device) => device.waterStatus === "SIAGA").length;
  const dangerCount = enrichedDevices.filter((device) => device.waterStatus === "BAHAYA").length;
  const activeSessions = Math.max(onlineCount * 2 + 6, 8);
  const avgResponseTime = 38 + Math.max(0, enrichedDevices.length - onlineCount) * 3 + warningCount * 2;
  const healthScore = Math.max(
    0,
    Math.min(99, Math.round(72 + (onlineCount / Math.max(enrichedDevices.length, 1)) * 25 - warningCount * 3 - dangerCount * 8))
  );

  const typeData = useMemo(() => {
    const base = ["Mobile", "Desktop", "Tablet", "Other"].map((name) => ({ name, value: 0 }));

    enrichedDevices.forEach((device) => {
      const bucket = base.find((item) => item.name === device.type);
      if (bucket) bucket.value += 1;
    });

    return base.filter((item) => item.value > 0);
  }, [enrichedDevices]);

  const recentActivity = enrichedDevices.slice(0, 5).map((device) => ({
    id: device.deviceId,
    description: `${device.deviceId} reported ${device.waterStatus.toLowerCase()} status`,
    timestamp: formatLastSeen(device, device.online),
    online: device.online,
  }));

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      <Sidebar />

      <main className="lg:ml-64">
        <Navbar />

        <div className="space-y-6 px-5 py-6 md:px-8">
          {error && (
            <div className="rounded-lg border border-[#E5E5E5] bg-white p-4 text-sm text-[#6B7280]">
              Live data unavailable: {error}. Showing sample dashboard data.
            </div>
          )}

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { icon: Monitor, label: "Total Devices Connected", value: enrichedDevices.length },
              { icon: Radio, label: "Active Sessions", value: activeSessions },
              { icon: Clock, label: "Avg. Response Time", value: `${avgResponseTime}ms` },
              { icon: ShieldCheck, label: "System Health Score", value: `${healthScore}%` },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="rounded-lg border border-[#EEEEEE] bg-white p-5 shadow-[0_1px_2px_rgba(17,17,17,0.03)]">
                  <div className="mb-8 flex items-center justify-between">
                    <p className="text-sm font-medium text-[#6B7280]">{card.label}</p>
                    <Icon size={19} className="text-[#111111]" />
                  </div>
                  <p className="text-3xl font-semibold tracking-normal text-[#111111]">{card.value}</p>
                </div>
              );
            })}
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-[3fr_2fr]">
            <div className="rounded-lg border border-[#EEEEEE] bg-white p-5 shadow-[0_1px_2px_rgba(17,17,17,0.03)]">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-[#111111]">Activity Over Time</h2>
                  <p className="mt-1 text-sm text-[#6B7280]">Last 7 days</p>
                </div>
                <button
                  type="button"
                  onClick={() => void fetchDevices()}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#E5E5E5] px-3 py-2 text-sm font-medium text-[#111111] hover:bg-[#FAFAFA]"
                >
                  <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
                  Refresh
                </button>
              </div>

              <div className="h-72 min-h-72 min-w-0">
                {chartsReady ? (
                  <ResponsiveContainer width="100%" height={288} minWidth={0}>
                    <LineChart data={activityData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          border: "1px solid #E5E5E5",
                          borderRadius: 8,
                          boxShadow: "0 12px 30px rgba(17,17,17,0.08)",
                        }}
                      />
                      <Line type="monotone" dataKey="activity" stroke="#111111" strokeWidth={2} dot={{ r: 3, fill: "#111111" }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full rounded-lg bg-[#FAFAFA]" />
                )}
              </div>
            </div>

            <div className="rounded-lg border border-[#EEEEEE] bg-white p-5 shadow-[0_1px_2px_rgba(17,17,17,0.03)]">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#111111]">Device Type Breakdown</h2>
                <p className="mt-1 text-sm text-[#6B7280]">Mobile / desktop / tablet / other</p>
              </div>

              <div className="h-64 min-h-64 min-w-0">
                {chartsReady ? (
                  <ResponsiveContainer width="100%" height={256} minWidth={0}>
                    <PieChart>
                      <Pie data={typeData} dataKey="value" innerRadius={58} outerRadius={92} paddingAngle={2}>
                        {typeData.map((entry, index) => (
                          <Cell key={entry.name} fill={typeColors[index % typeColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full rounded-lg bg-[#FAFAFA]" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {typeData.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2 text-sm text-[#6B7280]">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: typeColors[index % typeColors.length] }} />
                    {item.name}: {item.value}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-[#EEEEEE] bg-white shadow-[0_1px_2px_rgba(17,17,17,0.03)]">
            <div className="border-b border-[#EEEEEE] p-5">
              <h2 className="text-lg font-semibold text-[#111111]">Connected Devices</h2>
              <p className="mt-1 text-sm text-[#6B7280]">Device Name | Type | Status | Last Seen | Actions</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="border-b border-[#EEEEEE] bg-[#FAFAFA] text-xs font-semibold uppercase tracking-[0.08em] text-[#6B7280]">
                  <tr>
                    <th className="px-5 py-3">Device Name</th>
                    <th className="px-5 py-3">Type</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Last Seen</th>
                    <th className="px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEEEEE]">
                  {enrichedDevices.map((device) => (
                    <tr key={device.deviceId} className="text-sm">
                      <td className="px-5 py-4 font-medium text-[#111111]">{device.deviceId}</td>
                      <td className="px-5 py-4 text-[#6B7280]">
                        <span className="inline-flex items-center gap-2">
                          {device.type === "Mobile" && <Smartphone size={15} />}
                          {device.type === "Tablet" && <Tablet size={15} />}
                          {device.type === "Desktop" && <Cpu size={15} />}
                          {device.type === "Other" && <Monitor size={15} />}
                          {device.type}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${statusBadgeClass(device.online)}`}>
                          {device.online ? <Wifi size={13} /> : <WifiOff size={13} />}
                          {device.online ? "Online" : "Offline"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[#6B7280]">{formatLastSeen(device, device.online)}</td>
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => router.push(`/dashboard/device/${encodeURIComponent(device.deviceId)}`)}
                          className="inline-flex items-center gap-2 rounded-lg border border-[#E5E5E5] px-3 py-2 text-sm font-medium text-[#111111] hover:bg-[#FAFAFA]"
                        >
                          <Eye size={14} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-lg border border-[#EEEEEE] bg-white p-5 shadow-[0_1px_2px_rgba(17,17,17,0.03)]">
            <h2 className="text-lg font-semibold text-[#111111]">Recent Activity</h2>
            <div className="mt-5 space-y-4">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full border ${item.online ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-[#E5E5E5] bg-[#FAFAFA] text-[#6B7280]"}`}>
                      <Activity size={15} />
                    </span>
                    <span className="mt-2 h-full w-px bg-[#EEEEEE]" />
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium text-[#111111]">{item.description}</p>
                    <p className="mt-1 text-sm text-[#6B7280]">{item.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
