import { execFile } from "child_process";
import { promisify } from "util";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const execFileAsync = promisify(execFile);

type SshCommandResult = {
  stdout: string;
  stderr: string;
};

function getSshConfig() {
  const port = Number(process.env.HADOOP_SSH_PORT || "22");

  return {
    host: process.env.HADOOP_SSH_HOST || "192.168.18.62",
    user: process.env.HADOOP_SSH_USER || "hadoopuser",
    port: Number.isInteger(port) && port > 0 ? String(port) : "22",
    hdfsBin: process.env.HDFS_BIN || "hdfs",
  };
}

async function runSshCommand(config: ReturnType<typeof getSshConfig>, args: string[]): Promise<SshCommandResult> {
  try {
    const result = await execFileAsync(
      "ssh",
      ["-p", config.port, `${config.user}@${config.host}`, ...args],
      {
        timeout: 30_000,
        maxBuffer: 1024 * 1024 * 5,
        windowsHide: true,
      }
    );

    return {
      stdout: result.stdout.trim(),
      stderr: result.stderr.trim(),
    };
  } catch (error) {
    const err = error as NodeJS.ErrnoException & {
      stderr?: string;
      stdout?: string;
    };

    if (err.code === "ENOENT") {
      throw new Error("Command ssh tidak ditemukan di server Next.js.");
    }

    const detail = err.stderr || err.stdout || err.message || String(error);
    throw new Error(detail.trim());
  }
}

export async function POST() {
  const config = getSshConfig();

  try {
    const hostname = await runSshCommand(config, ["hostname"]);
    const whoami = await runSshCommand(config, ["whoami"]);
    const hdfsRoot = await runSshCommand(config, [config.hdfsBin, "dfs", "-ls", "/"]);

    return NextResponse.json({
      success: true,
      host: config.host,
      user: config.user,
      checks: {
        hostname: hostname.stdout,
        whoami: whoami.stdout,
        hdfsRoot: hdfsRoot.stdout,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Gagal koneksi SSH ke VM Hadoop.",
        error: error instanceof Error ? error.message : "Pastikan SSH tanpa password dari server Next.js ke VM Hadoop sudah aktif.",
      },
      { status: 500 }
    );
  }
}
