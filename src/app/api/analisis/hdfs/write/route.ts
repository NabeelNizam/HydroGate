import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { buildHdfsSensorCsv, mapDynamoItemToHdfsCsvRow, scanDynamoSensorItems } from "@/lib/dynamodb-analisis";
import { copyFileToNameNode, getHdfsConfig, runSshCommand } from "@/lib/hdfs-analisis";

export const runtime = "nodejs";

export async function POST() {
  try {
    const config = getHdfsConfig();
    const items = await scanDynamoSensorItems();

    if (items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Tidak ada data DynamoDB yang bisa dikirim ke HDFS.",
          totalItems: 0,
        },
        { status: 404 }
      );
    }

    const rows = items.map((item) => mapDynamoItemToHdfsCsvRow(item));
    const csv = buildHdfsSensorCsv(rows);
    const directory = path.join(process.cwd(), "tmp", "hydrogate");
    const filename = `hydrogate-dynamodb-${Date.now()}.csv`;
    const filePath = path.join(directory, filename);
    const scpFilePath = path.relative(process.cwd(), filePath).split(path.sep).join("/");
    const remoteFilePath = `${config.remoteTmpPath.replace(/\/$/, "")}/${filename}`;

    await mkdir(directory, { recursive: true });
    await writeFile(filePath, `${csv}\n`, "utf8");
    await copyFileToNameNode(scpFilePath, remoteFilePath);
    await runSshCommand([config.hdfsBin, "dfs", "-mkdir", "-p", config.rawPath]);
    await runSshCommand([config.hdfsBin, "dfs", "-put", "-f", remoteFilePath, `${config.rawPath}/`]);

    return NextResponse.json({
      success: true,
      message: "Berhasil mengambil data DynamoDB dan mengirim CSV ke HDFS.",
      totalItems: items.length,
      filename,
      localFile: path.join("tmp", "hydrogate", filename),
      remoteFile: remoteFilePath,
      hdfsPath: `${config.rawPath}/${filename}`,
      hdfsTarget: config.rawPath,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Gagal mengambil data DynamoDB dan mengirim CSV ke HDFS.",
      },
      { status: 500 }
    );
  }
}
