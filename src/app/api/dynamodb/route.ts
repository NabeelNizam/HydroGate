import { NextResponse } from "next/server";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
});

const docClient = DynamoDBDocumentClient.from(client);

function getTimeValue(item: Record<string, unknown>) {
  const raw = item.timestamp ?? item.createdAt ?? 0;
  const num = Number(raw);

  if (!Number.isNaN(num)) {
    return num;
  }

  const date = new Date(String(raw)).getTime();
  return Number.isNaN(date) ? 0 : date;
}

export async function GET() {
  try {
    const result = await docClient.send(
      new ScanCommand({
        TableName: process.env.DYNAMODB_TABLE_NAME,
      })
    );

    const items = result.Items ?? [];

    const sortedItems = items.sort((a, b) => {
      return getTimeValue(b) - getTimeValue(a);
    });

    return NextResponse.json({
      items: sortedItems,
      latest: sortedItems[0] ?? null,
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