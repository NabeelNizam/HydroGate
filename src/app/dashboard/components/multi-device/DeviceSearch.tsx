"use client";

type DeviceSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function DeviceSearch({ value, onChange }: DeviceSearchProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search device_id..."
      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-800 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 md:w-80"
    />
  );
}
