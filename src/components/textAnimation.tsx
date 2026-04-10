"use client"

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"

type SpeedPreset = "Title" | "Body"

const presets: Record<SpeedPreset, { durMs: number; lineStaggerMs: number }> = {
  Title: { durMs: 1500, lineStaggerMs: 200 },
  Body: { durMs: 800, lineStaggerMs: 120 },
}

type TextAnimationProps = {
  text: string
  className?: string
  speed?: SpeedPreset
  threshold?: number
  rootMargin?: string
  startDelayMs?: number
  lineStaggerMs?: number
  durMs?: number
  ease?: string
  paragraphGapClassName?: string
}

type LineItem =
  | { kind: "line"; text: string }
  | { kind: "gap"; key: string }

export default function TextAnimation({
  text = "",
  className = "",
  speed = "Title",
  threshold = 0.15,
  rootMargin = "0px 0px -10% 0px",
  startDelayMs = 0,
  lineStaggerMs,
  durMs,
  ease = "cubic-bezier(.16,1,.3,1)",
  paragraphGapClassName = "h-[2svh]",
}: TextAnimationProps) {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const measureRef = useRef<HTMLDivElement | null>(null)

  const [items, setItems] = useState<LineItem[] | null>(null)
  const [reveal, setReveal] = useState(false)
  // Track when animation is fully done so we can drop will-change
  const [done, setDone] = useState(false)

  const paragraphs = useMemo(() => {
    const parts = (text ?? "")
      .split(/\n{2,}/g)
      .map((p) => p.trim())
      .filter(Boolean)
    return parts.length ? parts : [""]
  }, [text])

  const paragraphWords = useMemo(
    () => paragraphs.map((p) => (p ? p.split(/\s+/g).filter(Boolean) : [])),
    [paragraphs]
  )

  const finalDurMs = durMs ?? presets[speed].durMs
  const finalLineStaggerMs = lineStaggerMs ?? presets[speed].lineStaggerMs

  // IntersectionObserver — trigger reveal once
  useEffect(() => {
    const el = hostRef.current
    if (!el) return

    let timeoutId: number | null = null

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        if (timeoutId !== null) return
        timeoutId = window.setTimeout(() => setReveal(true), startDelayMs)
        observer.disconnect()
      },
      { threshold, rootMargin }
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
      if (timeoutId !== null) window.clearTimeout(timeoutId)
    }
  }, [threshold, rootMargin, startDelayMs])

  // Drop will-change after the longest line finishes animating
  useEffect(() => {
    if (!reveal || !items) return
    const lineCount = items.filter((it) => it.kind === "line").length
    const totalMs = startDelayMs + (lineCount - 1) * finalLineStaggerMs + finalDurMs + 100
    const id = window.setTimeout(() => setDone(true), totalMs)
    return () => window.clearTimeout(id)
  }, [reveal, items, startDelayMs, finalLineStaggerMs, finalDurMs])

  // Measure word wrapping to build lines — debounced ResizeObserver
  useLayoutEffect(() => {
    const el = measureRef.current
    if (!el) return

    const compute = () => {
      const paragraphEls = Array.from(el.querySelectorAll<HTMLDivElement>("[data-paragraph]"))
      if (!paragraphEls.length) return

      const nextItems: LineItem[] = []

      paragraphEls.forEach((pEl, pIndex) => {
        const words = paragraphWords[pIndex] ?? []
        const spans = Array.from(pEl.querySelectorAll<HTMLSpanElement>("[data-w]"))

        if (spans.length && words.length) {
          const groups: string[][] = []
          let currentTop: number | null = null

          spans.forEach((s, i) => {
            const top = s.offsetTop
            if (currentTop === null) {
              currentTop = top
              groups.push([words[i]])
              return
            }
            if (Math.abs(top - currentTop) > 1) {
              currentTop = top
              groups.push([words[i]])
            } else {
              groups[groups.length - 1].push(words[i])
            }
          })

          groups.forEach((g) => {
            const line = g.join(" ")
            if (line) nextItems.push({ kind: "line", text: line })
          })
        }

        if (pIndex < paragraphEls.length - 1) {
          nextItems.push({ kind: "gap", key: `gap-${pIndex}` })
        }
      })

      setItems(nextItems)
    }

    compute()

    // Debounce resize — avoid layout thrashing when multiple instances resize together
    let rafId: number | null = null
    const ro = new ResizeObserver(() => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        compute()
      })
    })

    ro.observe(el)
    return () => {
      ro.disconnect()
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [paragraphWords])

  let animatedLineIndex = 0

  return (
    <div ref={hostRef} style={{ position: "relative" }}>
      {/* Hidden measurement layer */}
      <div
        ref={measureRef}
        className={className}
        style={{
          position: "absolute",
          visibility: "hidden",
          pointerEvents: "none",
          width: "100%",
          left: 0,
          top: 0,
        }}
        aria-hidden="true"
      >
        {paragraphWords.map((words, pIndex) => (
          <div key={`m-p-${pIndex}`} data-paragraph style={{ display: "block" }}>
            {words.map((w, i) => (
              <span
                key={`${w}-${pIndex}-${i}`}
                data-w
                style={{
                  display: "inline-block",
                  marginRight: i === words.length - 1 ? 0 : "0.28em",
                }}
              >
                {w}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Visible animated lines */}
      <div className={className} aria-label={text}>
        {items?.map((it, i) => {
          if (it.kind === "gap") {
            return <div key={it.key} className={paragraphGapClassName} />
          }

          const delay = startDelayMs + animatedLineIndex * finalLineStaggerMs
          animatedLineIndex += 1

          return (
            <span key={`${it.text}-${i}`} style={{ display: "block", overflow: "hidden" }}>
              <span
                style={{
                  display: "inline-block",
                  // will-change only while animating — cleared once done to free compositor layers
                  willChange: done ? "auto" : "transform",
                  transform: reveal ? "translate3d(0,0,0)" : "translate3d(0,110%,0)",
                  transitionProperty: "transform",
                  transitionDuration: `${finalDurMs}ms`,
                  transitionTimingFunction: ease,
                  transitionDelay: `${delay}ms`,
                }}
              >
                {it.text}
              </span>
            </span>
          )
        }) ?? null}
      </div>
    </div>
  )
}