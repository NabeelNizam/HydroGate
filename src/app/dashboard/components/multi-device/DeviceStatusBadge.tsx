"use client";

import { DeviceWaterStatus } from "@/lib/device-monitoring";

type DeviceStatusBadgeProps =
  | {
      kind: "water";
      value: DeviceWaterStatus;
    }
  | {
      kind: "connection";
      value: "ONLINE" | "OFFLINE";
    };

function getWaterClass(value: DeviceWaterStatus) {
  if (value === "BAHAYA") {
    return "bg-red-100 text-red-700";
  }

  if (value === "SIAGA") {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-emerald-100 text-emerald-700";
}

function getConnectionClass(value: "ONLINE" | "OFFLINE") {
  if (value === "ONLINE") {
    return "bg-emerald-100 text-emerald-700";
  }

  return "bg-slate-200 text-slate-700";
}

export default function DeviceStatusBadge(props: DeviceStatusBadgeProps) {
  const text = props.value;
  const colorClass =
    props.kind === "water" ? getWaterClass(props.value) : getConnectionClass(props.value);

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${colorClass}`}
    >
      {text}
    </span>
  );
}
