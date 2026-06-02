export type DynamoDeviceItem = {
  device_id?: string;
  jarak_cm?: number | string;
  hcsr_cm?: number | string;
  water_level?: number | string;
  water_status?: string;
  status?: string;
  gate_status?: string;
  servo_angle?: number | string;
  datetime?: string;
  source?: string;
  timestamp?: string | number;
  createdAt?: string | number;
};

export type DeviceWaterStatus = "AMAN" | "SIAGA" | "BAHAYA";

export type DeviceSnapshot = {
  deviceId: string;
  waterStatus: DeviceWaterStatus;
  waterLevel: number;
  distanceCm: number;
  gateStatus: string;
  servoAngle: number;
  source: string;
  timestamp: number | string | null;
  createdAt: number | string | null;
  datetime: string;
  timestampMs: number;
  lastUpdateLabel: string;
};

const AMAN_VALUES = new Set(["AMAN", "SAFE", "NORMAL", "HIJAU", "GREEN"]);
const SIAGA_VALUES = new Set(["SIAGA", "WASPADA", "KUNING", "YELLOW", "WARNING"]);
const BAHAYA_VALUES = new Set(["BAHAYA", "DANGER", "MERAH", "RED", "ALERT"]);

function parseNumber(value: unknown): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function parseDateString(value: string): number {
  const normalized = value.includes("T") ? value : value.replace(" ", "T");
  const parsed = new Date(normalized).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
}

export function toTimestampMs(value: unknown): number {
  if (typeof value === "number" || typeof value === "string") {
    const asNumber = Number(value);

    if (Number.isFinite(asNumber) && asNumber > 0) {
      if (asNumber > 1_000_000_000_000) {
        return asNumber;
      }

      if (asNumber > 1_000_000_000) {
        return asNumber * 1000;
      }
    }

    if (typeof value === "string") {
      return parseDateString(value);
    }
  }

  return 0;
}

export function getItemTimestampMs(item: DynamoDeviceItem): number {
  const fromTimestamp = toTimestampMs(item.timestamp);
  if (fromTimestamp > 0) return fromTimestamp;

  const fromCreatedAt = toTimestampMs(item.createdAt);
  if (fromCreatedAt > 0) return fromCreatedAt;

  if (item.datetime) {
    return parseDateString(item.datetime);
  }

  return 0;
}

export function normalizeWaterStatus(value?: string): DeviceWaterStatus {
  const normalized = String(value || "").trim().toUpperCase();

  if (BAHAYA_VALUES.has(normalized)) {
    return "BAHAYA";
  }

  if (SIAGA_VALUES.has(normalized)) {
    return "SIAGA";
  }

  if (AMAN_VALUES.has(normalized)) {
    return "AMAN";
  }

  return "AMAN";
}

export function toDeviceSnapshot(item: DynamoDeviceItem): DeviceSnapshot {
  const timestampMs = getItemTimestampMs(item);
  const waterStatus = normalizeWaterStatus(
    item.water_status || item.status || item.gate_status
  );

  return {
    deviceId: String(item.device_id || "unknown-device"),
    waterStatus,
    waterLevel: parseNumber(item.water_level),
    distanceCm: parseNumber(item.hcsr_cm ?? item.jarak_cm),
    gateStatus: String(item.gate_status || "-"),
    servoAngle: parseNumber(item.servo_angle),
    source: String(item.source || "-"),
    timestamp: item.timestamp ?? null,
    createdAt: item.createdAt ?? null,
    datetime: String(item.datetime || ""),
    timestampMs,
    lastUpdateLabel:
      timestampMs > 0 ? new Date(timestampMs).toLocaleString("id-ID") : "-",
  };
}
