import { NextResponse } from "next/server";
import { getHdfsConfig, isMissingHdfsOutput, parseHdfsResult, runCommand } from "@/lib/hdfs-analisis";

export const runtime = "nodejs";

export async function GET() {
  try {
    const config = getHdfsConfig();
    const result = await runCommand(config.hdfsBin, ["dfs", "-cat", `${config.outputPath}/part-00000`]);
    const data = parseHdfsResult(result.stdout);

    return NextResponse.json({
      success: true,
      data,
      message: data.length > 0 ? "Berhasil membaca hasil analisis HDFS." : "Belum ada hasil analisis HDFS.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal membaca hasil analisis HDFS.";

    if (isMissingHdfsOutput(message)) {
      return NextResponse.json({
        success: true,
        data: [],
        message: "Belum ada hasil analisis HDFS.",
      });
    }

    return NextResponse.json(
      {
        success: false,
        data: [],
        message,
      },
      { status: 500 }
    );
  }
}
