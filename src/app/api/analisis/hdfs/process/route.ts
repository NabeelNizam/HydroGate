import { NextResponse } from "next/server";
import { getHdfsConfig, runSshCommand } from "@/lib/hdfs-analisis";

export const runtime = "nodejs";

export async function POST() {
  try {
    const config = getHdfsConfig();

    await runSshCommand([config.hdfsBin, "dfs", "-rm", "-r", "-f", config.outputPath]);
    await runSshCommand([config.hadoopBin, "jar", config.jarPath, config.mainClass, config.rawPath, config.outputPath]);

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
