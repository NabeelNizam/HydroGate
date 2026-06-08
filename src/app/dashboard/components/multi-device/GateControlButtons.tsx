"use client";

import { useState } from "react";

type GateControlButtonsProps = {
  deviceId: string;
  onSent?: () => void;
  compact?: boolean;
};

type CommandType = "OPEN" | "HALF" | "CLOSE";

export default function GateControlButtons({
  deviceId,
  onSent,
  compact,
}: GateControlButtonsProps) {
  const [sendingCommand, setSendingCommand] = useState<CommandType | null>(null);

  const sendCommand = async (command: CommandType) => {
    try {
      setSendingCommand(command);

      const response = await fetch("/api/gate/device", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deviceId,
          command,
        }),
      });

      const json: { error?: string } = await response.json();

      if (!response.ok) {
        throw new Error(json.error || "Gagal mengirim command");
      }

      onSent?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal mengirim command";
      alert(message);
    } finally {
      setSendingCommand(null);
    }
  };

  const sizeClass = compact ? "px-3 py-2 text-xs" : "px-4 py-2 text-sm";

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          void sendCommand("OPEN");
        }}
        disabled={sendingCommand !== null}
        className={`rounded-lg bg-red-600 font-semibold text-white transition hover:bg-red-700 disabled:opacity-60 ${sizeClass}`}
      >
        {sendingCommand === "OPEN" ? "Mengirim..." : "Buka Penuh"}
      </button>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          void sendCommand("HALF");
        }}
        disabled={sendingCommand !== null}
        className={`rounded-lg bg-yellow-500 font-semibold text-white transition hover:bg-yellow-600 disabled:opacity-60 ${sizeClass}`}
      >
        {sendingCommand === "HALF" ? "Mengirim..." : "Buka Separuh"}
      </button>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          void sendCommand("CLOSE");
        }}
        disabled={sendingCommand !== null}
        className={`rounded-lg bg-emerald-600 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60 ${sizeClass}`}
      >
        {sendingCommand === "CLOSE" ? "Mengirim..." : "Tutup Gate"}
      </button>
    </div>
  );
}
