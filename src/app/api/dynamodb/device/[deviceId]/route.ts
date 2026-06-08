import { NextRequest, NextResponse } from "next/server";
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

function getLimit(request: NextRequest) {
  const rawLimit = request.nextUrl.searchParams.get("limit");
  const parsed = Number(rawLimit || 20);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 20;
  }

  return Math.min(parsed, 100);
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ deviceId: string }> }
) {
  try {
    const tableName = process.env.DYNAMODB_TABLE_NAME;

    if (!tableName) {
      return NextResponse.json(
        { error: "DYNAMODB_TABLE_NAME belum diisi" },
        { status: 500 }
      );
    }

    const { deviceId: rawDeviceId } = await context.params;
    const deviceId = decodeURIComponent(rawDeviceId || "").trim();
    const limit = getLimit(request);

    if (!deviceId) {
      return NextResponse.json({ error: "deviceId wajib diisi" }, { status: 400 });
    }

    const items: DynamoDeviceItem[] = [];
    let lastEvaluatedKey: Record<string, unknown> | undefined;

    do {
      const result = await docClient.send(
        new ScanCommand({
          TableName: tableName,
          ExclusiveStartKey: lastEvaluatedKey,
          FilterExpression: "#deviceId = :deviceId",
          ExpressionAttributeNames: {
            "#deviceId": "device_id",
          },
          ExpressionAttributeValues: {
            ":deviceId": deviceId,
          },
        })
      );

      items.push(...((result.Items ?? []) as DynamoDeviceItem[]));
      lastEvaluatedKey = result.LastEvaluatedKey as Record<string, unknown> | undefined;
    } while (lastEvaluatedKey);

    const sorted = items.sort((a, b) => getItemTimestampMs(b) - getItemTimestampMs(a));
    const limited = sorted.slice(0, limit);
    const history: DeviceSnapshot[] = limited.map((item) => toDeviceSnapshot(item));

    return NextResponse.json({
      deviceId,
      total: history.length,
      latest: history[0] ?? null,
      history,
    });
  } catch (error) {
    console.error("DynamoDB device history error:", error);

    return NextResponse.json(
      {
        error: "Gagal mengambil riwayat device dari DynamoDB",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
