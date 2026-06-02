"use client";

import { useState } from "react";

type GateControlButtonsProps = {
  deviceId: string;
  onSent?: () => void;
  compact?: boolean;
};

type CommandType = "OPEN" | "CLOSE";

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
    <div className="flex gap-2">
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          void sendCommand("OPEN");
        }}
        disabled={sendingCommand !== null}
        className={`rounded-lg bg-emerald-600 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60 ${sizeClass}`}
      >
        {sendingCommand === "OPEN" ? "Opening..." : "Open Gate"}
      </button>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          void sendCommand("CLOSE");
        }}
        disabled={sendingCommand !== null}
        className={`rounded-lg bg-rose-600 font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60 ${sizeClass}`}
      >
        {sendingCommand === "CLOSE" ? "Closing..." : "Close Gate"}
      </button>
    </div>
  );
}
