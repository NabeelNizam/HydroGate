"use client"

import Image from "next/image"
import Link from "next/link"
import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { FirebaseError } from "firebase/app"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, serverTimestamp, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react"

export default function RegisterPage() {
    const router = useRouter()

    const [showPassword, setShowPassword] = useState(false)
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        if (!username || !email || !password) {
            setError("Semua field wajib diisi.")
            return
        }

        if (password.length < 6) {
            setError("Password minimal 6 karakter.")
            return
        }

        try {
            setLoading(true)

            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            await updateProfile(user, {
                displayName: username,
            })

            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                username,
                email: user.email,
                role: "admin",
                createdAt: serverTimestamp(),
            })

            setSuccess("User berhasil ditambahkan.")
            router.push("/login")
        } catch (err: unknown) {
            if (err instanceof FirebaseError) {
                switch (err.code) {
                    case "auth/email-already-in-use":
                        setError("Email sudah digunakan.")
                        break
                    case "auth/invalid-email":
                        setError("Format email tidak valid.")
                        break
                    case "auth/weak-password":
                        setError("Password terlalu lemah.")
                        break
                    default:
                        setError("Gagal menambahkan user. Coba lagi.")
                }
            } else {
                setError("Gagal menambahkan user. Coba lagi.")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-10">
            <Image
                src="/login.png"
                alt="Latar belakang pintu air HydroGate"
                fill
                priority
                sizes="100vw"
                className="object-cover blur-xl scale-110"
            />

            <div className="absolute inset-0 bg-[#0F172A]/30" />

            <section className="relative z-10 grid w-full max-w-6xl grid-cols-1 overflow-hidden rounded-[2rem] border border-white/40 bg-white/55 p-4 shadow-2xl backdrop-blur-xl md:grid-cols-2">
                <div className="flex items-center justify-center px-6 py-10 md:px-16 md:py-12">
                    <div className="w-full max-w-sm">
                        <div className="text-center">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#0F766E]">
                                HydroGate Access
                            </p>
                            <h1 className="text-4xl font-bold tracking-tight text-slate-950">
                                Tambah User
                            </h1>
                            <p className="mt-4 text-sm leading-6 text-slate-600">
                                Buat akun operator baru untuk mengakses monitoring,
                                perangkat, dan kontrol pintu air HydroGate.
                            </p>
                        </div>

                        <p className="mt-10 text-sm font-semibold text-slate-800">
                            Lengkapi data akun
                        </p>

                        <form className="mt-4 space-y-5" onSubmit={handleSubmit}>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                                className="h-16 w-full rounded-lg border border-white/60 bg-white/70 px-6 text-slate-800 shadow-lg outline-none backdrop-blur-md placeholder:text-slate-400 transition focus:border-white focus:bg-white/90"
                            />

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                className="h-16 w-full rounded-lg border border-white/60 bg-white/70 px-6 text-slate-800 shadow-lg outline-none backdrop-blur-md placeholder:text-slate-400 transition focus:border-white focus:bg-white/90"
                            />

                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    className="h-16 w-full rounded-lg border border-white/60 bg-white/70 px-6 pr-14 text-slate-800 shadow-lg outline-none backdrop-blur-md placeholder:text-slate-400 transition focus:border-white focus:bg-white/90"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <Link
                                    href="/"
                                    className="text-xs font-medium text-slate-500 transition hover:text-[#0F766E]"
                                >
                                    Kembali ke beranda
                                </Link>
                                <Link
                                    href="/auth/login"
                                    className="text-right text-xs font-medium text-slate-500 transition hover:text-[#0F766E]"
                                >
                                    Sudah punya akun
                                </Link>
                            </div>

                            {error && (
                                <div className="rounded-lg border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-600">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="rounded-lg border border-teal-200 bg-teal-50/80 px-4 py-3 text-sm text-teal-700">
                                    {success}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="h-16 w-full rounded-lg bg-[#0F172A]/95 text-base font-semibold text-white shadow-xl transition hover:bg-[#1E293B] disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {loading ? "Menambahkan..." : "Tambah User"}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="relative hidden min-h-[650px] overflow-hidden rounded-[1.5rem] md:block">
                    <Image
                        src="/login.png"
                        alt="Visual sistem monitoring pintu air HydroGate"
                        fill
                        priority
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/55 via-[#0F172A]/10 to-transparent" />

                    <div className="absolute bottom-20 left-12 right-12">
                        <p className="text-2xl font-light leading-snug text-white">
                            Kelola akses operator dengan tampilan yang tertata.
                        </p>

                        <div className="mt-8 flex gap-6">
                            <button
                                type="button"
                                aria-label="Sebelumnya"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 text-white transition hover:bg-white/15"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </button>

                            <button
                                type="button"
                                aria-label="Berikutnya"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/70 text-white transition hover:bg-white/15"
                            >
                                <ArrowRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
