"use client"

import Navbar from "../components/navBar"
import Footer from "../components/footer"
import Hero from "@/components/heroScreen"
import IntroSection from "@/components/introduction"
import TextAnimation from "@/components/textAnimation"
import Button from "@/components/button"

import { useEffect, useMemo, useRef, useState } from "react"

const workflowItems = [
  {
    key: "discovery",
    label: "Discovery",
    body: `Turning a vague goal into a clear digital direction.
We define what needs to be built, why it matters, and who it’s for — before any pixels or code exist.`,
  },
  {
    key: "uxui",
    label: "UX/Ui-Design",
    body: `UX and logic come first — shaping structure and flows before visual language turns them into a confident, premium interface.`,
  },
  {
    key: "frontend",
    label: "Frontend Development",
    body: `Design translated into fast, responsive, real code.
Clean front-end architecture with performance, accessibility, and scalability in mind — not just visuals.`,
  },
  {
    key: "deployment",
    label: "Deployment & Iteration",
    body: `From local build to live product.
Setup, optimization, and launch — so the site is stable, secure, and ready to grow.`,
  },
] as const

type WorkflowKey = (typeof workflowItems)[number]["key"]

const GUTTER_PCT = 4.1667
const START_W_PCT = 35.486
const END_W_PCT = 91.666
const ASPECT = 1320 / 738
const START_TOP_SVH = 12
const BOTTOM_GAP_CSS = "clamp(64px, 8vh, 128px)"
const SPEED = 1.2

const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
const gapPx = (vh: number) => clamp(0.08 * vh, 64, 128)

export default function Home() {
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowKey>("frontend")

  const activeItem = useMemo(() => {
    return workflowItems.find((i) => i.key === activeWorkflow) ?? workflowItems[2]
  }, [activeWorkflow])

  const sectionRef = useRef<HTMLElement | null>(null)
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const textWrapRef = useRef<HTMLDivElement | null>(null)
  const videoDesktopRef = useRef<HTMLVideoElement | null>(null)
  const workflowVideoDesktopRef = useRef<HTMLVideoElement | null>(null)
  const workflowVideoMobileRef = useRef<HTMLVideoElement | null>(null)

  const rafRef = useRef<number | null>(null)

  const [isMobile, setIsMobile] = useState(false)
  const [showText, setShowText] = useState(false)

  const showTextRef = useRef(false)
  useEffect(() => {
    showTextRef.current = showText
  }, [showText])

  const viewportRef = useRef({ vw: 0, vh: 0 })
  const updateViewport = () => {
    viewportRef.current.vw = window.innerWidth
    viewportRef.current.vh = window.innerHeight
  }

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    const apply = () => setIsMobile(mq.matches)
    apply()

    if (mq.addEventListener) mq.addEventListener("change", apply)
    else mq.addListener(apply)

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", apply)
      else mq.removeListener(apply)
    }
  }, [])

  useEffect(() => {
    if (isMobile) {
      if (!showTextRef.current) setShowText(true)
      return
    }

    const section = sectionRef.current
    if (!section) return
    if (showTextRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setShowText(true)
      },
      { threshold: 0.15 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [isMobile])

  useEffect(() => {
    if (isMobile) return

    const section = sectionRef.current
    const video = videoDesktopRef.current
    if (!section || !video) return

    const io = new IntersectionObserver(
      (entries) => {
        const inView = entries[0]?.isIntersecting
        if (inView) video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.05 }
    )

    io.observe(section)
    return () => io.disconnect()
  }, [isMobile])

  useEffect(() => {
    if (isMobile) return

    const section = sectionRef.current
    const wrap = wrapRef.current
    if (!section || !wrap) return

    updateViewport()

    const update = () => {
      const sectionEl = sectionRef.current
      const wrapEl = wrapRef.current
      if (!sectionEl || !wrapEl) return

      const { vh, vw } = viewportRef.current
      const rect = sectionEl.getBoundingClientRect()

      const total = Math.max(1, rect.height - vh)
      const scrolled = clamp(-rect.top, 0, total)

      let t = scrolled / (total * SPEED)
      t = Math.min(1, t)
      t = easeInOut(t)

      const w = lerp(START_W_PCT, END_W_PCT, t)

      const usable = 100 - 2 * GUTTER_PCT
      const leftStart = GUTTER_PCT + (usable - w)
      const leftEnd = GUTTER_PCT + (usable - w) / 2
      const left = lerp(leftStart, leftEnd, t)

      const startTopPx = (START_TOP_SVH / 100) * vh

      const widthPx = (w / 100) * vw
      const heightPx = widthPx / ASPECT

      const endTopPx = vh - gapPx(vh) - heightPx
      const y = (1 - t) * (startTopPx - endTopPx)

      wrapEl.style.width = `${w}%`
      wrapEl.style.left = `${left}%`
      wrapEl.style.transform = `translate3d(0, ${y}px, 0)`
      wrapEl.style.borderRadius = `${lerp(24, 32, t)}px`

      const textEl = textWrapRef.current
      if (textEl) {
        const rawT = scrolled / total

        const liftStart = 0.16
        const liftEnd = 0.3
        const liftProgress = clamp((rawT - liftStart) / (liftEnd - liftStart), 0, 1)
        const liftPx = liftProgress * -12

        const hideStart = 0.1
        const hideEnd = 0.3
        const hideProgress = clamp((rawT - hideStart) / (hideEnd - hideStart), 0, 1)

        const revealed = showTextRef.current
        const opacity = revealed ? 1 - hideProgress : 0
        const translateY = (revealed ? 0 : 14) + liftPx

        textEl.style.opacity = `${opacity}`
        textEl.style.transform = `translate3d(0, ${translateY}px, 0)`
        textEl.style.visibility = revealed ? "visible" : "hidden"
        textEl.style.pointerEvents = opacity > 0.01 ? "auto" : "none"
      }
    }

    const onScroll = () => {
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        update()
      })
    }

    const onResize = () => {
      updateViewport()
      onScroll()
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize)

    onScroll()

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [isMobile])

  useEffect(() => {
    const nodes = [
      workflowVideoDesktopRef.current,
      workflowVideoMobileRef.current,
    ].filter(Boolean) as HTMLVideoElement[]

    if (!nodes.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement
          if (entry.isIntersecting) video.play().catch(() => {})
          else video.pause()
        })
      },
      { threshold: 0.2 }
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [isMobile])

  const toggleWorkflow = (key: WorkflowKey) => {
    setActiveWorkflow((prev) => (prev === key ? prev : key))
  }

  return (
    <>
      <Navbar />
      <Hero
        pageTag="Home"
        cornerText="A digital web studio focused on designing and building clear, usable, and well-structured websites."
      />

      <main>
        <IntroSection
          buttonLink="/about"
          buttonText="Our philosophy"
          title="We design digital experiences that work across products and brands."
          kicker="Our work is built around clarity, systems, and intentional digital execution."
          p1="VACKO creates digital products by aligning UX thinking, visual systems, motion design,
          and front-end development into a single, cohesive workflow. Each project is approached as a system — designed to scale, adapt, and remain understandable as it grows."
          p2="Rather than treating motion or visuals as decoration, we use them as functional tools: to guide attention,
          explain structure, and reinforce meaning. Every decision is rooted in purpose, ensuring the final product feels coherent, usable, and technically sound across devices and contexts."
        />

        {isMobile ? (
          <section className="w-full">
            <div className="mx-auto w-[91.666%] pt-[clamp(36px,4svh,64px)]">
              <div className="w-full">
                <TextAnimation
                  text="A clear path from early ideas to motion, interaction, and final implementation."
                  className="text-[clamp(24px,4vw,36px)] leading-[1.2]"
                  durMs={760}
                  lineStaggerMs={140}
                />
              </div>

              <div className="mt-[clamp(36px,4svh,64px)] w-full overflow-hidden rounded-[clamp(10px,4vw,20px)] aspect-[1.788]">
                <video
                  className="h-full w-full object-cover"
                  src="/HomeVideo-desktop.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                />
              </div>
            </div>
          </section>
        ) : (
          <section ref={sectionRef} className="relative w-full h-[220vh]">
            <div className="sticky top-0 h-screen w-full">
              <div
                ref={textWrapRef}
                className="absolute"
                style={{
                  top: "12svh",
                  left: `${GUTTER_PCT}%`,
                  width: "34%",
                  opacity: 0,
                  visibility: "hidden",
                  transform: "translate3d(0, 14px, 0)",
                  transition: "transform 900ms linear",
                  pointerEvents: "none",
                }}
              >
                <TextAnimation
                  text="A clear path from early ideas to motion, interaction, and final implementation."
                  className="text-[clamp(24px,4vw,36px)] leading-[1.2]"
                />
              </div>

              <div
                ref={wrapRef}
                className="absolute overflow-hidden will-change-[width,left,transform]"
                style={{
                  bottom: BOTTOM_GAP_CSS,
                  left: `${GUTTER_PCT + (100 - 2 * GUTTER_PCT - START_W_PCT)}%`,
                  width: `${START_W_PCT}%`,
                  aspectRatio: `${ASPECT}`,
                  borderRadius: 24,
                  transform: "translate3d(0, 0, 0)",
                }}
              >
                <video
                  ref={videoDesktopRef}
                  className="h-full w-full object-cover"
                  src="/HomeVideo-mobile.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                />
              </div>
            </div>
          </section>
        )}

        {/* WORKFLOW SECTION */}
        <section className="w-full flex justify-center">
          <div className="w-[91.66%] py-[clamp(128px,8vw,256px)]">
            <div className="flex flex-col md:flex-row w-full md:items-start md:justify-between">
              <div className="w-full md:w-[40%] leading-[1.2] text-[clamp(36px,4vw,64px)] text-[#1A1C24]">
                <TextAnimation text="How projects take shape." />
              </div>

              <div className="mt-[clamp(24px,4vw,64px)] md:mt-0 text-[clamp(18px,4vw,24px)]">
                (Workflow)
              </div>
            </div>

            {/* MOBILE */}
            <div className="mt-[clamp(36px,4vw,64px)] md:hidden">
              <div className="w-full overflow-hidden rounded-[clamp(12px,4vw,16px)] aspect-[1.272]">
                <video
                  ref={workflowVideoMobileRef}
                  className="h-full w-full object-cover"
                  src="/moodboard-mobile.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                />
              </div>

              <div className="mt-[clamp(36px,6vw,48px)] ">
                {workflowItems.map((item, index) => {
                  const isOpen = item.key === activeWorkflow
                  const isLast = index === workflowItems.length - 1

                  return (
                    <div
                      key={item.key}
                      className={`${!isLast ? "border-b border-[#B8BBC2]" : ""}`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleWorkflow(item.key)}
                        className="flex w-full items-center justify-between gap-4 py-[clamp(24px,4vw,36px)] text-left"
                      >
                        <span className="text-[clamp(20px,4vw,24px)]  text-[#1A1C24]">
                          {item.label}
                        </span>

                        <span
                          className={`shrink-0 transition-transform duration-2000 ease-[cubic-bezier(.16,1,.3,1)] ${
                            isOpen ? "rotate-90" : "rotate-0"
                          }`}
                          aria-hidden="true"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M9 6l6 6-6 6"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </button>

                      <div
                        className={`grid transition-[grid-template-rows] duration-2000 ease-[cubic-bezier(.16,1,.3,1)] ${
                          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="pb-[clamp(24px,4vw,32px)]">
                            <p className="whitespace-pre-line text-[clamp(16px,4vw,18px)]  text-[#6E7179]">
                              {item.body}
                            </p>

                            <div className="pt-[clamp(32px,4vw,36px)] pb-[clamp(48px,4vw,64px)]">
                              <Button text="Read more" link="/workflow" size="small" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* DESKTOP */}
            <div className="hidden md:flex w-full pt-[clamp(36px,4vw,64px)] 2xl:pt-[clamp(64px,4vw,96px)] items-start gap-[clamp(64px,8vw,128px)] 2xl:gap-[15%] ">
              <div className="w-[32%]">
                <div className="w-full ">
                  {workflowItems.map((item, index) => {
                    const isOpen = item.key === activeWorkflow
                    const isLast = index === workflowItems.length - 1

                    return (
                      <div
                        key={item.key}
                        className={`w-full ${!isLast ? "border-b border-[#6E7179]" : ""}`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleWorkflow(item.key)}
                          className="flex w-full items-center justify-between text-left h-[clamp(64px,4vw,128px)] 2xl:h-[clamp(96px,4vw,192px)] gap-4"
                        >
                          <span className="text-[clamp(16px,4vw,20px)] lg:text-[clamp(18px,4vw,22px)] 2xl:text-[clamp(24px,2vw,32px)] ">
                            {item.label}
                          </span>

                          <span
                            className={`shrink-0 transition-transform duration-2000 ease-[cubic-bezier(.16,1,.3,1)] ${
                              isOpen ? "rotate-90" : "rotate-0"
                            }`}
                            aria-hidden="true"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                              <path
                                d="M9 6l6 6-6 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        </button>

                        <div
                          className={`grid transition-[grid-template-rows] duration-2000 ease-[cubic-bezier(.16,1,.3,1)] ${
                            isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <div className="pb-[clamp(24px,3.5vw,48px)]">
                              <p className="whitespace-pre-line text-[clamp(16px,4vw,20px)] 2xl:text-[clamp(20px,4vw,24px)] 2xl:w-[80%] text-[#6E7179]">
                                {item.body}
                              </p>

                              <div className="pt-[clamp(24px,4vw,36px)] pb-[clamp(36px,4vw,64px)]">
                                <Button text="Read more" link="/workflow" size="small" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex-1">
                <div className="relative w-full overflow-hidden 2xl:max-w-360  rounded-[clamp(12px,4vw,16px)] 2xl:rounded-[clamp(22px,4vw,24px)] aspect-[1.272]">
                  <video
                    ref={workflowVideoDesktopRef}
                    className="h-full w-full object-cover"
                    src="/moobboard-desktop.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}