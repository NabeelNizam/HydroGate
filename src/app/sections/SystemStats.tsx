"use client";

import {
  Activity,
  Clock,
  Database,
  Radio,
  RefreshCw,
  ShieldCheck,
  Wifi,
} from "lucide-react";
import { useLandingMonitoring } from "./landing-monitoring";

function formatValue(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "Data belum tersedia";
  }

  return String(value);
}

function statusClass(status?: string) {
  const normalized = String(status || "").toUpperCase();

  if (normalized === "BAHAYA") return "text-rose-600";
  if (normalized === "SIAGA") return "text-amber-600";
  return "text-teal-700";
}

export default function SystemStats() {
  const {
    totalDevices,
    totalRecords,
    onlineDevices,
    latestDevice,
    loading,
    refreshing,
    error,
    lastFetchedAt,
    refresh,
  } = useLandingMonitoring();

  const stats = [
    {
      icon: Radio,
      label: "Jumlah perangkat terdaftar",
      value: totalDevices > 0 ? totalDevices : null,
      detail: "Dihitung dari endpoint perangkat DynamoDB",
    },
    {
      icon: Wifi,
      label: "Perangkat online",
      value: totalDevices > 0 ? onlineDevices : null,
      detail: "Aktif jika ada sinyal dalam 60 detik terakhir",
    },
    {
      icon: Database,
      label: "Data sensor tersimpan",
      value: totalRecords,
      detail: "Total item yang terbaca dari tabel DynamoDB",
    },
    {
      icon: ShieldCheck,
      label: "Status terakhir",
      value: latestDevice?.waterStatus ?? null,
      detail: latestDevice?.deviceId ?? "Belum ada perangkat terbaru",
      valueClassName: statusClass(latestDevice?.waterStatus),
    },
  ];

  return (
    <section id="statistics" className="bg-white px-5 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-[#0F766E]">
              Statistik Sistem
            </p>
            <h2 className="text-3xl font-semibold tracking-normal text-[#0F172A] md:text-5xl">
              Ringkasan operasional dari data backend.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
              Angka pada bagian ini berasal dari API DynamoDB yang tersedia di
              proyek. Jika tabel atau kredensial belum siap, halaman menampilkan
              status data tanpa membuat angka pengganti.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void refresh()}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-lg border border-[#CFE7F3] bg-white px-4 py-2.5 text-sm font-semibold text-[#0F172A] shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-0.5 hover:border-[#38BDF8] hover:text-[#0369A1]"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Perbarui Data
          </button>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Data backend belum sepenuhnya tersedia: {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-[0_16px_42px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(20,184,166,0.12)]"
              >
                <div className="mb-8 flex items-start justify-between gap-4">
                  <p className="text-sm font-medium text-slate-600">
                    {item.label}
                  </p>
                  <span className="rounded-lg bg-[#ECFEFF] p-2 text-[#0F766E]">
                    <Icon size={19} />
                  </span>
                </div>
                <p
                  className={`min-h-9 text-2xl font-semibold tracking-normal ${
                    item.valueClassName ?? "text-[#0F172A]"
                  }`}
                >
                  {loading ? "Memuat data..." : formatValue(item.value)}
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  {item.detail}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex flex-col gap-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
          <span className="inline-flex items-center gap-2">
            <Activity size={16} className="text-[#14B8A6]" />
            Sumber data: API DynamoDB proyek
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock size={16} className="text-[#38BDF8]" />
            {lastFetchedAt
              ? `Terakhir diperbarui ${lastFetchedAt.toLocaleString("id-ID")}`
              : "Menunggu pembaruan pertama"}
          </span>
        </div>
      </div>
    </section>
  );
}
