"use client";

import { useMemo, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  Clock3,
  Database,
  DownloadCloud,
  FileText,
  Layers3,
  PlayCircle,
  Send,
  ServerCog,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

interface AnalisisData {
  device_id: string;
  processed_at: string;
  avg_water_level: number | null;
  avg_jarak_cm: number | null;
  dominant_status: string | null;
  danger_count: number | null;
}

interface SensorForm {
  device_id: string;
  water_level: string;
  jarak_cm: string;
  status: string;
  gate_status: string;
  timestamp: string;
  datetime: string;
}

interface ApiResponse<T = unknown> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
}

type ProcessStatus =
  | "Menunggu"
  | "Mengirim JSON ke HDFS"
  | "Berhasil menulis ke HDFS"
  | "Menjalankan analisis"
  | "Analisis selesai"
  | "Berhasil membaca hasil"
  | "Error";

const initialForm: SensorForm = {
  device_id: "ESP-001",
  water_level: "68",
  jarak_cm: "25",
  status: "SIAGA",
  gate_status: "TERBUKA",
  timestamp: "1780839200",
  datetime: "2026-06-07 21:00:00",
};

const bigDataSteps = [
  "Web Dashboard",
  "API Next.js",
  "File JSON",
  "HDFS",
  "MapReduce/Spark",
  "Output Analisis",
  "Dashboard",
];

const hdfsOperations = [
  {
    badge: "Write",
    title: "Write Data Sensor",
    description:
      "Data histori dari perangkat HydroGate dikirim dalam bentuk JSON ke API, lalu API menyimpannya ke HDFS sebagai data mentah untuk kebutuhan analisis.",
    command: [
      "POST /api/analisis/hdfs/write",
      "hdfs dfs -mkdir -p /hydrogate/raw",
      "hdfs dfs -put -f tmp/hydrogate/hydrogate-{timestamp}.json /hydrogate/raw/",
    ],
    icon: Database,
  },
  {
    badge: "Process",
    title: "Process Data",
    description:
      "Data yang sudah tersimpan diproses menggunakan MapReduce atau Spark untuk menghasilkan ringkasan kondisi air.",
    command: [
      "POST /api/analisis/hdfs/process",
      "hdfs dfs -rm -r -f /hydrogate/output",
      "hadoop jar hydrogate.jar id.ac.polinema.App /hydrogate/raw /hydrogate/output",
    ],
    icon: ServerCog,
  },
  {
    badge: "Read",
    title: "Read Result",
    description:
      "Hasil analisis dibaca kembali oleh API agar dashboard dapat menampilkan insight seperti status banjir, rata-rata tinggi air, dan jumlah kondisi bahaya.",
    command: ["GET /api/analisis/hdfs/result", "hdfs dfs -cat /hydrogate/output/part-00000"],
    icon: FileText,
  },
];

function formatValue(value: number | null | undefined, suffix = "") {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "-";
  }

  return `${value}${suffix}`;
}

function formatDate(value: string | null | undefined) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getSummary(data: AnalisisData[]) {
  const totalDataSensor = data.length > 0 ? data.length : "-";
  const jumlahDevice = data.length > 0 ? new Set(data.map((item) => item.device_id).filter(Boolean)).size : "-";
  const statusCounter = data.reduce<Record<string, number>>((acc, item) => {
    const status = item.dominant_status?.trim();

    if (!status) {
      return acc;
    }

    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const statusDominan =
    Object.entries(statusCounter).sort((a, b) => b[1] - a[1])[0]?.[0] || "Belum tersedia";

  const latestProcessed = data
    .map((item) => item.processed_at)
    .filter(Boolean)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];

  return [
    {
      label: "Total Data Sensor",
      value: totalDataSensor,
      icon: Database,
    },
    {
      label: "Jumlah Device",
      value: jumlahDevice,
      icon: Layers3,
    },
    {
      label: "Status Dominan",
      value: statusDominan,
      icon: CheckCircle2,
    },
    {
      label: "Terakhir Diproses",
      value: latestProcessed ? formatDate(latestProcessed) : "Belum tersedia",
      icon: Clock3,
    },
  ];
}

function statusClass(status: ProcessStatus) {
  if (status === "Error") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (status === "Menunggu") {
    return "border-gray-200 bg-gray-50 text-gray-700";
  }

  if (status === "Mengirim JSON ke HDFS" || status === "Menjalankan analisis") {
    return "border-cyan-200 bg-cyan-50 text-cyan-700";
  }

  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

function buildSensorPayload(form: SensorForm) {
  return {
    device_id: form.device_id.trim(),
    water_level: form.water_level.trim() === "" ? "" : Number(form.water_level),
    jarak_cm: form.jarak_cm.trim() === "" ? "" : Number(form.jarak_cm),
    status: form.status.trim(),
    gate_status: form.gate_status.trim(),
    timestamp: form.timestamp.trim() === "" ? "" : Number(form.timestamp),
    datetime: form.datetime.trim(),
  };
}

export default function DashboardAnalisis() {
  const [analisisData, setAnalisisData] = useState<AnalisisData[]>([]);
  const [form, setForm] = useState<SensorForm>(initialForm);
  const [processStatus, setProcessStatus] = useState<ProcessStatus>("Menunggu");
  const [message, setMessage] = useState("Isi JSON sensor, lalu kirim ke HDFS untuk memulai alur analisis.");
  const [loadingAction, setLoadingAction] = useState<"write" | "process" | "result" | null>(null);

  const summaryCards = useMemo(() => getSummary(analisisData), [analisisData]);

  const updateForm = (field: keyof SensorForm, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleWrite = async () => {
    try {
      setLoadingAction("write");
      setProcessStatus("Mengirim JSON ke HDFS");
      setMessage("Mengirim JSON sensor ke API untuk disimpan ke HDFS...");

      const response = await fetch("/api/analisis/hdfs/write", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildSensorPayload(form)),
      });

      const json: ApiResponse = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.message || json.error || "Gagal menulis JSON ke HDFS.");
      }

      setProcessStatus("Berhasil menulis ke HDFS");
      setMessage(json.message || "Berhasil menulis JSON sensor ke HDFS.");
    } catch (error) {
      setProcessStatus("Error");
      setMessage(error instanceof Error ? error.message : "Gagal menulis JSON ke HDFS.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleProcess = async () => {
    try {
      setLoadingAction("process");
      setProcessStatus("Menjalankan analisis");
      setMessage("Menjalankan proses MapReduce/Spark dari data mentah HDFS...");

      const response = await fetch("/api/analisis/hdfs/process", {
        method: "POST",
      });

      const json: ApiResponse = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.message || json.error || "Gagal menjalankan analisis HDFS.");
      }

      setProcessStatus("Analisis selesai");
      setMessage(json.message || "Analisis HDFS selesai dijalankan.");
    } catch (error) {
      setProcessStatus("Error");
      setMessage(error instanceof Error ? error.message : "Gagal menjalankan analisis HDFS.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleResult = async () => {
    try {
      setLoadingAction("result");
      setProcessStatus("Berhasil membaca hasil");
      setMessage("Membaca hasil analisis dari HDFS...");

      const response = await fetch("/api/analisis/hdfs/result", {
        cache: "no-store",
      });

      const json: ApiResponse<AnalisisData[]> = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.message || json.error || "Gagal membaca hasil analisis HDFS.");
      }

      setAnalisisData(Array.isArray(json.data) ? json.data : []);
      setProcessStatus("Berhasil membaca hasil");
      setMessage(json.message || "Berhasil membaca hasil analisis HDFS.");
    } catch (error) {
      setProcessStatus("Error");
      setMessage(error instanceof Error ? error.message : "Gagal membaca hasil analisis HDFS.");
    } finally {
      setLoadingAction(null);
    }
  };

  const actionDisabled = loadingAction !== null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main className="lg:ml-64">
        <Navbar />

        <div className="space-y-8 px-5 py-6 md:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Analisis</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600 md:text-base">
                Pantau alur pengolahan data HydroGate dari penyimpanan HDFS sampai hasil analisis.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-700">
              <BarChart3 className="h-4 w-4" />
              Big Data HDFS
            </div>
          </div>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.label}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <p className="text-sm font-medium text-gray-600">{card.label}</p>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                  <p className="break-words text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
              );
            })}
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
              <p className="text-sm leading-6 text-emerald-900">
                DynamoDB digunakan untuk monitoring realtime, sedangkan HDFS digunakan untuk menyimpan dan mengolah histori data sensor dalam skala besar.
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-5 shadow-sm">
              <p className="text-sm leading-6 text-cyan-900">
                Data dari dashboard dikirim dalam format JSON ke API server, lalu API menyimpan file tersebut ke HDFS. Setelah itu data diproses menggunakan MapReduce/Spark dan hasilnya ditampilkan kembali di dashboard.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Alur Big Data HydroGate</h2>
              <p className="mt-1 text-sm text-gray-600">
                Data bergerak dari dashboard, dikirim ke API, disimpan ke HDFS, diproses, lalu dibaca kembali sebagai hasil analisis.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-7">
              {bigDataSteps.map((step, index) => (
                <div key={step} className="relative">
                  <div className="flex h-full min-h-24 flex-col justify-between rounded-2xl border border-gray-200 bg-slate-50 p-4">
                    <span className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                      Step {index + 1}
                    </span>
                    <p className="mt-4 text-sm font-semibold text-gray-900">{step}</p>
                  </div>
                  {index < bigDataSteps.length - 1 && (
                    <div className="absolute -right-3 top-1/2 z-10 hidden text-sm font-semibold text-cyan-600 md:block">
                      -&gt;
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Kirim JSON Sensor ke HDFS</h2>
                <p className="mt-1 max-w-3xl text-sm leading-6 text-gray-600">
                  Isi data sensor sederhana, lalu kirim ke API Next.js. API akan membuat file JSON lokal sementara dan mengunggahnya ke folder raw HDFS.
                </p>
              </div>

              <div className={`inline-flex w-fit items-center rounded-full border px-4 py-2 text-sm font-semibold ${statusClass(processStatus)}`}>
                {processStatus}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <label className="space-y-2">
                <span className="text-sm font-medium text-gray-700">Device ID</span>
                <input
                  value={form.device_id}
                  onChange={(event) => updateForm("device_id", event.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  placeholder="ESP-001"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-gray-700">Water Level</span>
                <input
                  value={form.water_level}
                  onChange={(event) => updateForm("water_level", event.target.value)}
                  type="number"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  placeholder="68"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-gray-700">Jarak Air</span>
                <input
                  value={form.jarak_cm}
                  onChange={(event) => updateForm("jarak_cm", event.target.value)}
                  type="number"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  placeholder="25"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-gray-700">Status</span>
                <select
                  value={form.status}
                  onChange={(event) => updateForm("status", event.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                >
                  <option value="">Pilih status</option>
                  <option value="AMAN">AMAN</option>
                  <option value="SIAGA">SIAGA</option>
                  <option value="BAHAYA">BAHAYA</option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-gray-700">Gate Status</span>
                <select
                  value={form.gate_status}
                  onChange={(event) => updateForm("gate_status", event.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                >
                  <option value="">Pilih gate</option>
                  <option value="TERTUTUP">TERTUTUP</option>
                  <option value="SEPARUH TERBUKA">SEPARUH TERBUKA</option>
                  <option value="TERBUKA">TERBUKA</option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-gray-700">Timestamp</span>
                <input
                  value={form.timestamp}
                  onChange={(event) => updateForm("timestamp", event.target.value)}
                  type="number"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  placeholder="1780839200"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-gray-700">Datetime</span>
                <input
                  value={form.datetime}
                  onChange={(event) => updateForm("datetime", event.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                  placeholder="2026-06-07 21:00:00"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-gray-700">
                {message}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleWrite}
                  disabled={actionDisabled}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-cyan-300"
                >
                  <Send className="h-4 w-4" />
                  {loadingAction === "write" ? "Mengirim..." : "Kirim JSON ke HDFS"}
                </button>

                <button
                  type="button"
                  onClick={handleProcess}
                  disabled={actionDisabled}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  <PlayCircle className="h-4 w-4" />
                  {loadingAction === "process" ? "Memproses..." : "Jalankan Analisis"}
                </button>

                <button
                  type="button"
                  onClick={handleResult}
                  disabled={actionDisabled}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <DownloadCloud className="h-4 w-4" />
                  {loadingAction === "result" ? "Mengambil..." : "Ambil Hasil Analisis"}
                </button>
              </div>
            </div>
          </section>

          <section>
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-gray-900">Operasi HDFS</h2>
              <p className="mt-1 text-sm text-gray-600">
                Tiga tahapan utama untuk menulis, memproses, dan membaca hasil analisis data HydroGate.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              {hdfsOperations.map((operation) => {
                const Icon = operation.icon;

                return (
                  <div
                    key={operation.badge}
                    className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                  >
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
                        {operation.badge}
                      </span>
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
                        <Icon className="h-5 w-5" />
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900">{operation.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-gray-600">{operation.description}</p>

                    <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-4">
                      <pre className="overflow-x-auto whitespace-pre-wrap text-xs leading-6 text-cyan-100">
                        <code>{operation.command.join("\n")}</code>
                      </pre>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900">Hasil Analisis</h2>
              <p className="mt-1 text-sm text-gray-600">
                Ringkasan hasil pengolahan histori sensor dari HDFS.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="border-b border-gray-200 bg-gray-50 text-sm text-gray-700">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Waktu</th>
                    <th className="px-6 py-3 font-semibold">Device ID</th>
                    <th className="px-6 py-3 font-semibold">Rata-rata Water Level</th>
                    <th className="px-6 py-3 font-semibold">Rata-rata Jarak Air</th>
                    <th className="px-6 py-3 font-semibold">Status Dominan</th>
                    <th className="px-6 py-3 font-semibold">Jumlah Bahaya</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {analisisData.map((item, index) => (
                    <tr key={`${item.device_id}-${item.processed_at}-${index}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDate(item.processed_at)}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{item.device_id || "-"}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{formatValue(item.avg_water_level)}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{formatValue(item.avg_jarak_cm, " cm")}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.dominant_status || "-"}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{formatValue(item.danger_count)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {analisisData.length === 0 && (
                <div className="flex min-h-48 flex-col items-center justify-center px-6 py-10 text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
                    <Database className="h-6 w-6" />
                  </div>
                  <p className="max-w-xl text-sm leading-6 text-gray-600">
                    Belum ada hasil analisis HDFS. Jalankan proses MapReduce atau Spark terlebih dahulu.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
