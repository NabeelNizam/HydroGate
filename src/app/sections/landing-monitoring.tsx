"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { DeviceSnapshot, DynamoDeviceItem } from "@/lib/device-monitoring";
import { getItemTimestampMs } from "@/lib/device-monitoring";

type RecordsResponse = {
  items?: DynamoDeviceItem[];
  latest?: DynamoDeviceItem | null;
  totalItems?: number;
  error?: string;
  detail?: string;
};

type DevicesResponse = {
  devices?: DeviceSnapshot[];
  totalDevices?: number;
  error?: string;
  detail?: string;
};

type LandingMonitoringContextValue = {
  records: DynamoDeviceItem[];
  devices: DeviceSnapshot[];
  latestRecord: DynamoDeviceItem | null;
  latestDevice: DeviceSnapshot | null;
  totalRecords: number | null;
  totalDevices: number;
  onlineDevices: number;
  loading: boolean;
  refreshing: boolean;
  error: string;
  lastFetchedAt: Date | null;
  refresh: () => Promise<void>;
};

const ONLINE_WINDOW_MS = 60_000;

const LandingMonitoringContext =
  createContext<LandingMonitoringContextValue | null>(null);

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: "no-store" });
  const json = (await response.json()) as T & {
    error?: string;
    detail?: string;
  };

  if (!response.ok) {
    throw new Error(json.detail || json.error || "Gagal mengambil data");
  }

  return json;
}

function isDeviceOnline(device: DeviceSnapshot, nowMs: number) {
  return (
    device.timestampMs > 0 &&
    nowMs > 0 &&
    nowMs - device.timestampMs <= ONLINE_WINDOW_MS
  );
}

function getLatestRecord(records: DynamoDeviceItem[]) {
  return [...records].sort(
    (a, b) => getItemTimestampMs(b) - getItemTimestampMs(a)
  )[0] ?? null;
}

export function LandingMonitoringProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [records, setRecords] = useState<DynamoDeviceItem[]>([]);
  const [devices, setDevices] = useState<DeviceSnapshot[]>([]);
  const [totalRecords, setTotalRecords] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastFetchedAt, setLastFetchedAt] = useState<Date | null>(null);
  const [nowMs, setNowMs] = useState(0);

  const refresh = useCallback(async () => {
    const errors: string[] = [];

    try {
      setRefreshing(true);

      const [recordsResult, devicesResult] = await Promise.allSettled([
        fetchJson<RecordsResponse>("/api/dynamodb"),
        fetchJson<DevicesResponse>("/api/dynamodb/devices"),
      ]);

      if (recordsResult.status === "fulfilled") {
        const nextRecords = recordsResult.value.items ?? [];
        setRecords(nextRecords);
        setTotalRecords(recordsResult.value.totalItems ?? nextRecords.length);
      } else {
        setRecords([]);
        setTotalRecords(null);
        errors.push(recordsResult.reason instanceof Error
          ? recordsResult.reason.message
          : "Data sensor tidak dapat dimuat");
      }

      if (devicesResult.status === "fulfilled") {
        setDevices(devicesResult.value.devices ?? []);
      } else {
        setDevices([]);
        errors.push(devicesResult.reason instanceof Error
          ? devicesResult.reason.message
          : "Data perangkat tidak dapat dimuat");
      }

      setError(errors.join(" | "));
      const fetchedAt = new Date();
      setLastFetchedAt(fetchedAt);
      setNowMs(fetchedAt.getTime());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void refresh();

    const polling = setInterval(() => {
      void refresh();
    }, 30_000);

    return () => clearInterval(polling);
  }, [refresh]);

  const value = useMemo<LandingMonitoringContextValue>(() => {
    const latestDevice = devices[0] ?? null;

    return {
      records,
      devices,
      latestRecord: getLatestRecord(records),
      latestDevice,
      totalRecords,
      totalDevices: devices.length,
      onlineDevices: devices.filter((device) => isDeviceOnline(device, nowMs))
        .length,
      loading,
      refreshing,
      error,
      lastFetchedAt,
      refresh,
    };
  }, [
    records,
    devices,
    totalRecords,
    loading,
    refreshing,
    error,
    lastFetchedAt,
    nowMs,
    refresh,
  ]);

  return (
    <LandingMonitoringContext.Provider value={value}>
      {children}
    </LandingMonitoringContext.Provider>
  );
}

export function useLandingMonitoring() {
  const context = useContext(LandingMonitoringContext);

  if (!context) {
    throw new Error(
      "useLandingMonitoring harus digunakan di dalam LandingMonitoringProvider"
    );
  }

  return context;
}
