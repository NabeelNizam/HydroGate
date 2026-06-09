import { DescribeTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  BatchWriteCommand,
  BatchWriteCommandInput,
  DynamoDBDocumentClient,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
});

const docClient = DynamoDBDocumentClient.from(client);

async function flushDeleteBatch(tableName: string, keys: Record<string, unknown>[]) {
  let requestItems: NonNullable<BatchWriteCommandInput["RequestItems"]> = {
    [tableName]: keys.map((key) => ({
      DeleteRequest: {
        Key: key,
      },
    })),
  };

  do {
    const result = await docClient.send(
      new BatchWriteCommand({
        RequestItems: requestItems,
      })
    );

    requestItems = result.UnprocessedItems ?? {};
  } while ((requestItems[tableName] ?? []).length > 0);
}

export async function DELETE() {
  try {
    const tableName = process.env.DYNAMODB_TABLE_NAME;

    if (!tableName) {
      return NextResponse.json(
        { error: "DYNAMODB_TABLE_NAME belum diisi" },
        { status: 500 }
      );
    }

    const table = await client.send(
      new DescribeTableCommand({
        TableName: tableName,
      })
    );
    const keyAttributes =
      table.Table?.KeySchema?.map((key) => key.AttributeName).filter(
        (attributeName): attributeName is string => Boolean(attributeName)
      ) ?? [];

    if (keyAttributes.length === 0) {
      return NextResponse.json(
        { error: "Key schema DynamoDB tidak ditemukan" },
        { status: 500 }
      );
    }

    let deletedCount = 0;
    let lastEvaluatedKey: Record<string, unknown> | undefined;
    const pendingKeys: Record<string, unknown>[] = [];

    do {
      const result = await docClient.send(
        new ScanCommand({
          TableName: tableName,
          ExclusiveStartKey: lastEvaluatedKey,
        })
      );

      for (const item of result.Items ?? []) {
        const key = Object.fromEntries(
          keyAttributes.map((attributeName) => [attributeName, item[attributeName]])
        );

        if (Object.values(key).every((value) => value !== undefined)) {
          pendingKeys.push(key);
        }

        if (pendingKeys.length === 25) {
          await flushDeleteBatch(tableName, pendingKeys.splice(0, 25));
          deletedCount += 25;
        }
      }

      lastEvaluatedKey = result.LastEvaluatedKey as Record<string, unknown> | undefined;
    } while (lastEvaluatedKey);

    if (pendingKeys.length > 0) {
      const batchSize = pendingKeys.length;
      await flushDeleteBatch(tableName, pendingKeys);
      deletedCount += batchSize;
    }

    return NextResponse.json({
      success: true,
      deletedCount,
    });
  } catch (error) {
    console.error("DynamoDB clear error:", error);

    return NextResponse.json(
      {
        error: "Gagal menghapus data DynamoDB",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
