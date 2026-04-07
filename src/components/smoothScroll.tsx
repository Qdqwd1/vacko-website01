"use client"

import { ReactNode, useEffect, useRef } from "react"
import Lenis from "lenis"
import { usePathname } from "next/navigation"

const clamp01 = (n: number) => Math.max(0, Math.min(1, n))

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const rafRef = useRef<number | null>(null)
  const pathname = usePathname()

  // indicator refs (avoid React state in RAF)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const thumbRef = useRef<HTMLDivElement | null>(null)

  // constants for indicator (same as before)
  const thumbHeight = 0.18

  useEffect(() => {
    const prefersReduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches

    const isMobile =
      window.matchMedia?.("(pointer: coarse)")?.matches ||
      window.matchMedia?.("(max-width: 768px)")?.matches

    if (prefersReduced || isMobile) return

    const lenis = new Lenis({
      duration: 1,
      wheelMultiplier: 1,
      touchMultiplier: 1.1,
    })

    lenisRef.current = lenis

    const updateIndicator = () => {
      const thumb = thumbRef.current
      if (!thumb) return

      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      const p = max > 0 ? doc.scrollTop / max : 0
      const progress = clamp01(p)

      const y = (1 - thumbHeight) * progress
      thumb.style.transform = `translateY(${y * 100}%)`
    }

    const raf = (time: number) => {
      lenis.raf(time)
      updateIndicator()
      rafRef.current = requestAnimationFrame(raf)
    }

    rafRef.current = requestAnimationFrame(raf)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  // Snap to top on route change (same behavior)
  useEffect(() => {
    const lenis = lenisRef.current
    if (lenis) lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)

    // keep indicator correct immediately after route change
    const thumb = thumbRef.current
    if (thumb) thumb.style.transform = `translateY(0%)`
  }, [pathname])

  return (
    <>
      {/* Custom Scroll Indicator */}
      <div
        ref={trackRef}
        className="fixed right-3 top-3 bottom-3 z-9999 w-0 pointer-events-none"
      >
        <div className="absolute inset-0 rounded-full bg-black/10" />
        <div
          ref={thumbRef}
          className="absolute left-0 w-full rounded-full bg-black/60"
          style={{
            height: `${thumbHeight * 100}%`,
            transform: `translateY(0%)`,
          }}
        />
      </div>

      {children}
    </>
  )
}