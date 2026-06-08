import { NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDeviceItem, getItemTimestampMs } from "@/lib/device-monitoring";

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

    const result = await docClient.send(
      new ScanCommand({
        TableName: tableName,
      })
    );

    const items = (result.Items ?? []) as DynamoDeviceItem[];

    const sortedItems = items.sort((a, b) => {
      return getItemTimestampMs(b) - getItemTimestampMs(a);
    });

    return NextResponse.json({
      items: sortedItems,
      latest: sortedItems[0] ?? null,
      totalItems: sortedItems.length,
    });
  } catch (error) {
    console.error("DynamoDB error:", error);

    return NextResponse.json(
      {
        error: "Gagal mengambil data DynamoDB",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
