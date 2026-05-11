"use client";

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

// Hook untuk tracking posisi mouse
function useMousePosition() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return { mouseX, mouseY };
}


function FloatingParticles() {
    const [particles, setParticles] = useState<Array<{
        id: number;
        x: number;
        y: number;
        size: number;
        duration: number;
        delay: number;
    }>>([]);

    useEffect(() => {

        setParticles(
            Array.from({ length: 20 }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 4 + 2,
                duration: Math.random() * 10 + 10,
                delay: Math.random() * 5,
            }))
        );
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full bg-cyan-400/20"
                    style={{
                        width: p.size,
                        height: p.size,
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        x: [0, Math.random() * 20 - 10, 0],
                        opacity: [0.2, 0.6, 0.2],
                        scale: [1, 1.5, 1],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
}


function AnimatedText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
    return (
        <span className={className}>
            {text.split("").map((char, i) => (
                <motion.span
                    key={i}
                    className="inline-block"
                    initial={{ opacity: 0, y: 20, rotateX: -90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{
                        delay: delay + i * 0.03,
                        duration: 0.5,
                        ease: [0.215, 0.61, 0.355, 1],
                    }}
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </span>
    );
}


function AnimatedCounter({ target, suffix = "", duration = 2 }: { target: number; suffix?: string; duration?: number }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    let start = 0;
                    const increment = target / (duration * 60);
                    const timer = setInterval(() => {
                        start += increment;
                        if (start >= target) {
                            setCount(target);
                            clearInterval(timer);
                        } else {
                            setCount(Math.floor(start));
                        }
                    }, 1000 / 60);
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target, duration, hasAnimated]);

    return <span ref={ref}>{count}{suffix}</span>;
}


function MagneticButton({ children, className, ...props }: React.ComponentProps<typeof motion.a>) {
    const ref = useRef<HTMLAnchorElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 150, damping: 15 });
    const springY = useSpring(y, { stiffness: 150, damping: 15 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set((e.clientX - centerX) * 0.3);
        y.set((e.clientY - centerY) * 0.3);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.a
            ref={ref}
            className={className}
            style={{ x: springX, y: springY }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            {...props}
        >
            {children}
        </motion.a>
    );
}


function MouseFollowBlob() {
    const { mouseX, mouseY } = useMousePosition();
    const springConfig = { stiffness: 50, damping: 20 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    return (
        <motion.div
            className="fixed w-[500px] h-[500px] rounded-full pointer-events-none z-0 opacity-30"
            style={{
                x: useTransform(x, (val) => val - 250),
                y: useTransform(y, (val) => val - 250),
                background: "radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)",
            }}
        />
    );
}

export default function Hero() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <>
            <MouseFollowBlob />
            <motion.section
                id="home"
                className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-25 pb-32"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                {/* Background dengan Mesh Gradient */}
                <div className="absolute inset-0 bg-[#020d1a]">
                    <div className="mesh-bg absolute inset-0">
                        <motion.div
                            className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] bg-cyan-900/20 rounded-full blur-[120px]"
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.2, 0.3, 0.2]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        <motion.div
                            className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-900/25 rounded-full blur-[100px]"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.25, 0.35, 0.25]
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 1
                            }}
                        />
                        <motion.div
                            className="absolute bottom-[-10%] left-[30%] w-[400px] h-[400px] bg-teal-900/20 rounded-full blur-[90px]"
                            animate={{
                                scale: [1, 1.15, 1],
                                opacity: [0.2, 0.3, 0.2]
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 2
                            }}
                        />
                    </div>
                </div>

                {/* Grid Pattern */}
                <motion.div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(34,211,238,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,1) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                    animate={{
                        backgroundPosition: ["0px 0px", "60px 60px"],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />

                {/* Partikel Melayang */}
                <FloatingParticles />

                {/* Content */}
                <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
                    {/* Badge */}
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-widest uppercase mb-6 cursor-pointer group"
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                        whileHover={{ scale: 1.05, borderColor: "rgba(6,182,212,0.5)" }}
                    >
                        <span className="relative flex h-2 w-2">
                            <motion.span
                                className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"
                                animate={{ scale: [1, 2, 1], opacity: [0.75, 0, 0.75] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
                        </span>
                        <span className="group-hover:text-cyan-300 transition-colors">Sistem Aktif — Real-time</span>
                    </motion.div>

                    {/* Heading dengan Animasi Karakter */}
                    <motion.h1
                        className="font-semibold tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] mb-6 perspective-1000"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        <div className="overflow-hidden">
                            <AnimatedText text="Pantau Pintu Air" className="text-white" delay={0.8} />
                        </div>
                        <div className="overflow-hidden">
                            <AnimatedText
                                text="Bendungan"
                                className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent"
                                delay={1.2}
                            />
                            <AnimatedText text=" Secara" className="text-white" delay={1.4} />
                        </div>
                        <div className="overflow-hidden">
                            <AnimatedText text="Real-Time" className="text-slate-400 font-normal" delay={1.6} />
                        </div>
                    </motion.h1>

                    {/* Paragraf dengan Efek Typewriter */}
                    <motion.p
                        className="text-slate-400 text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                    >
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2, duration: 0.1 }}
                        >
                            {"Sistem monitoring cerdas untuk pengawasan ketinggian air dan status buka/tutup pintu bendungan — kapan saja, dari mana saja.".split("").map((char, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.4 + i * 0.02 }}
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </motion.span>
                    </motion.p>

                    {/* Tombol dengan Efek Magnetik */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center mb-14"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.6, duration: 0.8 }}
                    >
                        <MagneticButton
                            href="#live-status"
                            className="group relative px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-base overflow-hidden shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="relative z-10 flex items-center gap-2 justify-center">
                                Lihat Monitoring
                                <motion.svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2.5}
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </motion.svg>
                            </span>
                            <motion.div
                                className="absolute inset-0 bg-white/10"
                                initial={{ y: "100%" }}
                                whileHover={{ y: "0%" }}
                                transition={{ duration: 0.3 }}
                            />
                            {/* Shine Effect */}
                            <motion.div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{
                                    background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 45%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.2) 55%, transparent 60%)",
                                    backgroundSize: "200% 100%",
                                }}
                                animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            />
                        </MagneticButton>

                        <MagneticButton
                            href="#features"
                            className="px-8 py-3.5 rounded-xl border border-white/10 text-slate-300 font-semibold text-base hover:border-cyan-500/40 hover:text-white hover:bg-white/5 transition-all duration-300 relative overflow-hidden group"
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="relative z-10">Pelajari Fitur</span>
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10"
                                initial={{ x: "-100%" }}
                                whileHover={{ x: "0%" }}
                                transition={{ duration: 0.3 }}
                            />
                        </MagneticButton>
                    </motion.div>

                    {/* Stats dengan Counter Animasi */}
                    <motion.div
                        className="grid grid-cols-3 gap-4 max-w-md mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2.0, duration: 0.8 }}
                    >
                        {[
                            { value: 24, suffix: "/7", label: "Pemantauan" },
                            { value: 1, suffix: "s", prefix: "<", label: "Latensi Data" },
                            { value: 99, suffix: ".9%", label: "Uptime" },
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                className="flex flex-col items-center gap-1 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-cyan-500/20 transition-all duration-300 cursor-default group"
                                initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
                                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                transition={{ delay: 2.2 + index * 0.1, duration: 0.5, type: "spring" }}
                                whileHover={{ scale: 1.05, y: -5 }}
                            >
                                <span className="font-semibold text-xl text-cyan-300 group-hover:text-cyan-200 transition-colors">
                                    {stat.prefix}
                                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                                </span>
                                <span className="text-slate-500 text-xs tracking-wide group-hover:text-slate-400 transition-colors">
                                    {stat.label}
                                </span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer group"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.8, duration: 0.8 }}
                    onClick={() => document.getElementById("live-status")?.scrollIntoView({ behavior: "smooth" })}
                >
                    <motion.span
                        className="text-slate-600 text-xs tracking-widest uppercase group-hover:text-cyan-400 transition-colors"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        Scroll
                    </motion.span>
                    <motion.div
                        className="w-px h-8 bg-gradient-to-b from-cyan-500/50 to-transparent relative overflow-hidden"
                        animate={{ scaleY: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <motion.div
                            className="absolute top-0 left-0 w-full h-4 bg-cyan-400"
                            animate={{ y: ["-100%", "200%"] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </motion.div>
                </motion.div>

                {/* Decorative Wave di Bawah */}
                <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
                    <motion.svg
                        viewBox="0 0 1200 120"
                        preserveAspectRatio="none"
                        className="w-full h-16 opacity-20"
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        transition={{ delay: 3, duration: 1 }}
                    >
                        <motion.path
                            d="M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z"
                            fill="url(#gradient)"
                            animate={{
                                d: [
                                    "M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z",
                                    "M0,60 C150,0 350,120 600,60 C850,0 1050,120 1200,60 L1200,120 L0,120 Z",
                                    "M0,60 C150,120 350,0 600,60 C850,120 1050,0 1200,60 L1200,120 L0,120 Z",
                                ]
                            }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#06b6d4" />
                                <stop offset="100%" stopColor="#3b82f6" />
                            </linearGradient>
                        </defs>
                    </motion.svg>
                </div>
            </motion.section>
        </>
    );
}
