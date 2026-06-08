import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { getHdfsConfig, runCommand, validateSensorPayload } from "@/lib/hdfs-analisis";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Body JSON tidak valid.",
        },
        { status: 400 }
      );
    }

    const payload = validateSensorPayload(body);
    const config = getHdfsConfig();
    const directory = path.join(process.cwd(), "tmp", "hydrogate");
    const filename = `hydrogate-${Date.now()}.json`;
    const filePath = path.join(directory, filename);

    await mkdir(directory, { recursive: true });
    await writeFile(filePath, `${JSON.stringify(payload)}\n`, "utf8");
    await runCommand(config.hdfsBin, ["dfs", "-mkdir", "-p", config.rawPath]);
    await runCommand(config.hdfsBin, ["dfs", "-put", "-f", filePath, `${config.rawPath}/`]);

    return NextResponse.json({
      success: true,
      message: "Berhasil menulis JSON sensor ke HDFS.",
      localFile: path.join("tmp", "hydrogate", filename),
      hdfsPath: `${config.rawPath}/${filename}`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Gagal menulis JSON sensor ke HDFS.",
      },
      { status: error instanceof Error && (error.message.includes("wajib") || error.message.includes("harus") || error.message.includes("tidak valid")) ? 400 : 500 }
    );
  }
}
