import { NextResponse } from "next/server";
import { getHdfsConfig, runCommand } from "@/lib/hdfs-analisis";

export const runtime = "nodejs";

export async function POST() {
  try {
    const config = getHdfsConfig();

    await runCommand(config.hdfsBin, ["dfs", "-rm", "-r", "-f", config.outputPath]);
    await runCommand(config.hadoopBin, ["jar", config.jarPath, config.mainClass, config.rawPath, config.outputPath]);

    return NextResponse.json({
      success: true,
      message: "Analisis MapReduce/Spark berhasil dijalankan.",
      outputPath: config.outputPath,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Gagal menjalankan analisis HDFS.",
      },
      { status: 500 }
    );
  }
}
