"use client";

import { DeviceFilterValue } from "./device-ui-types";

const FILTER_OPTIONS: DeviceFilterValue[] = [
  "ALL",
  "ONLINE",
  "OFFLINE",
  "AMAN",
  "SIAGA",
  "BAHAYA",
];

type DeviceFilterProps = {
  value: DeviceFilterValue;
  onChange: (value: DeviceFilterValue) => void;
};

export default function DeviceFilter({ value, onChange }: DeviceFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTER_OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
            value === option
              ? "bg-cyan-600 text-white"
              : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
          }`}
        >
          {option === "ALL" ? "Semua" : option}
        </button>
      ))}
    </div>
  );
}
