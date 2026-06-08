"use client";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#E5E5E5] bg-white px-5 py-8 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#0B3558]">HydroGate</p>
          <p className="mt-1 text-xs text-[#6B7280]">
            (c) {year} HydroGate. Sistem monitoring dan kontrol pintu air berbasis IoT.
          </p>
        </div>
        <nav className="flex flex-wrap gap-5 text-sm text-[#6B7280]">
          <a href="#about" className="transition-colors hover:text-[#0F766E]">Tentang</a>
          <a href="#features" className="transition-colors hover:text-[#0F766E]">Fitur</a>
          <a href="#statistics" className="transition-colors hover:text-[#0F766E]">Statistik</a>
          <a href="#live-status" className="transition-colors hover:text-[#0F766E]">Monitoring</a>
          <a href="/auth/login" className="transition-colors hover:text-[#0F766E]">Masuk</a>
        </nav>
      </div>
    </footer>
  );
}
