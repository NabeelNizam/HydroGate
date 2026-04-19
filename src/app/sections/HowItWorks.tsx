"use client";

const steps = [
    {
        num: "01",
        title: "Sensor Membaca Data",
        desc: "Sensor ultrasonik dan tekanan terpasang di titik strategis bendungan mengukur ketinggian air secara kontinu setiap detik.",
        icon: (
            <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
                <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
                <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
                <circle cx="24" cy="24" r="3" fill="currentColor" opacity="0.8" />
                <path d="M24 6 L24 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
                <path d="M24 34 L24 42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
                <path d="M6 24 L14 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
                <path d="M34 24 L42 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            </svg>
        ),
    },
    {
        num: "02",
        title: "Data Dikirim ke Server",
        desc: "Data dikirimkan via protokol IoT terenkripsi ke server pusat untuk diproses, disimpan, dan dianalisis secara real-time.",
        icon: (
            <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
                <rect x="8" y="14" width="32" height="20" rx="4" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
                <path d="M16 24 L24 18 L32 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
                <path d="M24 18 L24 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
                <path d="M8 8 Q24 2 40 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                <path d="M4 40 L44 40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
                <circle cx="12" cy="40" r="2" fill="currentColor" opacity="0.5" />
                <circle cx="24" cy="40" r="2" fill="currentColor" opacity="0.5" />
                <circle cx="36" cy="40" r="2" fill="currentColor" opacity="0.5" />
            </svg>
        ),
    },
    {
        num: "03",
        title: "Tampil & Beri Peringatan",
        desc: "Dashboard menampilkan data secara visual. Jika ketinggian melewati batas aman, sistem otomatis mengirim notifikasi kepada petugas.",
        icon: (
            <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
                <rect x="6" y="10" width="36" height="24" rx="4" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
                <rect x="14" y="34" width="20" height="4" fill="currentColor" opacity="0.15" />
                <rect x="10" y="16" width="10" height="12" rx="1.5" fill="currentColor" opacity="0.15" />
                <path d="M12 22 L16 18 L20 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
                <rect x="24" y="18" width="14" height="2" rx="1" fill="currentColor" opacity="0.3" />
                <rect x="24" y="22" width="10" height="2" rx="1" fill="currentColor" opacity="0.2" />
                <rect x="24" y="26" width="12" height="2" rx="1" fill="currentColor" opacity="0.25" />
                <circle cx="38" cy="12" r="5" fill="#ef4444" opacity="0.8" />
                <path d="M38 9.5 L38 12.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="38" cy="14.5" r="0.8" fill="white" />
            </svg>
        ),
    },
];

export default function HowItWorks() {
    return (
        <section id="flow" className="relative py-28 px-6 bg-gradient-to-b from-[#020d1a] via-[#04111f] to-[#05182b]">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent" />
            </div>

            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[15%] w-[420px] h-[420px] bg-cyan-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-15%] right-[10%] w-[360px] h-[360px] bg-blue-500/10 rounded-full blur-[120px]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent" />
            </div>

            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <p className="text-cyan-400 text-xs font-semibold tracking-widest uppercase mb-4">
                        Cara Kerja
                    </p>
                    <h2 className=" font-bold text-3xl md:text-4xl text-white mb-4">
                        Sederhana. Cepat. Andal.
                    </h2>
                    <p className="text-slate-400 max-w-xl mx-auto">
                        Tiga langkah otomatis yang memastikan data bendungan selalu
                        tersedia dan akurat.
                    </p>
                </div>

                {/* Steps */}
                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Connector line (desktop) */}
                    <div className="hidden md:block absolute top-14 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px">
                        <div className="h-full bg-gradient-to-r from-cyan-500/30 via-blue-500/20 to-teal-500/30" />
                        <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-500/50" />
                        <div className="absolute left-3/4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-teal-500/50" />
                    </div>

                    {steps.map((step, i) => (
                        <div
                            key={step.num}
                            className="relative group flex flex-col items-center text-center"
                        >
                            {/* Circle */}
                            <div className="relative mb-6">
                                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 group-hover:border-cyan-400/40 flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:shadow-cyan-500/10">
                                    <div className="text-cyan-400">{step.icon}</div>
                                </div>
                                {/* Step number badge */}
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                                    <span className=" font-bold text-xs text-white">
                                        {i + 1}
                                    </span>
                                </div>
                            </div>

                            <span className=" font-extrabold text-4xl text-white/5 absolute top-4 left-1/2 -translate-x-1/2">
                                {step.num}
                            </span>

                            <h3 className=" font-bold text-lg text-white mb-3">
                                {step.title}
                            </h3>
                            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* CTA banner */}
                <div className="mt-20 relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-900/30 via-blue-900/30 to-teal-900/30 border border-cyan-500/15 p-8 md:p-10 text-center">
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                    </div>
                    <h3 className=" font-bold text-2xl md:text-3xl text-white mb-3">
                        Siap Memantau Bendungan Anda?
                    </h3>
                    <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                        Hubungi tim kami untuk implementasi sistem monitoring di bendungan
                        Anda.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="#login"
                            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40"
                        >
                            Mulai Sekarang
                        </a>
                        <a
                            href="#features"
                            className="px-8 py-3.5 rounded-xl border border-white/10 text-slate-300 font-semibold hover:border-cyan-500/30 hover:text-white transition-all duration-300"
                        >
                            Lihat Dokumentasi
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}