"use client";

import { useState, useEffect } from "react";

function WaterLevelBar({ level, max }: { level: number; max: number }) {
    const pct = Math.min((level / max) * 100, 100);
    const color =
        pct < 50 ? "#22d3ee" : pct < 80 ? "#f59e0b" : "#ef4444";

    return (
        <div className="relative">
            <div className="flex justify-between items-end mb-2">
                <span className="text-slate-400 text-xs">Ketinggian Air</span>
                <span className="text-xs font-mono" style={{ color }}>
                    {level.toFixed(1)}m / {max}m
                </span>
            </div>
            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-1000 relative overflow-hidden"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
            </div>
            <div className="flex justify-between mt-1">
                <span className="text-slate-600 text-[10px]">0m</span>
                <span className="text-slate-600 text-[10px]">Batas Aman: {max * 0.8}m</span>
                <span className="text-slate-600 text-[10px]">{max}m</span>
            </div>
        </div>
    );
}

function GateStatusBadge({ open }: { open: boolean }) {
    return (
        <div
            className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-500 ${open
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                : "bg-rose-500/10 border border-rose-500/30 text-rose-400"
                }`}
        >
            <span className="relative flex h-2.5 w-2.5">
                <span
                    className={`pulse-ring absolute inline-flex h-full w-full rounded-full opacity-75 ${open ? "bg-emerald-400" : "bg-rose-400"
                        }`}
                />
                <span
                    className={`relative inline-flex rounded-full h-2.5 w-2.5 ${open ? "bg-emerald-400" : "bg-rose-400"
                        }`}
                />
            </span>
            Pintu {open ? "Terbuka" : "Tertutup"}
        </div>
    );
}

const gates = [
    { id: "A1", label: "Pintu A1", open: true, level: 2.3, max: 5.0, location: "Hulu Kiri" },
    { id: "A2", label: "Pintu A2", open: false, level: 3.7, max: 5.0, location: "Hulu Kanan" },
    { id: "B1", label: "Pintu B1", open: true, level: 1.8, max: 4.0, location: "Hilir Utama" },
];

export default function LiveStatus() {
    const [time, setTime] = useState(new Date());
    const [activeGate, setActiveGate] = useState(0);
    const [levels, setLevels] = useState(gates.map((g) => g.level));

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
            // Simulate minor fluctuation
            setLevels((prev) =>
                prev.map((l, i) =>
                    Math.max(0.5, Math.min(gates[i].max - 0.1, l + (Math.random() - 0.5) * 0.04))
                )
            );
        }, 1500);
        return () => clearInterval(timer);
    }, []);

    const gate = gates[activeGate];
    const level = levels[activeGate];

    return (
        <section
            id="live-status"
            className="relative py-28 px-6 transition-colors duration-500 bg-gradient-to-b from-[#020d1a] via-[#04111f] to-[#05182b]"
        >
            {/* BG accent */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-900/50 to-transparent" />

                {/* Glow utama */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] opacity-0 group-[.active]:opacity-100 transition-opacity duration-700" />

                {/* tambahan subtle */}
                <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] opacity-0 group-[.active]:opacity-100 transition-opacity duration-700" />
            </div>

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent" />
            </div>

            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[15%] w-[420px] h-[420px] bg-cyan-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-15%] right-[10%] w-[360px] h-[360px] bg-blue-500/10 rounded-full blur-[120px]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent" />
            </div>

            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-14">
                    <p className="text-cyan-400 text-xs font-semibold tracking-widest uppercase mb-4">
                        Status Terkini
                    </p>
                    <h2 className=" font-bold text-3xl md:text-4xl text-white mb-4">
                        Live Preview
                    </h2>
                    <div className="flex items-center justify-center gap-2 text-slate-400 text-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
                        </span>
                        Data diperbarui setiap 1.5 detik
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {/* Gate selector */}
                    <div className="flex flex-col gap-3">
                        {gates.map((g, i) => (
                            <button
                                key={g.id}
                                onClick={() => setActiveGate(i)}
                                className={`text-left p-4 rounded-xl border transition-all duration-300 ${activeGate === i
                                    ? "bg-cyan-500/10 border-cyan-500/40 shadow-lg shadow-cyan-500/10"
                                    : "bg-white/[0.02] border-white/[0.07] hover:border-white/20 hover:bg-white/[0.04]"
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className={` font-bold text-base ${activeGate === i ? "text-white" : "text-slate-300"}`}>
                                        {g.label}
                                    </span>
                                    <span className={`w-2 h-2 rounded-full ${g.open ? "bg-emerald-400" : "bg-rose-400"}`} />
                                </div>
                                <span className="text-slate-500 text-xs">{g.location}</span>
                                <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000"
                                        style={{ width: `${(levels[i] / g.max) * 100}%` }}
                                    />
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Main card */}
                    <div className="lg:col-span-2 relative p-7 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.08] glow-border transition-all duration-300 overflow-hidden">
                        {/* Corner decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-bl-[80px]" />
                        <div className="absolute top-4 right-4 w-16 h-16 border border-cyan-500/10 rounded-full" />

                        <div className="relative">
                            {/* Header row */}
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className=" font-extrabold text-2xl text-white">
                                            {gate.label}
                                        </span>
                                        <span className="text-xs text-slate-500 bg-white/5 px-2 py-0.5 rounded-md">
                                            {gate.location}
                                        </span>
                                    </div>
                                    <p className="text-slate-400 text-xs font-mono">
                                        Diperbarui: {time.toLocaleTimeString("id-ID")}
                                    </p>
                                </div>
                                <GateStatusBadge open={gate.open} />
                            </div>

                            {/* Big number */}
                            <div className="flex items-end gap-3 mb-8">
                                <span className=" font-extrabold text-6xl md:text-7xl bg-gradient-to-br from-cyan-200 to-cyan-500 bg-clip-text text-transparent ticker">
                                    {level.toFixed(2)}
                                </span>
                                <div className="pb-2">
                                    <span className="text-slate-400 text-xl font-light">m</span>
                                    <p className="text-slate-500 text-xs mt-1">ketinggian air</p>
                                </div>
                            </div>

                            {/* Water bar */}
                            <WaterLevelBar level={level} max={gate.max} />

                            {/* Info grid */}
                            <div className="grid grid-cols-3 gap-3 mt-6">
                                {[
                                    { label: "Status Pintu", value: gate.open ? "Terbuka" : "Tertutup" },
                                    { label: "Batas Aman", value: `${gate.max * 0.8}m` },
                                    { label: "Sensor", value: "Online" },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center"
                                    >
                                        <p className="text-white font-semibold text-sm">{item.value}</p>
                                        <p className="text-slate-500 text-[10px] mt-0.5">{item.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}