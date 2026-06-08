import { NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import {
  DynamoDeviceItem,
  DeviceSnapshot,
  getItemTimestampMs,
  toDeviceSnapshot,
} from "@/lib/device-monitoring";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
});

const docClient = DynamoDBDocumentClient.from(client);

export async function GET() {
  try {
    const tableName = process.env.DYNAMODB_TABLE_NAME;

    if (!tableName) {
      return NextResponse.json(
        { error: "DYNAMODB_TABLE_NAME belum diisi" },
        { status: 500 }
      );
    }

    const items: DynamoDeviceItem[] = [];
    let lastEvaluatedKey: Record<string, unknown> | undefined;

    do {
      const result = await docClient.send(
        new ScanCommand({
          TableName: tableName,
          ExclusiveStartKey: lastEvaluatedKey,
        })
      );

      items.push(...((result.Items ?? []) as DynamoDeviceItem[]));
      lastEvaluatedKey = result.LastEvaluatedKey as Record<string, unknown> | undefined;
    } while (lastEvaluatedKey);
    const latestByDevice = new Map<string, DynamoDeviceItem>();

    for (const item of items) {
      const deviceId = String(item.device_id || "").trim();

      if (!deviceId) {
        continue;
      }

      const current = latestByDevice.get(deviceId);

      if (!current) {
        latestByDevice.set(deviceId, item);
        continue;
      }

      const currentTime = getItemTimestampMs(current);
      const nextTime = getItemTimestampMs(item);

      if (nextTime > currentTime) {
        latestByDevice.set(deviceId, item);
      }
    }

    const devices: DeviceSnapshot[] = Array.from(latestByDevice.values())
      .map((item) => toDeviceSnapshot(item))
      .sort((a, b) => b.timestampMs - a.timestampMs);

    return NextResponse.json({
      devices,
      totalDevices: devices.length,
    });
  } catch (error) {
    console.error("DynamoDB devices error:", error);

    return NextResponse.json(
      {
        error: "Gagal mengambil data device dari DynamoDB",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
