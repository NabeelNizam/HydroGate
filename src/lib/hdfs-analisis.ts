import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export type AnalisisData = {
  device_id: string;
  processed_at: string;
  avg_water_level: number | null;
  avg_jarak_cm: number | null;
  dominant_status: string | null;
  danger_count: number | null;
};

export type SensorPayload = {
  device_id: string;
  water_level: number;
  jarak_cm: number;
  status: string;
  gate_status: string;
  timestamp: number;
  datetime: string;
};

export function getHdfsConfig() {
  return {
    hadoopBin: process.env.HADOOP_BIN || "hadoop",
    hdfsBin: process.env.HDFS_BIN || "hdfs",
    rawPath: process.env.HYDROGATE_HDFS_RAW || "/hydrogate/raw",
    outputPath: process.env.HYDROGATE_HDFS_OUTPUT || "/hydrogate/output",
    jarPath: process.env.HYDROGATE_JAR_PATH || "/home/hadoopuser/hydrogate.jar",
    mainClass: process.env.HYDROGATE_MAIN_CLASS || "id.ac.polinema.App",
  };
}

export function validateSensorPayload(input: unknown): SensorPayload {
  if (!input || typeof input !== "object") {
    throw new Error("Body JSON tidak valid.");
  }

  const body = input as Record<string, unknown>;
  const deviceId = String(body.device_id || "").trim();
  const status = String(body.status || "").trim();
  const gateStatus = String(body.gate_status || "").trim();
  const datetime = String(body.datetime || "").trim();
  const rawWaterLevel = body.water_level;
  const rawJarakCm = body.jarak_cm;
  const rawTimestamp = body.timestamp;
  const waterLevel = Number(body.water_level);
  const jarakCm = Number(body.jarak_cm);
  const timestamp = Number(body.timestamp);

  if (!deviceId) {
    throw new Error("Device ID wajib diisi.");
  }

  if (rawWaterLevel === null || rawWaterLevel === undefined || String(rawWaterLevel).trim() === "" || !Number.isFinite(waterLevel)) {
    throw new Error("Water Level harus berupa angka.");
  }

  if (rawJarakCm === null || rawJarakCm === undefined || String(rawJarakCm).trim() === "" || !Number.isFinite(jarakCm)) {
    throw new Error("Jarak Air harus berupa angka.");
  }

  if (!status) {
    throw new Error("Status wajib diisi.");
  }

  if (!gateStatus) {
    throw new Error("Gate Status wajib diisi.");
  }

  if (rawTimestamp === null || rawTimestamp === undefined || String(rawTimestamp).trim() === "" || !Number.isFinite(timestamp)) {
    throw new Error("Timestamp harus berupa angka.");
  }

  if (!datetime) {
    throw new Error("Datetime wajib diisi.");
  }

  return {
    device_id: deviceId,
    water_level: waterLevel,
    jarak_cm: jarakCm,
    status,
    gate_status: gateStatus,
    timestamp,
    datetime,
  };
}

export async function runCommand(file: string, args: string[]) {
  try {
    const result = await execFileAsync(file, args, {
      timeout: 120_000,
      maxBuffer: 1024 * 1024 * 10,
      windowsHide: true,
    });

    return {
      stdout: result.stdout,
      stderr: result.stderr,
    };
  } catch (error) {
    const err = error as NodeJS.ErrnoException & {
      stderr?: string;
      stdout?: string;
    };

    if (err.code === "ENOENT") {
      throw new Error(`Command "${file}" tidak ditemukan. Pastikan Hadoop sudah terinstall atau env HADOOP_BIN/HDFS_BIN sudah benar.`);
    }

    const detail = err.stderr || err.stdout || err.message || String(error);
    throw new Error(detail.trim());
  }
}

function toNumberOrNull(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeResultObject(item: Record<string, unknown>): AnalisisData | null {
  const deviceId = String(item.device_id || item.deviceId || "").trim();

  if (!deviceId) {
    return null;
  }

  return {
    device_id: deviceId,
    processed_at: String(item.processed_at || item.processedAt || item.datetime || ""),
    avg_water_level: toNumberOrNull(item.avg_water_level ?? item.avgWaterLevel ?? item.water_level),
    avg_jarak_cm: toNumberOrNull(item.avg_jarak_cm ?? item.avgJarakCm ?? item.jarak_cm),
    dominant_status: item.dominant_status || item.dominantStatus || item.status ? String(item.dominant_status || item.dominantStatus || item.status) : null,
    danger_count: toNumberOrNull(item.danger_count ?? item.dangerCount),
  };
}

function parseColumns(line: string): AnalisisData | null {
  const columns = line.includes("\t") ? line.split("\t") : line.split(",");
  const trimmed = columns.map((item) => item.trim()).filter(Boolean);

  if (trimmed.length < 5) {
    return null;
  }

  if (trimmed.length >= 6 && !Number.isFinite(Number(trimmed[1]))) {
    return {
      processed_at: trimmed[0],
      device_id: trimmed[1],
      avg_water_level: toNumberOrNull(trimmed[2]),
      avg_jarak_cm: toNumberOrNull(trimmed[3]),
      dominant_status: trimmed[4] || null,
      danger_count: toNumberOrNull(trimmed[5]),
    };
  }

  return {
    processed_at: "",
    device_id: trimmed[0],
    avg_water_level: toNumberOrNull(trimmed[1]),
    avg_jarak_cm: toNumberOrNull(trimmed[2]),
    dominant_status: trimmed[3] || null,
    danger_count: toNumberOrNull(trimmed[4]),
  };
}

export function parseHdfsResult(stdout: string): AnalisisData[] {
  return stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      try {
        const parsed = JSON.parse(line) as unknown;

        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          return normalizeResultObject(parsed as Record<string, unknown>);
        }
      } catch {
        return parseColumns(line);
      }

      return parseColumns(line);
    })
    .filter((item): item is AnalisisData => Boolean(item));
}

export function isMissingHdfsOutput(message: string) {
  const normalized = message.toLowerCase();
  return normalized.includes("no such file") || normalized.includes("does not exist") || normalized.includes("cannot find");
}
