'use client';

import { useEffect, useState } from 'react';

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="relative border-t border-white/[0.06] py-14 px-6 bg-[#020d1a]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 9C3 6.2 5.2 4 8 4h2c2.8 0 5 2.2 5 5v1H3V9z" fill="white" opacity="0.9"/>
                  <rect x="1" y="10" width="16" height="2.5" rx="1" fill="white" opacity="0.6"/>
                  <rect x="4" y="12.5" width="2" height="3" rx="0.5" fill="white"/>
                  <rect x="8" y="12.5" width="2" height="3" rx="0.5" fill="white"/>
                  <rect x="12" y="12.5" width="2" height="3" rx="0.5" fill="white"/>
                </svg>
              </div>
              <div>
                <span className="font-['Syne'] font-bold text-white text-base leading-none block">AquaGate Monitor</span>
                <span className="text-cyan-400/60 text-[10px] tracking-widest uppercase">Sistem Monitoring Pintu Air</span>
              </div>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Solusi pemantauan bendungan berbasis IoT untuk keselamatan infrastruktur dan keandalan operasional.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Navigasi</h4>
            <ul className="space-y-2.5">
              {["Home", "Monitoring", "Riwayat", "Login"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-slate-500 text-sm hover:text-cyan-400 transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Sistem</h4>
            <ul className="space-y-2.5">
              {["Status Sistem", "Dokumentasi API", "Panduan Admin", "Kontak"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-slate-500 text-sm hover:text-cyan-400 transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className=" border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs">
            © {year || new Date().getFullYear()} AquaGate Monitor. Sistem Monitoring Pintu Air Bendungan.
          </p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-slate-500 text-xs">Semua sistem berjalan normal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}