import { NextResponse } from "next/server";
import {
    IoTDataPlaneClient,
    PublishCommand,
} from "@aws-sdk/client-iot-data-plane";

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

        const body = await req.json();
        const { command } = body;

        if (!["OPEN", "HALF", "CLOSE"].includes(command)) {
            return NextResponse.json(
                { error: "Command tidak valid" },
                { status: 400 }
            );
        }

        const iotClient = new IoTDataPlaneClient({
            region,
            endpoint,
        });

        await iotClient.send(
            new PublishCommand({
                topic: "hydrogate/gate/control",
                qos: 1,
                payload: Buffer.from(
                    JSON.stringify({
                        command,
                        source: "website",
                        timestamp: Date.now(),
                    })
                ),
            })
        );

        return NextResponse.json({ success: true, command });
    } catch (error) {
        console.error("IoT publish error:", error);

        return NextResponse.json(
            {
                error: "Gagal mengirim command ke AWS IoT",
                detail: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}