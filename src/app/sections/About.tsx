"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
    { value: 12, suffix: "+", label: "Bendungan Terpantau" },
    { value: 99, suffix: ".9%", label: "Uptime Sistem" },
    { value: 48, suffix: " Jam", label: "Rata-rata Respons Cepat" },
    { value: 3, suffix: " Juta", label: "Data Sensor / Bulan" },
];

function useCountUp(target: number, duration = 1800, start = false) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!start) return;
        let startTime: number | null = null;
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [start, target, duration]);
    return count;
}

function StatCounter({ value, suffix, label, start }: { value: number; suffix: string; label: string; start: boolean }) {
    const count = useCountUp(value, 1600, start);
    return (
        <div className="group relative flex flex-col items-center text-center p-6 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-cyan-500/30 hover:bg-cyan-500/[0.04] transition-all duration-400">
            <div className=" font-extrabold text-4xl md:text-5xl text-white mb-1">
                <span className="bg-gradient-to-br from-cyan-200 to-cyan-500 bg-clip-text text-transparent">
                    {count}
                </span>
                <span className="text-cyan-400 text-2xl md:text-3xl">{suffix}</span>
            </div>
            <p className="text-slate-500 text-sm mt-1 leading-snug">{label}</p>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent group-hover:w-3/4 transition-all duration-500" />
        </div>
    );
}


const values = [
    {
        icon: (
            <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
                <path d="M16 4 L28 10 L28 22 L16 28 L4 22 L4 10 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" opacity="0.4" />
                <path d="M16 4 L16 28" stroke="currentColor" strokeWidth="1" opacity="0.2" />
                <path d="M4 10 L28 10" stroke="currentColor" strokeWidth="1" opacity="0.2" />
                <path d="M4 22 L28 22" stroke="currentColor" strokeWidth="1" opacity="0.2" />
                <circle cx="16" cy="16" r="4" fill="currentColor" opacity="0.7" />
            </svg>
        ),
        title: "Presisi Tinggi",
        desc: "Akurasi sensor ±0.5cm dengan kalibrasi berkala dan validasi silang antar titik ukur.",
    },
    {
        icon: (
            <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
                <path d="M6 26 L6 12 L13 8 L19 12 L26 8 L26 26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
                <rect x="10" y="18" width="5" height="8" rx="1" fill="currentColor" opacity="0.3" />
                <rect x="17" y="14" width="5" height="12" rx="1" fill="currentColor" opacity="0.5" />
            </svg>
        ),
        title: "Skalabel",
        desc: "Dapat dikembangkan dari satu bendungan kecil hingga jaringan puluhan infrastruktur air.",
    },
    {
        icon: (
            <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
                <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
                <path d="M16 8 L18 14 L24 14 L19 18 L21 24 L16 20 L11 24 L13 18 L8 14 L14 14 Z" fill="currentColor" opacity="0.6" />
            </svg>
        ),
        title: "Terpercaya",
        desc: "Beroperasi tanpa gangguan selama lebih dari 3 tahun pada berbagai kondisi cuaca ekstrem.",
    },
];

export default function About() {
    const sectionRef = useRef<HTMLElement>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setInView(true); },
            { threshold: 0.2 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section id="about" ref={sectionRef} className="relative py-28 px-6 overflow-hidden bg-gradient-to-b from-[#020d1a] via-[#04111f] to-[#05182b]">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Faint horizontal rule top */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-900/40 to-transparent" />
                {/* Glow blob left */}
                <div className="absolute top-1/4 -left-32 w-80 h-80 bg-cyan-900/15 rounded-full blur-[100px]" />
                {/* Glow blob right */}
                <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-blue-900/20 rounded-full blur-[100px]" />
                {/* Subtle grid */}
                <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(34,211,238,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,1) 1px, transparent 1px)",
                        backgroundSize: "80px 80px",
                    }}
                />
            </div>

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent" />
            </div>

            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[15%] w-[420px] h-[420px] bg-cyan-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-15%] right-[10%] w-[360px] h-[360px] bg-blue-500/10 rounded-full blur-[120px]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent" />
            </div>

            <div className="relative max-w-6xl mx-auto">

                {/* ── Top: Label + headline ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-20">
                    <div
                        className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                    >
                        <p className="text-cyan-400 text-xs font-semibold tracking-widest uppercase mb-5">
                            Tentang Kami
                        </p>
                        <h2 className=" font-extrabold text-4xl md:text-5xl leading-[1.08] tracking-tight text-white mb-6">
                            Teknologi untuk
                            <br />
                            <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                                Keselamatan Air
                            </span>
                        </h2>

                        {/* Decorative divider */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-px w-12 bg-cyan-500/50" />
                            <div className="h-1 w-1 rounded-full bg-cyan-500/50" />
                        </div>

                        <p className="text-slate-400 text-base leading-relaxed mb-5">
                            AquaGate Monitor lahir dari kebutuhan nyata pengelola bendungan di Indonesia —
                            sistem yang sederhana, andal, dan dapat dipantau tanpa kehadiran fisik di lokasi.
                        </p>
                        <p className="text-slate-500 text-base leading-relaxed">
                            Kami menggabungkan sensor presisi lapangan, konektivitas IoT tahan cuaca,
                            dan dashboard yang intuitif sehingga operator dapat membuat keputusan cepat
                            berbasis data — bukan intuisi semata.
                        </p>
                    </div>

                    {/* Right: value props */}
                    <div
                        className={`flex flex-col gap-4 transition-all duration-700 delay-150 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                    >
                        {values.map((v) => (
                            <div
                                key={v.title}
                                className="group flex gap-4 items-start p-5 rounded-xl bg-white/[0.025] border border-white/[0.07] hover:border-cyan-500/25 hover:bg-cyan-500/[0.03] transition-all duration-300"
                            >
                                <div className="flex-shrink-0 mt-0.5 w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400/40 group-hover:bg-cyan-500/15 transition-all duration-300">
                                    {v.icon}
                                </div>
                                <div>
                                    <h4 className=" font-bold text-white text-sm mb-1">{v.title}</h4>
                                    <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Stats row ── */}
                <div
                    className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-20 transition-all duration-700 delay-200 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                >
                    {stats.map((s) => (
                        <StatCounter key={s.label} {...s} start={inView} />
                    ))}
                </div>


                {/* ── Mission strip ── */}
                <div
                    className={`relative overflow-hidden rounded-2xl border border-cyan-900/30 transition-all duration-700 delay-400 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                >
                    {/* BG */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#041525] via-[#061e35] to-[#041525]" />
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

                    {/* decorative lines */}
                    <div className="absolute right-0 top-0 bottom-0 w-64 overflow-hidden opacity-20">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute right-0 h-px bg-gradient-to-l from-cyan-400/60 to-transparent"
                                style={{ top: `${15 + i * 14}%`, width: `${60 + i * 10}%` }}
                            />
                        ))}
                    </div>

                    <div className="relative px-8 md:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="max-w-xl">
                            <p className="text-cyan-400 text-xs font-semibold tracking-widest uppercase mb-2">Misi Kami</p>
                            <h3 className=" font-bold text-xl md:text-2xl text-white leading-snug">
                                Membuat infrastruktur air Indonesia lebih aman melalui data yang akurat dan aksesibel.
                            </h3>
                        </div>
                        <a
                            href="#features"
                            className="flex-shrink-0 group flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300"
                        >
                            Lihat Fitur
                            <svg
                                className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </a>
                    </div>
                </div>

            </div>
        </section>
    );
}