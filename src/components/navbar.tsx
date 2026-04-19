"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 z-50 w-full bg-[#020d1a] shadow-md">
            <div className="px-32 flex items-center justify-between p-4">
                {/* Logo */}
                <a href="#" className="flex items-center gap-3 group">
                    <div className="relative w-9 h-9">
                        <div className="absolute inset-0 rounded-lg bg-cyan-500/20 group-hover:bg-cyan-500/30 transition-colors duration-300" />
                        <div className="absolute inset-[3px] rounded-md bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M3 9C3 6.2 5.2 4 8 4h2c2.8 0 5 2.2 5 5v1H3V9z" fill="white" opacity="0.9" />
                                <rect x="1" y="10" width="16" height="2.5" rx="1" fill="white" opacity="0.6" />
                                <rect x="4" y="12.5" width="2" height="3" rx="0.5" fill="white" />
                                <rect x="8" y="12.5" width="2" height="3" rx="0.5" fill="white" />
                                <rect x="12" y="12.5" width="2" height="3" rx="0.5" fill="white" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <span className="font-['Syne'] font-800 text-white text-base tracking-tight leading-none block">
                            AquaGate
                        </span>
                        <span className="text-cyan-400/70 text-[10px] tracking-widest uppercase font-['DM_Sans']">
                            Monitor
                        </span>
                    </div>
                </a>

                <div className="hidden items-center gap-12 pr-12 text-sm font-medium uppercase tracking-wide lg:flex text-white">
                    <Link href="/" className="hover:text-cyan-400 transition-colors duration-300" >Home</Link>
                    <Link href="/about" className="hover:text-cyan-400 transition-colors duration-300">About</Link>
                    <Link href="/flow" className="hover:text-cyan-400 transition-colors duration-300">Flow</Link>
                    <Link href="/flow" className="hover:text-cyan-400 transition-colors duration-300">Features</Link>
                    <Link href="/flow" className="hover:text-cyan-400 transition-colors duration-300">LiveStatus</Link>
                </div>
            </div>
        </nav>
    )

}