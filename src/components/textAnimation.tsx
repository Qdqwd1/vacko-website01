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

  // Preset (optional)
  speed?: SpeedPreset

  // When to trigger
  threshold?: number
  rootMargin?: string
  startDelayMs?: number

  // Motion (optional overrides; if omitted, preset/defaults are used)
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

  // ✅ keep paragraphs (split on blank lines)
  const paragraphs = useMemo(() => {
    const parts = (text ?? "")
      .split(/\n{2,}/g)
      .map((p) => p.trim())
      .filter(Boolean)

    // if empty text, keep one empty paragraph so layout doesn't explode
    return parts.length ? parts : [""]
  }, [text])

  const paragraphWords = useMemo(() => {
    return paragraphs.map((p) => (p ? p.split(/\s+/g).filter(Boolean) : []))
  }, [paragraphs])

  const finalDurMs = durMs ?? presets[speed].durMs
  const finalLineStaggerMs = lineStaggerMs ?? presets[speed].lineStaggerMs

  useEffect(() => {
    const el = hostRef.current
    if (!el) return

    let timeoutId: number | null = null

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        if (timeoutId !== null) return

        timeoutId = window.setTimeout(() => {
          setReveal(true)
        }, startDelayMs)

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

  // measure real wrapping -> build lines (per paragraph)
  useLayoutEffect(() => {
    const el = measureRef.current
    if (!el) return

    const compute = () => {
      const paragraphEls = Array.from(
        el.querySelectorAll<HTMLDivElement>("[data-paragraph]")
      )
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

        // ✅ insert gap between paragraphs (not after last)
        if (pIndex < paragraphEls.length - 1) {
          nextItems.push({ kind: "gap", key: `gap-${pIndex}` })
        }
      })

      setItems(nextItems)
    }

    compute()

    const ro = new ResizeObserver(() => compute())
    ro.observe(el)
    return () => ro.disconnect()
  }, [paragraphWords])

  // used for aria + screen readers (original text)
  const ariaText = text

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

      {/* Visible animated lines + gaps */}
      <div className={className} aria-label={ariaText}>
        {items?.map((it, i) => {
          if (it.kind === "gap") {
            return <div key={it.key} className={paragraphGapClassName} />
          }

          const delay = startDelayMs + animatedLineIndex * finalLineStaggerMs
          animatedLineIndex += 1

          return (
            <span
              key={`${it.text}-${i}`}
              style={{ display: "block", overflow: "hidden" }}
            >
              <span
                style={{
                  display: "inline-block",
                  willChange: "transform",
                  transform: reveal
                    ? "translate3d(0,0,0)"
                    : "translate3d(0,110%,0)",
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