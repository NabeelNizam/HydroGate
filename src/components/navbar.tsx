"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

const sections = [
    { id: "home", label: "Beranda" },
    { id: "about", label: "Tentang" },
    { id: "features", label: "Fitur" },
    { id: "statistics", label: "Statistik" },
    { id: "live-status", label: "Monitoring" },
    { id: "workflow", label: "Cara Kerja" },
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
        `relative py-2 text-sm font-medium transition-colors duration-200 ${active === id
            ? "text-[#0B3558]"
            : "text-[#6B7280] hover:text-[#0B3558]"
        }`

    return (
        <nav className="fixed left-0 top-0 z-50 w-full border-b border-[#E5E5E5] bg-white/90 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
                <a href="#home" className="flex items-center gap-3">
                    <Image
                        src="/logo_hydrogate.svg"
                        alt="Logo HydroGate"
                        width={40}
                        height={40}
                        priority
                        className="rounded-lg"
                    />
                    <span className="text-sm font-semibold tracking-normal text-[#111111]">
                        HydroGate
                    </span>
                </a>

                <div className="hidden items-center gap-6 lg:flex">
                    {sections.map((section) => (
                        <a
                            key={section.id}
                            href={`#${section.id}`}
                            className={linkClass(section.id)}
                        >
                            {section.label}
                            <span
                                className={`absolute inset-x-0 bottom-0 h-px bg-[#14B8A6] transition-all duration-200 ${active === section.id
                                        ? "w-full opacity-100"
                                        : "w-0 opacity-0"
                                    }`}
                            />
                        </a>
                    ))}

                    <a
                        href="/auth/login"
                        className="rounded-lg border border-[#0B3558] bg-[#0B3558] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#0B3558]"
                    >
                        Masuk
                    </a>
                </div>
            </div>
        </nav>
    )
}
