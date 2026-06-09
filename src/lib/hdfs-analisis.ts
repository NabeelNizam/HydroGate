import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);
const HDFS_RESULT_STATUSES = new Set(["AMAN", "SIAGA", "BAHAYA"]);

export type HdfsResultData = {
  deviceId: string;
  date: string;
  status: string;
  count: number;
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
    remoteTmpPath: process.env.HYDROGATE_REMOTE_TMP || "/tmp",
  };
}

export function getHadoopSshConfig() {
  const port = Number(process.env.HADOOP_SSH_PORT || "22");

  return {
    host: process.env.HADOOP_SSH_HOST || "192.168.18.62",
    user: process.env.HADOOP_SSH_USER || "hadoopuser",
    port: Number.isInteger(port) && port > 0 ? String(port) : "22",
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

function getCommandDetail(error: unknown) {
  const err = error as NodeJS.ErrnoException & {
    stderr?: string;
    stdout?: string;
  };

  return {
    code: err.code,
    detail: (err.stderr || err.stdout || err.message || String(error)).trim(),
  };
}

function formatSshError(tool: "ssh" | "scp", detail: string, commandArgs: string[]) {
  const normalized = detail.toLowerCase();
  const commandText = commandArgs.join(" ");
  const remoteCommand = commandArgs[0] || "";

  if (normalized.includes("permission denied") || normalized.includes("publickey") || normalized.includes("password")) {
    return "Gagal login SSH ke VM Hadoop. Pastikan SSH tanpa password dari server Next.js ke NameNode sudah aktif.";
  }

  if (normalized.includes("connection timed out") || normalized.includes("no route to host") || normalized.includes("could not resolve hostname") || normalized.includes("connection refused")) {
    return `Gagal koneksi ke VM Hadoop. Periksa HADOOP_SSH_HOST, HADOOP_SSH_PORT, jaringan, dan service SSH. Detail: ${detail}`;
  }

  if (tool === "scp" && normalized.includes("not found")) {
    return "Command scp tidak ditemukan di server Next.js.";
  }

  if (commandText.includes("hydrogate.jar") && (normalized.includes("no such file") || normalized.includes("not found") || normalized.includes("does not exist") || normalized.includes("unable to access jarfile") || normalized.includes("not a normal file"))) {
    return "File JAR analisis tidak ditemukan di VM Hadoop. Pastikan /home/hadoopuser/hydrogate.jar tersedia atau HYDROGATE_JAR_PATH sudah benar.";
  }

  if (remoteCommand.includes("hdfs") && isRemoteCommandMissing(detail, remoteCommand)) {
    return "Command HDFS tidak ditemukan di VM Hadoop. Pastikan HDFS_BIN mengarah ke binary hdfs yang benar.";
  }

  if (remoteCommand.includes("hadoop") && isRemoteCommandMissing(detail, remoteCommand)) {
    return "Command Hadoop tidak ditemukan di VM Hadoop. Pastikan HADOOP_BIN mengarah ke binary hadoop yang benar.";
  }

  return detail || "Command SSH gagal dijalankan.";
}

function isRemoteCommandMissing(detail: string, command: string) {
  const normalized = detail.toLowerCase();
  const normalizedCommand = command.toLowerCase();
  const commandName = normalizedCommand.split(/[\\/]/).pop() || normalizedCommand;

  return (
    normalized.includes(`${normalizedCommand}: no such file`) ||
    normalized.includes(`${normalizedCommand}: not found`) ||
    normalized.includes(`${commandName}: command not found`) ||
    normalized.includes(`${commandName}: not found`)
  );
}

export async function runSshCommand(remoteArgs: string[]) {
  const sshConfig = getHadoopSshConfig();
  const args = ["-p", sshConfig.port, `${sshConfig.user}@${sshConfig.host}`, ...remoteArgs];

  try {
    const result = await execFileAsync("ssh", args, {
      timeout: 120_000,
      maxBuffer: 1024 * 1024 * 10,
      windowsHide: true,
    });

    return {
      stdout: result.stdout,
      stderr: result.stderr,
    };
  } catch (error) {
    const { code, detail } = getCommandDetail(error);

    if (code === "ENOENT") {
      throw new Error("Command ssh tidak ditemukan di server Next.js.");
    }

    throw new Error(formatSshError("ssh", detail, remoteArgs));
  }
}

export async function copyFileToNameNode(localPath: string, remotePath: string) {
  const sshConfig = getHadoopSshConfig();
  const args = ["-P", sshConfig.port, localPath, `${sshConfig.user}@${sshConfig.host}:${remotePath}`];

  try {
    const result = await execFileAsync("scp", args, {
      timeout: 120_000,
      maxBuffer: 1024 * 1024 * 10,
      cwd: process.cwd(),
      windowsHide: true,
    });

    return {
      stdout: result.stdout,
      stderr: result.stderr,
    };
  } catch (error) {
    const { code, detail } = getCommandDetail(error);

    if (code === "ENOENT") {
      throw new Error("Command scp tidak ditemukan di server Next.js.");
    }

    throw new Error(formatSshError("scp", detail, args));
  }
}

function parseResultLine(line: string): HdfsResultData | null {
  const match = line.trim().match(/^(.+?)\s+(\d+)$/);

  if (!match) {
    return null;
  }

  const key = match[1].trim();
  const count = Number(match[2]);
  const keyParts = key.split(",").map((item) => item.trim());
  const status = keyParts.length >= 3 ? keyParts[2] : keyParts[0];
  const deviceId = keyParts.length >= 3 ? keyParts[0] : "";
  const date = keyParts.length >= 3 ? keyParts[1] : "";

  if (!status || !HDFS_RESULT_STATUSES.has(status) || !Number.isFinite(count)) {
    return null;
  }

  return {
    deviceId,
    date,
    status,
    count,
  };
}

function normalizeResultObject(item: Record<string, unknown>): HdfsResultData | null {
  const status = String(item.status || item.dominant_status || item.dominantStatus || "").trim();
  const count = Number(item.count ?? item.total ?? item.danger_count ?? item.dangerCount);
  const deviceId = String(item.deviceId || item.device_id || "").trim();
  const date = String(item.date || item.processed_at || item.processedAt || "").trim();

  if (!status || !HDFS_RESULT_STATUSES.has(status) || !Number.isFinite(count)) {
    return null;
  }

  return {
    deviceId,
    date,
    status,
    count,
  };
}

export function parseHdfsResult(stdout: string): HdfsResultData[] {
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
        return parseResultLine(line);
      }

      return parseResultLine(line);
    })
    .filter((item): item is HdfsResultData => Boolean(item));
}

export function isMissingHdfsOutput(message: string) {
  const normalized = message.toLowerCase();
  return normalized.includes("no such file") || normalized.includes("does not exist") || normalized.includes("cannot find");
}
