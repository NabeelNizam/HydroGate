import { NextResponse } from "next/server";
import {
    IoTDataPlaneClient,
    PublishCommand,
} from "@aws-sdk/client-iot-data-plane";

type GateCommand = "OPEN" | "HALF" | "CLOSE";

type ThresholdCommandBody = {
    command?: "SET_THRESHOLDS";
    water_siaga?: unknown;
    water_bahaya?: unknown;
    hcsr_bahaya_cm?: unknown;
    hcsr_siaga_cm?: unknown;
};

function resolveEndpoint(rawEndpoint: string) {
    if (rawEndpoint.startsWith("https://") || rawEndpoint.startsWith("http://")) {
        return rawEndpoint;
    }

    return `https://${rawEndpoint}`;
}

function toFiniteNumber(value: unknown) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}

function validateThresholdPayload(body: ThresholdCommandBody) {
    const waterSiaga = toFiniteNumber(body.water_siaga);
    const waterBahaya = toFiniteNumber(body.water_bahaya);
    const hcsrBahayaCm = toFiniteNumber(body.hcsr_bahaya_cm);
    const hcsrSiagaCm = toFiniteNumber(body.hcsr_siaga_cm);

    if (
        waterSiaga === null ||
        waterBahaya === null ||
        hcsrBahayaCm === null ||
        hcsrSiagaCm === null
    ) {
        return {
            error: "Semua nilai threshold wajib berupa angka",
            payload: null,
        };
    }

    if (waterSiaga < 0 || waterSiaga > 4095) {
        return {
            error: "water_siaga harus berada di range 0 sampai 4095",
            payload: null,
        };
    }

    if (waterBahaya < 0 || waterBahaya > 4095) {
        return {
            error: "water_bahaya harus berada di range 0 sampai 4095",
            payload: null,
        };
    }

    if (hcsrBahayaCm < 0 || hcsrBahayaCm > 400) {
        return {
            error: "hcsr_bahaya_cm harus berada di range 0 sampai 400",
            payload: null,
        };
    }

    if (hcsrSiagaCm < 0 || hcsrSiagaCm > 400) {
        return {
            error: "hcsr_siaga_cm harus berada di range 0 sampai 400",
            payload: null,
        };
    }

    if (waterBahaya < waterSiaga) {
        return {
            error: "water_bahaya tidak boleh lebih kecil dari water_siaga",
            payload: null,
        };
    }

    if (hcsrSiagaCm < hcsrBahayaCm) {
        return {
            error: "hcsr_siaga_cm tidak boleh lebih kecil dari hcsr_bahaya_cm",
            payload: null,
        };
    }

    return {
        error: "",
        payload: {
            command: "SET_THRESHOLDS" as const,
            water_siaga: waterSiaga,
            water_bahaya: waterBahaya,
            hcsr_bahaya_cm: hcsrBahayaCm,
            hcsr_siaga_cm: hcsrSiagaCm,
        },
    };
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

        const body = await req.json();
        const command = String(body.command || "").toUpperCase();
        let payload: Record<string, unknown>;

        if (command === "SET_THRESHOLDS") {
            const validation = validateThresholdPayload(body);

            if (!validation.payload) {
                return NextResponse.json(
                    { error: validation.error },
                    { status: 400 }
                );
            }

            payload = validation.payload;
        } else if (["OPEN", "HALF", "CLOSE"].includes(command)) {
            payload = {
                command: command as GateCommand,
                source: "website",
                timestamp: Date.now(),
            };
        } else {
            return NextResponse.json(
                { error: "Command tidak valid" },
                { status: 400 }
            );
        }

        const iotClient = new IoTDataPlaneClient({
            region,
            endpoint: resolveEndpoint(endpoint),
        });

        await iotClient.send(
            new PublishCommand({
                topic: "hydrogate/gate/control",
                qos: 1,
                payload: Buffer.from(JSON.stringify(payload)),
            })
        );

        return NextResponse.json({ success: true, command, payload });
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
