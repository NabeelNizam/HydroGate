"use client"

import { usePathname } from "next/navigation"
import Navbar from "../components/navbar"
import Footer from "../components/footer"

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const disableRoutes = ["/dashboard", "/auth/login", "/auth/register", "/404"]

  const isDisabled = disableRoutes.some((route) =>
    pathname.startsWith(route)
  )

  return (
    <>
      {!isDisabled && <Navbar />}
      {children}
      {!isDisabled && <Footer />}
    </>
  )
}