"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    // Activate the ::view-transition CSS rules defined in globals.css
    document.documentElement.dataset.vt = "on"
  }, [])

  useEffect(() => {
    // Scroll to top on route change — Lenis-safe
    window.scrollTo(0, 0)
  }, [pathname])

  return <>{children}</>
}