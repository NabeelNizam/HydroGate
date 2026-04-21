"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = (canvas.width = canvas.offsetWidth);
        let height = (canvas.height = canvas.offsetHeight);
        let frame = 0;

        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            frame++;

            // Draw wave lines
            for (let w = 0; w < 3; w++) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(34, 211, 238, ${0.03 + w * 0.02})`;
                ctx.lineWidth = 1;
                for (let x = 0; x <= width; x += 2) {
                    const y =
                        height * 0.55 +
                        Math.sin((x / width) * Math.PI * 3 + frame * 0.012 + w * 1.2) * (20 + w * 15) +
                        Math.sin((x / width) * Math.PI * 5 - frame * 0.008 + w) * (10 + w * 8);
                    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                }
                ctx.stroke();
            }

            requestAnimationFrame(draw);
        };

        draw();

        const handleResize = () => {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <section
            id="home"
            className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-25 pb-32">

            <div className="absolute inset-0 bg-[#020d1a]">
                <div className="mesh-bg absolute inset-0">
                    <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] bg-cyan-900/20 rounded-full blur-[120px]" />
                    <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-900/25 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] bg-teal-900/20 rounded-full blur-[90px]" />
                </div>
            </div>

            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full opacity-70"
            />

            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(34,211,238,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,1) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
                <div className="fade-up fade-up-delay-1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-widest uppercase mb-6">
                    <span className="relative flex h-2 w-2">
                        <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
                    </span>
                    Sistem Aktif — Real-time
                </div>

                <h1 className="fade-up fade-up-delay-2 font-semibold tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] mb-6">
                    <span className="text-white">Pantau Pintu Air</span>
                    <br />
                    <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        Bendungan
                    </span>{" "}
                    <span className="text-white">Secara</span>
                    <br />
                    <span className="text-slate-400 font-normal">Real-Time</span>
                </h1>

                <p className="fade-up fade-up-delay-3 text-slate-400 text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
                    Sistem monitoring cerdas untuk pengawasan ketinggian air dan status
                    buka/tutup pintu bendungan — kapan saja, dari mana saja.
                </p>

                <div className="fade-up fade-up-delay-4 flex flex-col sm:flex-row gap-4 justify-center mb-14">
                    <a
                        href="#live-status"
                        className="group relative px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-base overflow-hidden shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
                    >
                        <span className="relative z-10 flex items-center gap-2 justify-center">
                            Lihat Monitoring
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </span>
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </a>

                    <a
                        href="#features"
                        className="px-8 py-3.5 rounded-xl border border-white/10 text-slate-300 font-semibold text-base hover:border-cyan-500/40 hover:text-white hover:bg-white/5 transition-all duration-300"
                    >
                        Pelajari Fitur
                    </a>
                </div>

                <div className="fade-up fade-up-delay-4 grid grid-cols-3 gap-4 max-w-md mx-auto">
                    {[
                        { value: "24/7", label: "Pemantauan" },
                        { value: "<1s", label: "Latensi Data" },
                        { value: "99.9%", label: "Uptime" },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="flex flex-col items-center gap-1 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                        >
                            <span className="font-semibold text-xl text-cyan-300">
                                {stat.value}
                            </span>
                            <span className="text-slate-500 text-xs tracking-wide">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                <span className="text-slate-600 text-xs tracking-widest uppercase">Scroll</span>
                <div className="scroll-bounce w-px h-8 bg-gradient-to-b from-cyan-500/50 to-transparent" />
            </div>
        </section>
    );
}