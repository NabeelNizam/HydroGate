"use client";

import { DeviceSnapshot } from "@/lib/device-monitoring";
import DeviceStatusBadge from "./DeviceStatusBadge";

type DeviceHistoryTableProps = {
  items: DeviceSnapshot[];
  resolveOnline: (timestampMs: number) => boolean;
};

export default function DeviceHistoryTable({ items, resolveOnline }: DeviceHistoryTableProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
        Belum ada data riwayat.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-left text-slate-700">
          <tr>
            <th className="px-4 py-3 font-semibold">Timestamp</th>
            <th className="px-4 py-3 font-semibold">Datetime</th>
            <th className="px-4 py-3 font-semibold">Connection</th>
            <th className="px-4 py-3 font-semibold">Status Air</th>
            <th className="px-4 py-3 font-semibold">Water Level</th>
            <th className="px-4 py-3 font-semibold">HC-SR04</th>
            <th className="px-4 py-3 font-semibold">Gate</th>
            <th className="px-4 py-3 font-semibold">Servo</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item, index) => {
            const isOnline = resolveOnline(item.timestampMs);
            return (
              <tr key={`${item.deviceId}-${item.timestampMs}-${index}`} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-700">
                  {item.timestamp ?? item.createdAt ?? "-"}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {item.datetime || item.lastUpdateLabel}
                </td>
                <td className="px-4 py-3">
                  <DeviceStatusBadge kind="connection" value={isOnline ? "ONLINE" : "OFFLINE"} />
                </td>
                <td className="px-4 py-3">
                  <DeviceStatusBadge kind="water" value={item.waterStatus} />
                </td>
                <td className="px-4 py-3 text-slate-700">{item.waterLevel}</td>
                <td className="px-4 py-3 text-slate-700">{item.distanceCm} cm</td>
                <td className="px-4 py-3 text-slate-700">{item.gateStatus}</td>
                <td className="px-4 py-3 text-slate-700">{item.servoAngle}°</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
