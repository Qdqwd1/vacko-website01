"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import TextAnimation from "@/components/textAnimation"

/* ----------------------- data ----------------------- */
const VALUES = [
  {
    label: "Alignment",
    body: `VACKO operates in alignment with client goals from start to finish. Decisions are evaluated based on their contribution to the intended outcome rather than personal preference, trends, or convenience. Alignment ensures that effort remains focused on what meaningfully advances the project.`,
    media: "/Alignment-02.png",
  },
  {
    label: "Understanding",
    body: `Work begins with understanding. Context, constraints, and decision-making logic are examined before execution takes place. This approach replaces assumptions with clarity and establishes a foundation on which structure and direction can be defined.`,
    media: "/Pattern-10-02.mp4",
  },
  {
    label: "Systems",
    body: `Projects are approached as integrated systems rather than isolated outputs. UX, visual design, motion, and front-end development are treated as interconnected components, designed to function cohesively. Systems thinking supports consistency, scalability, and long-term stability.`,
    media: "/Pattern-ref-02-02.png",
  },
  {
    label: "Deliberate",
    body: `Every decision is intentional. Visual, technical, and interaction choices are made with purpose and owned end-to-end. Deliberate execution prioritizes clarity and longevity over speed or excess, ensuring that what is built remains coherent as it evolves.`,
    media: "/Pattern-deliberate.png",
  },
] as const

const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

function isVideo(src: string) {
  return /\.(mp4|webm|ogg)$/i.test(src)
}

export default function SectionTwo() {
  const desktopSectionRef = useRef<HTMLElement | null>(null)
  const mediaWrapRef = useRef<HTMLDivElement | null>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  const rafRef = useRef<number | null>(null)
  const lastTRef = useRef<number>(0)

  const [openIndex, setOpenIndex] = useState(0)
  const [animKey, setAnimKey] = useState(0)

  const targetYRef = useRef(0)
  const yRef = useRef(0)
  const vRef = useRef(0)

  const active = useMemo(() => VALUES[openIndex], [openIndex])
  useEffect(() => {
    const activeItem = VALUES[openIndex]
    if (!isVideo(activeItem.media)) return
  
    const video = videoRefs.current[openIndex]
    if (!video) return
  
    video.currentTime = 0
    video.play().catch(() => {})
  }, [openIndex])

  

  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches
    if (!isDesktop) return

    const section = desktopSectionRef.current
    const mediaEl = mediaWrapRef.current
    if (!section || !mediaEl) return

    
    const STIFFNESS = 55
    const DAMPING = 18
    const MAX_V = 2200

    const tick = (t: number) => {
      const dt = clamp((t - lastTRef.current) / 1000, 0, 0.05)
      lastTRef.current = t

      const y = yRef.current
      const v = vRef.current
      const target = targetYRef.current

      const a = (target - y) * STIFFNESS - v * DAMPING

      let vNext = v + a * dt
      vNext = clamp(vNext, -MAX_V, MAX_V)

      const yNext = y + vNext * dt

      yRef.current = yNext
      vRef.current = vNext

      mediaEl.style.transform = `translate3d(0, ${Math.round(yNext)}px, 0)`
      rafRef.current = requestAnimationFrame(tick)
    }

    const onMove = (e: MouseEvent) => {
      const root = desktopSectionRef.current
      const media = mediaWrapRef.current
      if (!root || !media) return

      const titleNodes = Array.from(root.querySelectorAll<HTMLElement>("[data-title]"))
      if (titleNodes.length === 0) return

      const first = titleNodes[0].getBoundingClientRect()
      const last = titleNodes[titleNodes.length - 1].getBoundingClientRect()
      const titlesTop = first.top
      const titlesBottom = last.bottom

      const insideY = e.clientY >= titlesTop && e.clientY <= titlesBottom
      if (!insideY) return // no reset

      const bandH = Math.max(1, titlesBottom - titlesTop)
      const tt = clamp((e.clientY - titlesTop) / bandH, 0, 1)

      const mediaRect = media.getBoundingClientRect()
      const restTop = mediaRect.top - yRef.current
      const mediaH = mediaRect.height

      let minY = titlesTop - restTop
      let maxY = titlesBottom - restTop - mediaH

      if (maxY < minY) {
        const mid = (minY + maxY) * 0.5
        minY = mid
        maxY = mid
      }

      targetYRef.current = lerp(minY, maxY, tt)
    }

    lastTRef.current = performance.now()
    rafRef.current = requestAnimationFrame(tick)
    window.addEventListener("mousemove", onMove, { passive: true })

    return () => {
      window.removeEventListener("mousemove", onMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  return (
    <main>
      {/* ===================== MOBILE + MD (NO MICRO-ANIMATIONS) ===================== */}
      <div className="lg:hidden">
        <section className="w-full flex justify-center bg-white">
          <div className="w-[91.66%] py-[clamp(128px,8vw,256px)]">
            <div className="text-[clamp(18px,4vw,24px)]  py-[clamp(36px,4vw,64px)]">(Values)</div>

            <div className="pb-[clamp(32px,4vw,48px)]">
              {VALUES.map((v) => (
                <article key={v.label}>
                  <div className="text-[clamp(48px,4vw,96px)] text-[#1A1C24]">
                    {v.label}
                  </div>

                  <div className="pt-[clamp(18px,4vw,24px)] pb-[clamp(64px,4vw,128px)]">
                    <div className="relative w-full aspect-[1.5] rounded-[clamp(14px,4vw,18px)] overflow-hidden">
                      {isVideo(v.media) ? (
                        <video src={v.media} className="h-full w-full object-cover" autoPlay muted loop playsInline />
                      ) : (
                        <Image src={v.media} alt={v.label} fill className="object-cover" />
                      )}
                    </div>

                    <p className="pt-[clamp(24px,4vw,36px)] text-[clamp(18px,2vw,20px)] text-[#6E7179]">
                      {v.body}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ===================== DESKTOP ===================== */}
      <div className="hidden lg:block">
        <section ref={desktopSectionRef} className="relative w-full bg-white">
          <div className="w-full flex justify-center">
            <div className="w-[91.66%] pt-[8vw] pb-[6vw]">
              <div className="grid grid-cols-12 gap-[clamp(36px,4vw,64px)]">
                {/* LEFT */}
                <div className="col-span-6">
                  <div className="min-h-[clamp(520px,50vh,760px)] pb-[clamp(48px,6vh,96px)]">
                    <div className="text-[clamp(18px,4vw,24px)] ">(Values)</div>

                    <div className="mt-[clamp(12px,1.4vw,18px)]">
                      {VALUES.map((v, i) => {
                        const isOpen = i === openIndex

                        return (
                          <div key={v.label} className={i === 0 ? "" : "mt-[clamp(12px,1.4vw,18px)]"}>
                            <div
                              onMouseEnter={() => {
                                setOpenIndex((prev) => {
                                  if (prev !== i) setAnimKey((k) => k + 1)
                                  return i
                                })
                              }}
                              className="group w-full text-left select-none"
                            >
                              <div
                                data-title
                                className={[
                                  "cursor-pointer",
                                  "text-[clamp(48px,4vw,96px)]  leading-[1.2]",
                                  "transition-all duration-2000 ease-[cubic-bezier(.16,1,.3,1)]",
                                  isOpen ? "text-[#333438]" : "text-[#6E7179]",
                                  "group-hover:text-[#333438]",
                                ].join(" ")}
                              >
                                {v.label}
                              </div>
                            </div>

                            <div
                              className={[
                                "grid overflow-hidden",
                                "transition-[grid-template-rows] duration-2000 ease-[cubic-bezier(.16,1,.3,1)]",
                                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                              ].join(" ")}
                            >
                              <div className="overflow-hidden">
                                <div className="pt-[clamp(18px,4vw,24px)] w-[75%]">
                                  <div
                                    className={[
                                      "transition-opacity duration-2000 ease-[cubic-bezier(.16,1,.3,1)]",
                                      isOpen ? "opacity-100" : "opacity-0",
                                    ].join(" ")}
                                  >
                                    {isOpen ? (
                                      <TextAnimation
                                        key={`${animKey}-${v.label}`}
                                        text={v.body}
                                        className=" text-[clamp(18px,2vw,20px)] 2xl:text-[clamp(20px,2vw,24px)]  text-[#6E7179]"
                                        speed="Body"
                                      />
                                    ) : (
                                      <div className=" text-[#6E7179]">{v.body}</div>
                                    )}

                                    <div className="h-[clamp(48px,4vw,84px)]" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* RIGHT MEDIA */}
                <div className="col-span-6">
                  <div className="w-full flex justify-end">
                    <div
                      ref={mediaWrapRef}
                      className={[
                        "will-change-transform",
                        "overflow-hidden",
                        "rounded-[clamp(14px,2vw,20px)]",
                        "w-[75%]",
                      ].join(" ")}
                      style={{ transform: "translate3d(0,0px,0)" }}
                    >
                      <div className="relative w-full aspect-[1.65]">
                        {VALUES.map((v, i) => (
                          <div
                            key={v.label}
                            className={[
                              "absolute inset-0",
                              "transition-opacity duration-2000 ease-[cubic-bezier(.16,1,.3,1)]",
                              i === openIndex ? "opacity-100" : "opacity-0",
                            ].join(" ")}
                          >
                            {isVideo(v.media) ? (
                              <video
                                ref={(el) => {
                                  videoRefs.current[i] = el
                                }}
                                src={v.media}
                                className="h-full w-full object-cover"
                                muted
                                loop
                                playsInline
                                preload="auto"
                              />
                            ) : (
                              <Image
                                key={v.media}
                                src={v.media}
                                alt={v.label}
                                fill
                                className="object-cover"
                                priority={i === openIndex}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                {/* /RIGHT */}
              </div>

              <div aria-hidden className="h-[clamp(64px,4vh,128px)]" />
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}