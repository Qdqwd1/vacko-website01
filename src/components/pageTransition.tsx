"use client"

import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"

declare global {
  interface Window {
    __vackoTransitioning?: boolean
  }
}

type Layer = {
  key: string
  node: React.ReactNode
}

const EVT_START = "vacko:transition-start"
const EVT_END = "vacko:transition-end"

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const [current, setCurrent] = useState<Layer>(() => ({
    key: pathname,
    node: children,
  }))
  const [prev, setPrev] = useState<Layer | null>(null)
  const [animating, setAnimating] = useState(false)

  const currentRef = useRef(current)
  const prevRef = useRef<Layer | null>(null)

  useEffect(() => {
    currentRef.current = current
  }, [current])

  useEffect(() => {
    prevRef.current = prev
  }, [prev])

  useEffect(() => {
    window.__vackoTransitioning = false
  }, [])

  useLayoutEffect(() => {
    // same route: only update node (no transition)
    if (pathname === currentRef.current.key) {
      // avoid needless state update if node reference is identical
      if (currentRef.current.node !== children) {
        setCurrent((c) => ({ ...c, node: children }))
      }
      return
    }

    window.__vackoTransitioning = true
    window.dispatchEvent(new Event(EVT_START))

    const old = currentRef.current
    setPrev(old)
    setCurrent({ key: pathname, node: children })
    setAnimating(true)

    requestAnimationFrame(() => window.scrollTo(0, 0))
  }, [pathname, children])

  return (
    <div className="relative overflow-hidden bg-white min-h-screen">
      {prev && (
        <div className="fixed inset-0 z-1">
          <div className="h-screen overflow-auto">{prev.node}</div>

          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[#333438]"
            initial={{ opacity: 0 }}
            animate={{ opacity: animating ? 0.55 : 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      )}

      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={current.key}
          className="relative z-2 bg-white min-h-screen"
          initial={prev ? { y: "-110%" } : false}
          animate={{ y: 0 }}
          transition={{ duration: 1.15, ease: [0.14, 0.88, 0.18, 1] }}
          onAnimationComplete={() => {
            // avoid extra state updates if already cleared
            if (prevRef.current) setPrev(null)
            setAnimating(false)
            window.__vackoTransitioning = false
            window.dispatchEvent(new Event(EVT_END))
          }}
        >
          {current.node}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}