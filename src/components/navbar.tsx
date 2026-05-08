"use client"

import { useEffect, useState } from "react"

const sections = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "flow", label: "Flow" },
    { id: "features", label: "Features" },
    { id: "live-status", label: "Live Status" },
]

export default function Navbar() {
    const [active, setActive] = useState("home")

    useEffect(() => {
        const sectionElements = sections
            .map((section) => document.getElementById(section.id))
            .filter(Boolean) as HTMLElement[]

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActive(entry.target.id)
                    }
                })
            },
            {
                root: null,
                rootMargin: "-30% 0px -50% 0px",
                threshold: 0.1,
            }
        )

        sectionElements.forEach((section) => {
            observer.observe(section)
        })

        return () => observer.disconnect()
    }, [])

    const linkClass = (id: string) =>
        `relative pb-1 transition-all duration-300 ${
            active === id
                ? "text-cyan-400"
                : "text-white/80 hover:text-cyan-400"
        }`

    return (
        <nav className="fixed top-0 left-0 z-50 w-full bg-[#020d1a]/80 backdrop-blur-md border-b border-white/5">
            <div className="px-32 flex items-center justify-between py-4">

                {/* Logo */}
                <a href="#home" className="flex items-center gap-3 group">
                    <div className="relative w-9 h-9">
                        <div className="absolute inset-0 rounded-lg bg-cyan-500/20 group-hover:bg-cyan-500/30 transition-colors duration-300" />

                        <div className="absolute inset-[3px] rounded-md bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path
                                    d="M3 9C3 6.2 5.2 4 8 4h2c2.8 0 5 2.2 5 5v1H3V9z"
                                    fill="white"
                                    opacity="0.9"
                                />
                                <rect
                                    x="1"
                                    y="10"
                                    width="16"
                                    height="2.5"
                                    rx="1"
                                    fill="white"
                                    opacity="0.6"
                                />
                                <rect x="4" y="12.5" width="2" height="3" rx="0.5" fill="white" />
                                <rect x="8" y="12.5" width="2" height="3" rx="0.5" fill="white" />
                                <rect x="12" y="12.5" width="2" height="3" rx="0.5" fill="white" />
                            </svg>
                        </div>
                    </div>

                    <div>
                        <span className="font-bold text-white text-base tracking-wide block">
                            HydroGate
                        </span>

                        <span className="text-cyan-400/70 text-sm tracking-wide block">
                            Monitor
                        </span>
                    </div>
                </a>

                {/* Navigation */}
                <div className="hidden lg:flex items-center gap-12 pr-12 text-sm font-medium uppercase tracking-wide">

                    {sections.map((section) => (
                        <a
                            key={section.id}
                            href={`#${section.id}`}
                            className={linkClass(section.id)}
                        >
                            {section.label}

                            {/* Active Indicator */}
                            <span
                                className={`absolute left-0 -bottom-1 h-[2px] bg-cyan-400 transition-all duration-300 ${
                                    active === section.id
                                        ? "w-full opacity-100"
                                        : "w-0 opacity-0"
                                }`}
                            />

                            {/* Glow Effect */}
                            <span
                                className={`absolute inset-x-0 -bottom-[6px] h-[10px] bg-cyan-400/20 blur-md transition-all duration-300 ${
                                    active === section.id
                                        ? "opacity-100"
                                        : "opacity-0"
                                }`}
                            />
                        </a>
                    ))}

                    {/* Login Button */}
                    <a
                        href="auth/login"
                        className="ml-4 px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold tracking-wide shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.03] transition-all duration-300"
                    >
                        Login
                    </a>
                </div>
            </div>
        </nav>
    )
}