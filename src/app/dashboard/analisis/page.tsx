"use client";

import { useMemo, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  Database,
  DownloadCloud,
  FileText,
  Layers3,
  PlayCircle,
  Send,
  ServerCog,
  Terminal,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

interface AnalisisData {
  deviceId: string;
  date: string;
  status: string;
  count: number;
}

type StatusKey = "AMAN" | "SIAGA" | "BAHAYA";

interface ChartRow {
  deviceId: string;
  date: string;
  AMAN: number;
  SIAGA: number;
  BAHAYA: number;
}

interface ApiResponse<T = unknown> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
}

interface SshTestChecks {
  hostname: string;
  whoami: string;
  hdfsRoot: string;
}

interface SshTestResponse {
  success?: boolean;
  host?: string;
  user?: string;
  checks?: SshTestChecks;
  message?: string;
  error?: string;
}

interface HdfsWriteResponse {
  success?: boolean;
  message?: string;
  error?: string;
  totalItems?: number;
  filename?: string;
  hdfsPath?: string;
  hdfsTarget?: string;
}

type ProcessStatus =
  | "Menunggu"
  | "Mengambil data DynamoDB"
  | "Berhasil menulis ke HDFS"
  | "Menjalankan analisis"
  | "Analisis selesai"
  | "Berhasil membaca hasil"
  | "Error";

const bigDataSteps = [
  "Web Dashboard",
  "API Next.js",
  "File CSV",
  "HDFS",
  "MapReduce/Spark",
  "Output Analisis",
  "Dashboard",
];

const hdfsOperations = [
  {
    badge: "Write",
    title: "Write Data DynamoDB",
    description:
      "Data histori perangkat HydroGate diambil dari DynamoDB oleh API server, diubah menjadi CSV sederhana, lalu dikirim ke HDFS sebagai data mentah untuk kebutuhan analisis.",
    command: [
      "POST /api/analisis/hdfs/write",
      "scp tmp/hydrogate/hydrogate-dynamodb-{timestamp}.csv hadoopuser@192.168.1.109:/tmp/",
      "ssh hadoopuser@192.168.1.109 /usr/local/hadoop/bin/hdfs dfs -mkdir -p /hydrogate/raw",
      "ssh hadoopuser@192.168.1.109 /usr/local/hadoop/bin/hdfs dfs -put -f /tmp/hydrogate-dynamodb-{timestamp}.csv /hydrogate/raw/",
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
      "ssh hadoopuser@192.168.1.109 /usr/local/hadoop/bin/hdfs dfs -rm -r -f /hydrogate/output",
      "ssh hadoopuser@192.168.1.109 /usr/local/hadoop/bin/hadoop jar /home/hadoopuser/hydrogate.jar id.ac.polinema.App /hydrogate/raw /hydrogate/output",
    ],
    icon: ServerCog,
  },
  {
    badge: "Read",
    title: "Read Result",
    description:
      "Hasil analisis dibaca kembali oleh API agar dashboard dapat menampilkan insight seperti status banjir, rata-rata tinggi air, dan jumlah kondisi bahaya.",
    command: [
      "GET /api/analisis/hdfs/result",
      "ssh hadoopuser@192.168.1.109 /usr/local/hadoop/bin/hdfs dfs -cat /hydrogate/output/part-*",
    ],
    icon: FileText,
  },
];

const ALL_DEVICES = "Semua Device";
const DEFAULT_DEVICE_OPTIONS = ["ESP-001"];
const STATUS_KEYS: StatusKey[] = ["AMAN", "SIAGA", "BAHAYA"];
const STATUS_COLORS: Record<StatusKey, string> = {
  AMAN: "#059669",
  SIAGA: "#d97706",
  BAHAYA: "#dc2626",
};

function formatValue(value: number | null | undefined, suffix = "") {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "-";
  }

  return `${value.toLocaleString("id-ID")}${suffix}`;
}

function getSummary(data: AnalisisData[]) {
  const totals = getStatusTotals(data);

  return [
    {
      label: "Total AMAN",
      value: data.length > 0 ? formatValue(totals.AMAN) : "-",
      icon: CheckCircle2,
    },
    {
      label: "Total SIAGA",
      value: data.length > 0 ? formatValue(totals.SIAGA) : "-",
      icon: Layers3,
    },
    {
      label: "Total BAHAYA",
      value: data.length > 0 ? formatValue(totals.BAHAYA) : "-",
      icon: FileText,
    },
  ];
}

function getStatusTotals(data: AnalisisData[]) {
  return data.reduce<Record<StatusKey, number>>(
    (acc, item) => {
      if (STATUS_KEYS.includes(item.status as StatusKey)) {
        acc[item.status as StatusKey] += item.count;
      }

      return acc;
    },
    {
      AMAN: 0,
      SIAGA: 0,
      BAHAYA: 0,
    }
  );
}

function buildChartData(data: AnalisisData[]): ChartRow[] {
  const grouped = new Map<string, ChartRow>();

  data.forEach((item) => {
    if (!STATUS_KEYS.includes(item.status as StatusKey)) {
      return;
    }

    const deviceId = item.deviceId || "-";
    const date = item.date || "-";
    const key = `${deviceId}|${date}`;
    const existing =
      grouped.get(key) ||
      ({
        deviceId,
        date,
        AMAN: 0,
        SIAGA: 0,
        BAHAYA: 0,
      } satisfies ChartRow);

    existing[item.status as StatusKey] += item.count;
    grouped.set(key, existing);
  });

  return [...grouped.values()].sort((a, b) => {
    const byDate = a.date.localeCompare(b.date);
    return byDate !== 0 ? byDate : a.deviceId.localeCompare(b.deviceId);
  });
}

function getChartMax(data: ChartRow[]) {
  const maxValue = Math.max(...data.flatMap((item) => STATUS_KEYS.map((status) => item[status])), 0);
  return maxValue > 0 ? maxValue : 1;
}

function statusClass(status: ProcessStatus) {
  if (status === "Error") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (status === "Menunggu") {
    return "border-gray-200 bg-gray-50 text-gray-700";
  }

  if (status === "Mengambil data DynamoDB" || status === "Menjalankan analisis") {
    return "border-cyan-200 bg-cyan-50 text-cyan-700";
  }

  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

export default function DashboardAnalisis() {
  const [analisisData, setAnalisisData] = useState<AnalisisData[]>([]);
  const [processStatus, setProcessStatus] = useState<ProcessStatus>("Menunggu");
  const [message, setMessage] = useState("Ambil data sensor dari DynamoDB, lalu kirim ke HDFS untuk memulai alur analisis.");
  const [loadingAction, setLoadingAction] = useState<"write" | "process" | "result" | "sshTest" | null>(null);
  const [sshTestResult, setSshTestResult] = useState<SshTestResponse | null>(null);
  const [writeSummary, setWriteSummary] = useState<HdfsWriteResponse | null>(null);
  const [selectedDevice, setSelectedDevice] = useState(ALL_DEVICES);

  const deviceOptions = useMemo(() => {
    const devices = new Set(DEFAULT_DEVICE_OPTIONS);

    analisisData.forEach((item) => {
      if (item.deviceId) {
        devices.add(item.deviceId);
      }
    });

    return [ALL_DEVICES, ...[...devices].sort((a, b) => a.localeCompare(b))];
  }, [analisisData]);

  const filteredData = useMemo(() => {
    if (selectedDevice === ALL_DEVICES) {
      return analisisData;
    }

    return analisisData.filter((item) => item.deviceId === selectedDevice);
  }, [analisisData, selectedDevice]);

  const chartData = useMemo(() => buildChartData(filteredData), [filteredData]);
  const chartMax = useMemo(() => getChartMax(chartData), [chartData]);
  const summaryCards = useMemo(() => getSummary(filteredData), [filteredData]);

  const handleWrite = async () => {
    try {
      setLoadingAction("write");
      setProcessStatus("Mengambil data DynamoDB");
      setMessage("Mengambil data sensor dari DynamoDB, membuat CSV, lalu mengirim ke HDFS...");
      setWriteSummary(null);

      const response = await fetch("/api/analisis/hdfs/write", {
        method: "POST",
      });

      const json: HdfsWriteResponse = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.message || json.error || "Gagal mengambil data DynamoDB dan mengirim ke HDFS.");
      }

      setWriteSummary(json);
      setProcessStatus("Berhasil menulis ke HDFS");
      setMessage(json.message || "Berhasil mengambil data DynamoDB dan mengirim CSV ke HDFS.");
    } catch (error) {
      setProcessStatus("Error");
      setMessage(error instanceof Error ? error.message : "Gagal mengambil data DynamoDB dan mengirim CSV ke HDFS.");
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

  const handleSshTest = async () => {
    try {
      setLoadingAction("sshTest");
      setSshTestResult(null);

      const response = await fetch("/api/analisis/hdfs/ssh-test", {
        method: "POST",
      });

      const json: SshTestResponse = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error || json.message || "Gagal koneksi SSH ke VM Hadoop.");
      }

      setSshTestResult(json);
    } catch (error) {
      setSshTestResult({
        success: false,
        message: "Gagal koneksi SSH ke VM Hadoop.",
        error:
          error instanceof Error
            ? `${error.message} Pastikan SSH tanpa password dari terminal server Next.js ke VM Hadoop sudah aktif.`
            : "Pastikan SSH tanpa password dari terminal server Next.js ke VM Hadoop sudah aktif.",
      });
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
                Data histori diambil dari DynamoDB oleh API server, diubah menjadi CSV, lalu disimpan ke HDFS. Setelah itu data diproses menggunakan MapReduce/Spark dan hasilnya ditampilkan kembali di dashboard.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Koneksi Hadoop NameNode</h2>
                <p className="mt-1 max-w-3xl text-sm leading-6 text-gray-600">
                  Test koneksi SSH dari API server Next.js ke VM Hadoop NameNode, lalu baca hostname, user aktif, dan root HDFS.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSshTest}
                disabled={actionDisabled}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-fit"
              >
                <Terminal className="h-4 w-4" />
                {loadingAction === "sshTest" ? "Mengetes..." : "Test Koneksi Hadoop"}
              </button>
            </div>

            {loadingAction === "sshTest" && (
              <div className="mt-5 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-medium text-cyan-800">
                Menghubungi VM Hadoop melalui API server Next.js...
              </div>
            )}

            {sshTestResult?.success && sshTestResult.checks && (
              <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Hostname</p>
                  <p className="mt-2 break-words text-sm font-semibold text-emerald-950">{sshTestResult.checks.hostname || "-"}</p>
                </div>

                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Whoami</p>
                  <p className="mt-2 break-words text-sm font-semibold text-emerald-950">{sshTestResult.checks.whoami || "-"}</p>
                </div>

                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Target</p>
                  <p className="mt-2 break-words text-sm font-semibold text-emerald-950">
                    {sshTestResult.user}@{sshTestResult.host}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 lg:col-span-3">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-cyan-200">HDFS Root</p>
                  <pre className="max-h-72 overflow-auto whitespace-pre-wrap text-xs leading-6 text-cyan-100">
                    <code>{sshTestResult.checks.hdfsRoot || "-"}</code>
                  </pre>
                </div>
              </div>
            )}

            {sshTestResult && !sshTestResult.success && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800">
                <p className="font-semibold">{sshTestResult.message || "Gagal koneksi SSH ke VM Hadoop."}</p>
                <p className="mt-1 break-words">{sshTestResult.error || "Pastikan SSH tanpa password sudah aktif."}</p>
              </div>
            )}
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
                <h2 className="text-xl font-semibold text-gray-900">Kirim Data DynamoDB ke HDFS</h2>
                <p className="mt-1 max-w-3xl text-sm leading-6 text-gray-600">
                  API Next.js mengambil data sensor dari DynamoDB, membuat file CSV, mengirimnya ke NameNode melalui SCP, lalu memasukkannya ke folder raw HDFS.
                </p>
              </div>

              <div className={`inline-flex w-fit items-center rounded-full border px-4 py-2 text-sm font-semibold ${statusClass(processStatus)}`}>
                {processStatus}
              </div>
            </div>

            {writeSummary?.success && (
              <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Total DynamoDB</p>
                  <p className="mt-2 break-words text-lg font-bold text-emerald-950">{writeSummary.totalItems ?? 0}</p>
                </div>

                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Nama File</p>
                  <p className="mt-2 break-words text-sm font-semibold text-emerald-950">{writeSummary.filename || "-"}</p>
                </div>

                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Target HDFS</p>
                  <p className="mt-2 break-words text-sm font-semibold text-emerald-950">{writeSummary.hdfsTarget || "/hydrogate/raw"}</p>
                </div>
              </div>
            )}

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
                  {loadingAction === "write" ? "Mengirim..." : "Ambil Data DynamoDB & Kirim ke HDFS"}
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
            <div className="flex flex-col gap-4 border-b border-gray-200 p-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Hasil Analisis</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Ringkasan status per device dan tanggal dari output MapReduce HDFS.
                </p>
              </div>

              <label className="w-full space-y-2 sm:w-72">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-600">Filter Device</span>
                <select
                  value={selectedDevice}
                  onChange={(event) => setSelectedDevice(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                >
                  {deviceOptions.map((device) => (
                    <option key={device} value={device}>
                      {device}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {analisisData.length > 0 && (
              <div className="border-b border-gray-200 p-6">
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">Grafik Status Harian</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      X axis tanggal, series AMAN/SIAGA/BAHAYA, difilter berdasarkan device.
                    </p>
                  </div>
                  <div className="text-sm font-semibold text-gray-700">
                    {selectedDevice === ALL_DEVICES ? "Semua device" : selectedDevice}
                  </div>
                </div>

                {chartData.length > 0 ? (
                  <div className="min-h-80 overflow-x-auto rounded-xl border border-gray-200 bg-slate-50 p-4">
                    <div className="mb-4 flex flex-wrap items-center gap-4">
                      {STATUS_KEYS.map((status) => (
                        <div key={status} className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                          <span
                            className="h-3 w-3 rounded-sm"
                            style={{ backgroundColor: STATUS_COLORS[status] }}
                          />
                          {status}
                        </div>
                      ))}
                    </div>

                    <div className="flex min-h-64 min-w-[720px] items-end gap-5 border-b border-l border-gray-200 px-4 pb-8">
                      {chartData.map((item) => (
                        <div key={`${item.deviceId}-${item.date}`} className="flex min-w-28 flex-1 flex-col items-center">
                          <div className="flex h-52 w-full items-end justify-center gap-2">
                            {STATUS_KEYS.map((status) => {
                              const value = item[status];
                              const height = value > 0 ? Math.max((value / chartMax) * 100, 4) : 0;

                              return (
                                <div
                                  key={status}
                                  title={`${item.deviceId} - ${item.date} - ${status}: ${formatValue(value)}`}
                                  className="w-6 rounded-t transition"
                                  style={{
                                    backgroundColor: STATUS_COLORS[status],
                                    height: `${height}%`,
                                  }}
                                />
                              );
                            })}
                          </div>
                          <div className="mt-3 max-w-32 truncate text-center text-xs font-semibold text-gray-800">{item.date}</div>
                          <div className="mt-1 max-w-32 truncate text-center text-[11px] text-gray-500">{item.deviceId}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex min-h-40 items-center justify-center rounded-xl border border-gray-200 bg-slate-50 px-6 py-8 text-center text-sm text-gray-600">
                    Tidak ada data untuk device yang dipilih.
                  </div>
                )}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="border-b border-gray-200 bg-gray-50 text-sm text-gray-700">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Device ID</th>
                    <th className="px-6 py-3 font-semibold">Tanggal</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                    <th className="px-6 py-3 font-semibold">Jumlah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.map((item, index) => (
                    <tr key={`${item.deviceId}-${item.date}-${item.status}-${index}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{item.deviceId || "-"}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.date || "-"}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{item.status || "-"}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{formatValue(item.count)}</td>
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

              {analisisData.length > 0 && filteredData.length === 0 && (
                <div className="flex min-h-32 items-center justify-center px-6 py-8 text-center text-sm text-gray-600">
                  Tidak ada hasil analisis untuk device yang dipilih.
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
