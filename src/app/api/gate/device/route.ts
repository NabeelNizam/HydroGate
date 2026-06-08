import { NextResponse } from "next/server";
import {
  IoTDataPlaneClient,
  PublishCommand,
} from "@aws-sdk/client-iot-data-plane";

type GateCommand = "OPEN" | "HALF" | "CLOSE";

type RequestBody = {
  deviceId?: string;
  command?: GateCommand;
};

function resolveEndpoint(rawEndpoint: string) {
  if (rawEndpoint.startsWith("https://") || rawEndpoint.startsWith("http://")) {
    return rawEndpoint;
  }

  return `https://${rawEndpoint}`;
}

export async function POST(req: Request) {
  try {
    const region = process.env.AWS_REGION;
    const endpoint = process.env.AWS_IOT_ENDPOINT;

    if (!region || !endpoint) {
      return NextResponse.json(
        { error: "AWS_REGION atau AWS_IOT_ENDPOINT belum diisi" },
        { status: 500 }
      );
    }

    const body = (await req.json()) as RequestBody;
    const deviceId = String(body.deviceId || "").trim();
    const command = String(body.command || "").toUpperCase() as GateCommand;

    if (!deviceId) {
      return NextResponse.json({ error: "deviceId wajib diisi" }, { status: 400 });
    }

    if (!["OPEN", "HALF", "CLOSE"].includes(command)) {
      return NextResponse.json({ error: "Command tidak valid" }, { status: 400 });
    }

    const iotClient = new IoTDataPlaneClient({
      region,
      endpoint: resolveEndpoint(endpoint),
    });

    const payload = Buffer.from(
      JSON.stringify({
        command,
        deviceId,
        source: "website",
        timestamp: Date.now(),
      })
    );
    const deviceTopic = `hydrogate/control/${deviceId}`;
    const globalTopic = "hydrogate/gate/control";

    await Promise.all([
      iotClient.send(
        new PublishCommand({
          topic: deviceTopic,
          qos: 1,
          payload,
        })
      ),
      iotClient.send(
        new PublishCommand({
          topic: globalTopic,
          qos: 1,
          payload,
        })
      ),
    ]);

    return NextResponse.json({
      success: true,
      deviceId,
      command,
      topics: [deviceTopic, globalTopic],
    });
  } catch (error) {
    console.error("IoT device publish error:", error);

    return NextResponse.json(
      {
        error: "Gagal mengirim command ke AWS IoT",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
