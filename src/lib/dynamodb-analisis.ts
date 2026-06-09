import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDeviceItem, getItemTimestampMs } from "@/lib/device-monitoring";

type RawDynamoItem = DynamoDeviceItem & {
  deviceId?: string;
};

export type HdfsSensorCsvRow = {
  device_id: string;
  status: string;
  water_level: string;
  jarak_cm: string;
  timestamp: string;
  datetime: string;
};

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
});

const docClient = DynamoDBDocumentClient.from(client);

function toText(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

function csvCell(value: string) {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

export async function scanDynamoSensorItems() {
  const tableName = process.env.DYNAMODB_TABLE_NAME;

  if (!tableName) {
    throw new Error("DYNAMODB_TABLE_NAME belum diisi.");
  }

  const items: RawDynamoItem[] = [];
  let lastEvaluatedKey: Record<string, unknown> | undefined;

  do {
    const result = await docClient.send(
      new ScanCommand({
        TableName: tableName,
        ExclusiveStartKey: lastEvaluatedKey,
      })
    );

    items.push(...((result.Items ?? []) as RawDynamoItem[]));
    lastEvaluatedKey = result.LastEvaluatedKey as Record<string, unknown> | undefined;
  } while (lastEvaluatedKey);

  return items.sort((a, b) => getItemTimestampMs(a) - getItemTimestampMs(b));
}

export function mapDynamoItemToHdfsCsvRow(item: RawDynamoItem): HdfsSensorCsvRow {
  return {
    device_id: toText(item.device_id || item.deviceId),
    status: toText(item.status || item.water_status),
    water_level: toText(item.water_level),
    jarak_cm: toText(item.jarak_cm ?? item.hcsr_cm),
    timestamp: toText(item.timestamp ?? item.createdAt ?? item.unix_time),
    datetime: toText(item.datetime),
  };
}

export function buildHdfsSensorCsv(rows: HdfsSensorCsvRow[]) {
  return rows
    .map((row) =>
      [
        row.device_id,
        row.status,
        row.water_level,
        row.jarak_cm,
        row.timestamp,
        row.datetime,
      ]
        .map(csvCell)
        .join(",")
    )
    .join("\n");
}
