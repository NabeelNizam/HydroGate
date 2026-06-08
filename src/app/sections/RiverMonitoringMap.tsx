"use client";

import { AlertTriangle, Droplets, MapPin, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import type { DeviceSnapshot } from "@/lib/device-monitoring";

type MonitoringPointPosition = {
  x: number;
  y: number;
};

type MonitoringRisk = "AMAN" | "SIAGA" | "BAHAYA" | "OFFLINE";

type MonitoringPointData = {
  device: DeviceSnapshot;
  name: string;
  position: MonitoringPointPosition;
  risk: MonitoringRisk;
  onSelect: () => void;
};

const ONLINE_WINDOW_MS = 60_000;

const locationNames: Record<string, string> = {
  "ESP-001": "Sungai Utara",
  "ESP-002": "Sungai Tengah",
  "ESP-003": "Sungai Selatan",
  "wokwi-hydrogate-01": "Area Simulasi",
  "esp32-hydrogate-01": "Area Simulasi",
};

const pointPositions: MonitoringPointPosition[] = [
  { x: 16, y: 16 },
  { x: 35, y: 25 },
  { x: 50, y: 34 },
  { x: 61, y: 48 },
  { x: 72, y: 62 },
  { x: 83, y: 76 },
];

function getMonitoringName(deviceId: string, index: number) {
  return locationNames[deviceId] ?? `Titik Pemantauan ${index + 1}`;
}

function getRisk(device: DeviceSnapshot, nowMs: number): MonitoringRisk {
  const isOnline =
    device.timestampMs > 0 && nowMs > 0 && nowMs - device.timestampMs <= ONLINE_WINDOW_MS;

  if (!isOnline) return "OFFLINE";
  return device.waterStatus;
}

function riskLabel(risk: MonitoringRisk) {
  if (risk === "OFFLINE") return "Offline";
  if (risk === "BAHAYA") return "Bahaya";
  if (risk === "SIAGA") return "Siaga";
  return "Aman";
}

function waterCondition(risk: MonitoringRisk) {
  if (risk === "OFFLINE") return "Belum ada sinyal terbaru";
  if (risk === "BAHAYA") return "Berisiko tinggi";
  if (risk === "SIAGA") return "Meningkat";
  return "Stabil";
}

function riskClasses(risk: MonitoringRisk) {
  if (risk === "OFFLINE") {
    return {
      dot: "bg-slate-400 shadow-slate-400/40",
      ring: "border-slate-300 bg-slate-200/30",
      badge: "border-slate-200 bg-slate-50 text-slate-600",
      text: "text-slate-600",
    };
  }

  if (risk === "BAHAYA") {
    return {
      dot: "bg-rose-500 shadow-rose-500/50",
      ring: "border-rose-300 bg-rose-100/40",
      badge: "border-rose-200 bg-rose-50 text-rose-700",
      text: "text-rose-700",
    };
  }

  if (risk === "SIAGA") {
    return {
      dot: "bg-amber-400 shadow-amber-400/50",
      ring: "border-amber-300 bg-amber-100/40",
      badge: "border-amber-200 bg-amber-50 text-amber-700",
      text: "text-amber-700",
    };
  }

  return {
    dot: "bg-emerald-500 shadow-emerald-500/50",
    ring: "border-emerald-300 bg-emerald-100/40",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    text: "text-emerald-700",
  };
}

function formatWaterHeight(device: DeviceSnapshot) {
  if (!Number.isFinite(device.distanceCm)) return "Data belum tersedia";
  return `${device.distanceCm.toFixed(1)} cm`;
}

function formatGateStatus(status: string) {
  if (!status || status === "-") return "Data belum tersedia";

  const normalized = status.toUpperCase();
  if (normalized === "OPEN" || normalized === "TERBUKA") return "Terbuka";
  if (normalized === "CLOSED" || normalized === "TERTUTUP") return "Tertutup";
  if (normalized === "HALF") return "Terbuka sebagian";

  return status
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatLastUpdate(label: string) {
  return label && label !== "-" ? label : "Data belum tersedia";
}

function CustomRiverMapSvg() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="mapBackground" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#F8FAFC" />
          <stop offset="50%" stopColor="#ECFEFF" />
          <stop offset="100%" stopColor="#E0F2FE" />
        </linearGradient>
        <linearGradient id="riverMain" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="45%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#14B8A6" />
        </linearGradient>
        <filter id="riverGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="100" height="100" fill="url(#mapBackground)" />

      <path
        d="M9 12 C22 9, 25 25, 38 25 C55 25, 49 44, 62 48 C78 53, 69 72, 90 86"
        fill="none"
        stroke="#BAE6FD"
        strokeWidth="15"
        strokeLinecap="round"
        opacity="0.82"
      />
      <path
        d="M9 12 C22 9, 25 25, 38 25 C55 25, 49 44, 62 48 C78 53, 69 72, 90 86"
        fill="none"
        stroke="url(#riverMain)"
        strokeWidth="8"
        strokeLinecap="round"
        filter="url(#riverGlow)"
      />
      <path
        d="M10 12 C23 10, 26 22, 39 24 C54 25, 51 42, 63 47 C76 52, 72 70, 89 84"
        fill="none"
        stroke="#E0F2FE"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.9"
      />

      <path
        d="M3 28 C18 20, 32 39, 48 34 S72 32, 92 42"
        fill="none"
        stroke="#94A3B8"
        strokeWidth="0.45"
        strokeDasharray="2 2"
        opacity="0.3"
      />
      <path
        d="M8 63 C24 52, 38 69, 55 63 S78 59, 96 72"
        fill="none"
        stroke="#94A3B8"
        strokeWidth="0.45"
        strokeDasharray="2 2"
        opacity="0.26"
      />
      <path
        d="M0 8 H100 M0 92 H100 M8 0 V100 M92 0 V100"
        stroke="#CBD5E1"
        strokeWidth="0.18"
        opacity="0.22"
      />

      <circle cx="20" cy="74" r="12" fill="#FFFFFF" opacity="0.36" />
      <circle cx="79" cy="20" r="15" fill="#FFFFFF" opacity="0.32" />
      <circle cx="52" cy="83" r="10" fill="#FFFFFF" opacity="0.28" />
    </svg>
  );
}

export function MonitoringPoint({ point }: { point: MonitoringPointData }) {
  const classes = riskClasses(point.risk);

  return (
    <div
      className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${point.position.x}%`, top: `${point.position.y}%` }}
    >
      <button
        type="button"
        aria-label={`Titik pemantauan ${point.name}`}
        onClick={point.onSelect}
        className="relative flex h-11 w-11 items-center justify-center rounded-full outline-none transition-all duration-200 focus-visible:scale-110"
      >
        <span
          className={`absolute h-11 w-11 rounded-full border ${classes.ring}`}
        />
        <span
          className={`absolute h-8 w-8 animate-ping rounded-full opacity-20 ${classes.dot}`}
        />
        <span
          className={`relative flex h-5 w-5 rounded-full border-2 border-white shadow-lg ${classes.dot}`}
        />
      </button>
    </div>
  );
}

export default function RiverMonitoringMap({
  devices,
  loading,
  error,
  nowMs,
}: {
  devices: DeviceSnapshot[];
  loading: boolean;
  error: string;
  nowMs: number;
}) {
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const points = useMemo(
    () =>
      devices.map((device, index) => ({
        device,
        name: getMonitoringName(device.deviceId, index),
        position: pointPositions[index % pointPositions.length],
        risk: getRisk(device, nowMs),
        onSelect: () => setSelectedDeviceId(device.deviceId),
      })),
    [devices, nowMs]
  );
  const selectedPoint =
    points.find((point) => point.device.deviceId === selectedDeviceId) ?? null;

  return (
    <div className="rounded-xl border border-[#CFE7F3] bg-gradient-to-br from-[#F8FAFC] via-white to-[#ECFEFF] p-4 shadow-[0_28px_90px_rgba(15,23,42,0.12)]">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#0F172A]">
            Peta Pemantauan Sungai
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Setiap titik mewakili perangkat HydroGate di lokasi pemantauan.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            ["Aman", "bg-emerald-500"],
            ["Siaga", "bg-amber-400"],
            ["Bahaya", "bg-rose-500"],
            ["Offline", "bg-slate-400"],
          ].map(([label, color]) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/70 px-2.5 py-1 text-slate-600"
            >
              <span className={`h-2 w-2 rounded-full ${color}`} />
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_290px]">
        <div className="relative min-h-[430px] overflow-hidden rounded-lg border border-[#DCEFED] bg-[#EAF8F9]">
          <CustomRiverMapSvg />

          <div className="absolute left-[7%] top-[8%] rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-600 backdrop-blur">
            Hulu Sungai
          </div>
          <div className="absolute bottom-[8%] right-[7%] rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-600 backdrop-blur">
            Hilir Sungai
          </div>

          {loading && (
            <div className="absolute inset-5 z-20 flex items-center justify-center rounded-lg border border-white/70 bg-white/70 text-sm font-semibold text-slate-600 backdrop-blur-md">
              Memuat data pemantauan...
            </div>
          )}

          {!loading && error && (
            <div className="absolute inset-5 z-20 flex items-center justify-center rounded-lg border border-amber-200 bg-amber-50/90 px-5 text-center text-sm font-medium text-amber-800 backdrop-blur-md">
              Data pemantauan belum dapat ditampilkan: {error}
            </div>
          )}

          {!loading && !error && points.length === 0 && (
            <div className="absolute inset-5 z-20 flex items-center justify-center rounded-lg border border-slate-200 bg-white/80 px-5 text-center text-sm font-medium text-slate-600 backdrop-blur-md">
              Belum ada titik pemantauan yang tersedia dari sistem.
            </div>
          )}

          {!loading &&
            !error &&
            points.map((point) => (
              <MonitoringPoint key={point.device.deviceId} point={point} />
            ))}

          <div className="absolute bottom-4 left-4 right-4 z-10 rounded-lg border border-white/60 bg-white/60 p-3 text-xs leading-5 text-slate-600 backdrop-blur-md">
            <div className="flex items-start gap-2">
              <MapPin size={15} className="mt-0.5 shrink-0 text-[#0F766E]" />
              <span>
                Klik titik pemantauan untuk membuka detail kondisi sungai.
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[#DCEFED] bg-white/80 p-5 shadow-[0_16px_42px_rgba(15,23,42,0.06)] backdrop-blur">
          {selectedPoint ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0F766E]">
                Detail Titik
              </p>
              <h3 className="mt-2 text-xl font-semibold text-[#0F172A]">
                {selectedPoint.name}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Perangkat: {selectedPoint.device.deviceId}
              </p>

              <div className="mt-6 space-y-4 text-sm">
                {[
                  ["Status Air", riskLabel(selectedPoint.risk)],
                  ["Kondisi Air", waterCondition(selectedPoint.risk)],
                  ["Jarak Air", formatWaterHeight(selectedPoint.device)],
                  ["Status Gerbang", formatGateStatus(selectedPoint.device.gateStatus)],
                  [
                    "Terakhir Diperbarui",
                    formatLastUpdate(selectedPoint.device.lastUpdateLabel),
                  ],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3 last:border-b-0 last:pb-0"
                  >
                    <span className="text-slate-500">{label}</span>
                    <span className="max-w-[10rem] text-right font-semibold text-[#0F172A]">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[220px] flex-col items-center justify-center text-center">
              <MapPin size={28} className="text-[#14B8A6]" />
              <h3 className="mt-4 text-base font-semibold text-[#0F172A]">
                Pilih titik pemantauan
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Klik marker di peta untuk melihat detail kondisi sungai dari
                perangkat tersebut.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-[#E2E8F0] bg-white/75 p-4 backdrop-blur">
          <ShieldCheck size={18} className="mb-4 text-emerald-600" />
          <p className="text-sm font-semibold text-[#0F172A]">Mudah Dipahami</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Warna titik menunjukkan tingkat risiko di lokasi sungai.
          </p>
        </div>
        <div className="rounded-lg border border-[#E2E8F0] bg-white/75 p-4 backdrop-blur">
          <Droplets size={18} className="mb-4 text-[#38BDF8]" />
          <p className="text-sm font-semibold text-[#0F172A]">Kondisi Air</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Informasi ditulis dengan bahasa petugas lapangan.
          </p>
        </div>
        <div className="rounded-lg border border-[#E2E8F0] bg-white/75 p-4 backdrop-blur">
          <AlertTriangle size={18} className="mb-4 text-amber-500" />
          <p className="text-sm font-semibold text-[#0F172A]">Respons Cepat</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Lokasi siaga dan bahaya terlihat jelas di peta.
          </p>
        </div>
      </div>
    </div>
  );
}
