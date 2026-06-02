"use client";

import { DeviceSnapshot } from "@/lib/device-monitoring";
import DeviceStatusBadge from "./DeviceStatusBadge";
import GateControlButtons from "./GateControlButtons";

type DeviceCardProps = {
  device: DeviceSnapshot;
  isOnline: boolean;
  onClick: () => void;
  onControlSent?: () => void;
};

export default function DeviceCard({
  device,
  isOnline,
  onClick,
  onControlSent,
}: DeviceCardProps) {
  const connectionStatus = isOnline ? "ONLINE" : "OFFLINE";

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{device.deviceId}</h3>
          <p className="text-xs text-slate-500">Last update: {device.lastUpdateLabel}</p>
        </div>
        <DeviceStatusBadge kind="connection" value={connectionStatus} />
      </div>

      <div className="mb-4">
        <DeviceStatusBadge kind="water" value={device.waterStatus} />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Water level</p>
          <p className="font-semibold text-slate-900">{device.waterLevel}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs text-slate-500">HC-SR04</p>
          <p className="font-semibold text-slate-900">{device.distanceCm} cm</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Gate status</p>
          <p className="font-semibold text-slate-900">{device.gateStatus}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Servo angle</p>
          <p className="font-semibold text-slate-900">{device.servoAngle}°</p>
        </div>
      </div>

      <GateControlButtons deviceId={device.deviceId} onSent={onControlSent} compact />
    </article>
  );
}
