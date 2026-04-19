"use client";

const features = [
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
                <rect x="4" y="28" width="32" height="3" rx="1.5" fill="currentColor" opacity="0.2" />
                <path d="M4 28 Q10 16 16 22 Q22 28 28 14 Q34 2 36 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                <circle cx="16" cy="22" r="2.5" fill="currentColor" />
                <circle cx="28" cy="14" r="2.5" fill="currentColor" />
                <rect x="18" y="6" width="1.5" height="10" rx="0.75" fill="currentColor" opacity="0.4" />
                <rect x="22" y="3" width="1.5" height="13" rx="0.75" fill="currentColor" opacity="0.4" />
                <rect x="26" y="8" width="1.5" height="8" rx="0.75" fill="currentColor" opacity="0.4" />
            </svg>
        ),
        title: "Pemantauan Ketinggian Air",
        desc: "Data sensor ketinggian air bendungan diperbarui setiap detik dengan visualisasi grafik real-time yang akurat dan mudah dibaca.",
        tag: "Real-time",
        color: "from-cyan-500/10 to-cyan-500/5",
        border: "border-cyan-500/20 hover:border-cyan-400/40",
        accent: "text-cyan-400",
        glow: "shadow-cyan-500/10",
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
                <rect x="8" y="6" width="24" height="28" rx="3" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
                <rect x="12" y="10" width="16" height="5" rx="1.5" fill="currentColor" opacity="0.15" />
                <rect x="14" y="12" width="12" height="1.5" rx="0.75" fill="currentColor" opacity="0.6" />
                <rect x="12" y="19" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.2" />
                <path d="M14 22.5 L16 24.5 L20 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="21" y="21" width="7" height="5" rx="1.5" fill="currentColor" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                <rect x="12" y="30" width="16" height="1.5" rx="0.75" fill="currentColor" opacity="0.25" />
            </svg>
        ),
        title: "Status Pintu Air",
        desc: "Pantau status buka/tutup setiap pintu air secara langsung. Perubahan status terekam otomatis beserta waktu dan petugas yang bertindak.",
        tag: "Live",
        color: "from-blue-500/10 to-blue-500/5",
        border: "border-blue-500/20 hover:border-blue-400/40",
        accent: "text-blue-400",
        glow: "shadow-blue-500/10",
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
                <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
                <path d="M20 8 L20 20 L28 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="20" cy="20" r="2" fill="currentColor" />
                <path d="M8 14 L4 10 M8 26 L4 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                <path d="M32 14 L36 10 M32 26 L36 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
            </svg>
        ),
        title: "Riwayat & Histori",
        desc: "Akses log lengkap seluruh aktivitas pintu air dan fluktuasi ketinggian air. Filter berdasarkan tanggal, pintu, dan jenis kejadian.",
        tag: "Logging",
        color: "from-teal-500/10 to-teal-500/5",
        border: "border-teal-500/20 hover:border-teal-400/40",
        accent: "text-teal-400",
        glow: "shadow-teal-500/10",
    },
    {
        icon: (
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
                <rect x="6" y="14" width="28" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
                <rect x="10" y="18" width="8" height="5" rx="1" fill="currentColor" opacity="0.2" />
                <rect x="22" y="18" width="8" height="5" rx="1" fill="currentColor" opacity="0.2" />
                <rect x="10" y="27" width="20" height="3" rx="1" fill="currentColor" opacity="0.15" />
                <path d="M14 6 L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M26 6 L26 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="14" cy="6" r="2" fill="currentColor" opacity="0.7" />
                <circle cx="26" cy="6" r="2" fill="currentColor" opacity="0.7" />
            </svg>
        ),
        title: "Kendali Admin",
        desc: "Panel admin untuk mengatur akses, mengoperasikan pintu air jarak jauh, dan mengkonfigurasi ambang batas peringatan dini banjir.",
        tag: "Control",
        color: "from-indigo-500/10 to-indigo-500/5",
        border: "border-indigo-500/20 hover:border-indigo-400/40",
        accent: "text-indigo-400",
        glow: "shadow-indigo-500/10",
    },
];

export default function Features() {
    return (
        <section id="features" className="relative py-28 px-6 bg-gradient-to-b from-[#020d1a] via-[#04111f] to-[#05182b]">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent" />
            </div>

            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[15%] w-[420px] h-[420px] bg-cyan-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-15%] right-[10%] w-[360px] h-[360px] bg-blue-500/10 rounded-full blur-[120px]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent" />
            </div>

            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <p className="text-cyan-400 text-xs font-semibold tracking-widest uppercase mb-4">
                        Fitur Unggulan
                    </p>

                    <h2 className="font-semibold text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-4">
                        Semua yang Anda Butuhkan
                        <br />
                        <span className="text-slate-400 font-normal">
                            dalam Satu Platform
                        </span>
                    </h2>

                    <p className="text-slate-400 text-lg leading-relaxed">
                        Dirancang untuk kemudahan operasional dan keandalan tinggi dalam
                        pemantauan infrastruktur bendungan.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {features.map((f, i) => (
                        <div
                            key={f.title}
                            className={`group relative p-7 rounded-2xl bg-gradient-to-br ${f.color} border ${f.border} transition-all duration-300 cursor-default overflow-hidden shadow-xl ${f.glow}`}
                        >
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-white/[0.03] rounded-full blur-2xl transform scale-90 group-hover:scale-125 transition-all duration-700 ease-out" />
                            </div>

                            <div className="relative">
                                <div className="flex items-start justify-between mb-5">
                                    <div className={`p-3 rounded-xl bg-white/[0.05] ${f.accent}`}>
                                        {f.icon}
                                    </div>
                                    <span className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-white/[0.05] ${f.accent}`}>
                                        {f.tag}
                                    </span>
                                </div>

                                <h3 className=" font-bold text-xl text-white mb-3 group-hover:text-white transition-colors">
                                    {f.title}
                                </h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    {f.desc}
                                </p>

                                <div className={`mt-5 flex items-center gap-2 text-sm font-semibold ${f.accent} opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-4px] group-hover:translate-x-0`}>
                                    Pelajari lebih lanjut
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}