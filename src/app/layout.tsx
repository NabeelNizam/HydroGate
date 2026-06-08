import "./globals.css"
import { AuthProvider } from "@/components/AuthProvider"
import LayoutWrapper from "./layoutWrapper"
import { Inter } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
})

export const metadata = {
  icons: {
    icon: "/logo_hydrogate.svg",
  },
  title: "HydroGate",
  description: "Sistem monitoring dan kontrol pintu air berbasis IoT.",
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" data-scroll-behavior="smooth">
      <body className={inter.className} >
        <AuthProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  )
}
