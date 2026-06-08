"use client";

import {
  Activity,
  CheckCircle,
  Clock,
  Gauge,
  RefreshCw,
  Ruler,
  Waves,
} from "lucide-react";
import { useMemo } from "react";
import { useLandingMonitoring } from "./landing-monitoring";

function statusTextClass(status?: string) {
  const normalized = String(status || "").toUpperCase();

  if (normalized === "BAHAYA" || normalized === "MERAH") return "text-rose-600";
  if (normalized === "SIAGA" || normalized === "KUNING") return "text-amber-600";
  return "text-teal-700";
}

function statusBadgeClass(status?: string) {
  const normalized = String(status || "").toUpperCase();

  if (normalized === "BAHAYA" || normalized === "MERAH") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  if (normalized === "SIAGA" || normalized === "KUNING") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-teal-200 bg-teal-50 text-teal-700";
}

function displayValue(
  loading: boolean,
  value: number | string | null | undefined,
  suffix = ""
) {
  if (loading) return "Memuat data...";
  if (value === null || value === undefined || value === "" || value === "-") {
    return "Data belum tersedia";
  }

  return `${value}${suffix}`;
}

function clampPercent(value: number) {
  return Math.min(Math.max(value, 0), 100);
}

function getWaterLevelPercent(waterLevel?: number) {
  if (Number.isFinite(waterLevel)) {
    return clampPercent(Number(waterLevel));
  }

  return null;
}

function formatPercent(value: number | null) {
  if (value === null) {
    return null;
  }

  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function formatGateStatus(status?: string) {
  if (!status || status === "-") return null;

  const normalized = status.trim().toUpperCase();

  if (normalized === "OPEN" || normalized === "TERBUKA") return "Terbuka";
  if (normalized === "CLOSE" || normalized === "CLOSED" || normalized === "TERTUTUP") return "Tertutup";
  if (normalized === "HALF" || normalized === "SEPARUH TERBUKA") return "Separuh terbuka";

  return status
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function LiveStatus() {
  const {
    latestDevice,
    loading,
    refreshing,
    error,
    refresh,
  } = useLandingMonitoring();

  const latestWaterPercent = latestDevice
    ? getWaterLevelPercent(latestDevice.waterLevel)
    : null;
  const waterPercent = latestWaterPercent ?? 0;
  const formattedWaterPercent = formatPercent(latestWaterPercent);
  const formattedGateStatus = formatGateStatus(latestDevice?.gateStatus);

  const cards = useMemo(
    () => [
      {
        icon: Activity,
        label: "Status pintu",
        metric: formattedGateStatus,
        detail: latestDevice?.deviceId,
        className: statusTextClass(latestDevice?.waterStatus),
      },
      {
        icon: Waves,
        label: "Tinggi air",
        metric: formattedWaterPercent,
        suffix: "%",
        detail: "Berdasarkan sensor water level",
        className: statusTextClass(latestDevice?.waterStatus),
      },
      {
        icon: Ruler,
        label: "Sensor ultrasonik",
        metric:
          latestDevice && Number.isFinite(latestDevice.distanceCm)
            ? latestDevice.distanceCm.toFixed(1)
            : null,
        suffix: " cm",
        detail: latestDevice?.source,
        className: "text-[#0F172A]",
      },
      {
        icon: CheckCircle,
        label: "Status air",
        metric: latestDevice?.waterStatus,
        detail: "Hasil pembacaan sensor terbaru",
        className: statusTextClass(latestDevice?.waterStatus),
      },
      {
        icon: Gauge,
        label: "Status gate",
        metric: formattedGateStatus,
        detail: "Kondisi pintu air terakhir",
        className: "text-[#0F766E]",
      },
      {
        icon: Clock,
        label: "Pembaruan terakhir",
        metric: latestDevice?.lastUpdateLabel,
        detail: "Dibaca dari DynamoDB",
        className: "text-[#0F172A]",
      },
    ],
    [formattedGateStatus, formattedWaterPercent, latestDevice]
  );

  return (
    <section id="live-status" className="bg-[#F8FAFC] px-5 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#99F6E4] bg-white px-3 py-1.5 text-sm font-semibold text-[#0F766E]">
              <span className="status-pulse relative inline-flex h-2.5 w-2.5 rounded-full bg-[#14B8A6] before:absolute before:inset-0 before:rounded-full before:bg-[#14B8A6]" />
              Monitoring langsung dari DynamoDB
            </div>
            <h2 className="text-3xl font-semibold tracking-normal text-[#0F172A] md:text-5xl">
              Kondisi pintu air terbaru.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
              Bagian ini mengambil snapshot perangkat dari endpoint DynamoDB
              proyek. Jika belum ada item sensor atau konfigurasi backend belum
              lengkap, halaman hanya menampilkan status kosong.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void refresh()}
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#0F172A] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(15,23,42,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#1E293B]"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Perbarui
          </button>
        </div>

        {error && (
          <p className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Data backend belum tersedia penuh: {error}
          </p>
        )}

        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-xl border border-[#CFE7F3] bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Perangkat</p>
                <h3 className="mt-1 text-3xl font-semibold text-[#0F172A]">
                  {displayValue(loading, latestDevice?.deviceId)}
                </h3>
              </div>
              <span
                className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${statusBadgeClass(
                  latestDevice?.waterStatus
                )}`}
              >
                <span className="h-2 w-2 rounded-full bg-current" />
                {displayValue(loading, latestDevice?.waterStatus)}
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {cards.slice(0, 4).map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.label}
                    className="rounded-lg border border-[#DCEFED] bg-[#FAFFFE] p-5 transition-all hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(20,184,166,0.1)]"
                  >
                    <div className="mb-7 flex items-center justify-between gap-4">
                      <p className="text-sm font-medium text-slate-500">
                        {card.label}
                      </p>
                      <Icon size={21} className="text-[#0F766E]" />
                    </div>
                    <p
                      className={`min-h-9 text-2xl font-semibold tracking-normal ${card.className}`}
                    >
                      {displayValue(loading, card.metric, card.suffix)}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      {displayValue(false, card.detail)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-[#CFE7F3] bg-[#0F172A] p-5 text-white shadow-[0_24px_70px_rgba(15,23,42,0.2)]">
            <div className="mb-8">
              <p className="text-sm font-medium text-cyan-200">
                Tinggi air terbaru
              </p>
              <p className="mt-2 text-5xl font-semibold">
                {displayValue(
                  loading,
                  formattedWaterPercent,
                  "%"
                )}
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Berdasarkan sensor water level
              </p>
            </div>

            <div className="mb-8">
              <div className="mb-2 flex items-center justify-between text-xs text-slate-300">
                <span>0%</span>
                <span>
                  {latestDevice && Number.isFinite(latestDevice.waterLevel)
                    ? `Water level ${latestDevice.waterLevel}%`
                    : "Menunggu data water level"}
                </span>
                <span>100%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#14B8A6] to-[#38BDF8]"
                  style={{ width: `${waterPercent}%` }}
                />
              </div>
            </div>

            <div className="grid gap-3">
              {cards.slice(4).map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.label}
                    className="rounded-lg border border-white/10 bg-white/[0.06] p-4"
                  >
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <p className="text-sm text-slate-300">{card.label}</p>
                      <Icon size={18} className="text-cyan-200" />
                    </div>
                    <p className="text-xl font-semibold text-white">
                      {displayValue(loading, card.metric, card.suffix)}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {card.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
