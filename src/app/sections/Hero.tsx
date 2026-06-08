"use client";

import {
  ArrowDownRight,
  ArrowRight,
  Database,
  Radio,
  Wifi,
} from "lucide-react";
import { useLandingMonitoring } from "./landing-monitoring";
import RiverMonitoringMap from "./RiverMonitoringMap";

function displayMetric(
  loading: boolean,
  value: number | string | null | undefined
) {
  if (loading) return "Memuat data...";
  if (value === null || value === undefined || value === "") {
    return "Data belum tersedia";
  }

  return String(value);
}

export default function Hero() {
  const {
    devices,
    totalDevices,
    totalRecords,
    onlineDevices,
    loading,
    error,
    lastFetchedAt,
  } = useLandingMonitoring();

  const summaryCards = [
    {
      icon: Radio,
      label: "Perangkat terdaftar",
      value: totalDevices > 0 ? totalDevices : null,
    },
    {
      icon: Wifi,
      label: "Perangkat online",
      value: totalDevices > 0 ? onlineDevices : null,
    },
    {
      icon: Database,
      label: "Data sensor",
      value: totalRecords,
    },
  ];

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-white px-5 pt-32 pb-20 md:px-8 md:pt-40"
    >
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#E0F2FE] via-white to-white" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="max-w-4xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#BAE6FD] bg-white px-3 py-1.5 text-xs font-semibold text-[#075985] shadow-[0_10px_30px_rgba(56,189,248,0.12)]">
            <span className="relative flex h-2 w-2">
              <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-[#14B8A6] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#14B8A6]" />
            </span>
            Platform IoT untuk operasi pintu air
          </div>

          <h1 className="max-w-5xl text-[clamp(2.6rem,6vw,5.1rem)] font-bold leading-[0.98] tracking-normal text-[#0F172A]">
            HydroGate
          </h1>
          <p className="mt-5 max-w-3xl text-2xl font-semibold leading-tight text-[#0F766E] md:text-3xl">
            Monitoring dan kontrol pintu air berbasis IoT secara terpusat.
          </p>

          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 md:text-lg md:leading-8">
            HydroGate membantu petugas memantau tinggi air, kondisi perangkat,
            status pintu air, dan riwayat sensor dari satu antarmuka yang rapi,
            cepat dibaca, dan siap digunakan untuk pengambilan keputusan.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="/auth/login"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0F172A] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_38px_rgba(15,23,42,0.2)] transition-all hover:-translate-y-0.5 hover:bg-[#1E293B]"
            >
              Lihat Dasbor
              <ArrowRight size={16} />
            </a>
            <a
              href="#live-status"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#99F6E4] bg-white px-6 py-3 text-sm font-semibold text-[#0F766E] shadow-[0_12px_30px_rgba(20,184,166,0.12)] transition-all hover:-translate-y-0.5 hover:border-[#14B8A6] hover:bg-[#F0FDFA]"
            >
              Monitoring Langsung
              <ArrowDownRight size={16} />
            </a>
          </div>

          <div className="mt-12 grid max-w-3xl gap-3 sm:grid-cols-3">
            {summaryCards.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-lg border border-[#E2E8F0] bg-white p-4 shadow-[0_12px_32px_rgba(15,23,42,0.05)]"
                >
                  <Icon size={18} className="mb-5 text-[#0F766E]" />
                  <p className="min-h-8 text-2xl font-semibold tracking-normal text-[#0F172A]">
                    {displayMetric(loading, stat.value)}
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative">
          <RiverMonitoringMap
            devices={devices}
            loading={loading}
            error={error}
            nowMs={lastFetchedAt?.getTime() ?? 0}
          />
        </div>
      </div>
    </section>
  );
}
