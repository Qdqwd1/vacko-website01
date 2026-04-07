"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Navbar from "@/components/navBar"
import Footer from "@/components/footer"
import Hero from "@/components/heroScreen"
import Values from "./values"
import IntroSection from "@/components/introduction"


function clamp(n: number, a: number, b: number) {
  return Math.min(b, Math.max(a, n))
}
function clamp01(n: number) {
  return clamp(n, 0, 1)
}
function smoothstep(t: number) {
  const x = clamp01(t)
  return x * x * (3 - 2 * x)
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

const FROM = { r: 0x7f, g: 0x82, b: 0x8a }
const TO = { r: 0x33, g: 0x34, b: 0x38 }

function mixColor(t: number) {
  const tt = smoothstep(t)
  const r = Math.round(lerp(FROM.r, TO.r, tt))
  const g = Math.round(lerp(FROM.g, TO.g, tt))
  const b = Math.round(lerp(FROM.b, TO.b, tt))
  return `rgb(${r}, ${g}, ${b})`
}

const HERO_TEXT =
  "VACKO is a digital studio focused on clarity and structure. Projects are shaped through understanding goals and decision-making before design or development begins."

export default function About() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const pRef = useRef(0)
  const [p, setP] = useState(0)

  const words = useMemo(() => HERO_TEXT.split(" "), [])

  useEffect(() => {
    const update = () => {
      const el = sectionRef.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight

      const total = rect.height + vh
      const passed = vh - rect.top
      let progress = clamp01(passed / total)

      const SPEED = 1.3
      progress = clamp01(progress * SPEED)

      const EPS = 0.002
      if (Math.abs(progress - pRef.current) > EPS) {
        pRef.current = progress
        setP(progress)
      }
    }

    const onScroll = () => {
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        update()
      })
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)

    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  const WORD_WINDOW = 0.22
  const VIDEO_ASPECT = "aspect-[5/4]"

  return (
    <>
      <Navbar />
      <Hero pageTag="About" />

      <section ref={sectionRef} className="w-full flex justify-center">
        <div className="w-[91.66%] pt-[8vw] pb-[8vw]">
          <div className="w-full lg:w-[79.3%]">
            <p className="leading-[1.1] lg:text-[clamp(64px,4vw,128px)] text-[clamp(32px,4vw,48px)]">
              {words.map((w, i) => {
                const start = i / words.length
                const tWord = (p - start) / WORD_WINDOW
                const color = mixColor(tWord)

                return (
                  <span key={i} style={{ color }}>
                    {w}
                    {i < words.length - 1 ? " " : ""}
                  </span>
                )
              })}
            </p>
          </div>
        </div>
      </section>

      <Values />

      <section className="w-full">
        <div className="mx-auto w-[91.666%]  pb-[clamp(64px,8vh,128px)]">
          <div className="hidden lg:flex w-full items-stretch justify-between lg:gap-[clamp(24px,4vw,36px)]  ">
            <div className="w-[58%]">
            <div
                className={`w-full 2xl:max-w-360 mx-auto overflow-hidden rounded-[28px] bg-[#F6F7FA] ${VIDEO_ASPECT}`}
              >
                <video
                  className="w-full h-full object-cover"
                  src="/VackoWebAbout-final.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                />
              </div>
            </div>

            <div className="lg:w-[35%] md:w-[50%] pt-[10svh] h-full flex flex-col justify-center">
              <div>
                <div className="text-[clamp(48px,4vw,96px)] ">Built for clarity</div>

                <div className="mt-5">
                  <div className="text-[clamp(18px,2vw,20px)] 2xl:text-[clamp(20px,2vw,24px)] 2xl:w-[60%] w-[90%] text-[#6E7179]">
                    VACKO exists to turn complexity into clarity. By aligning strategy, design, and development into a
                    single workflow, ideas move from definition to implementation without losing intent. The goal is to
                    create systems that communicate clearly, function reliably, and remain understandable over time.
                  </div>
                </div>
              </div>
            </div>
          </div>

{/* ------------------------------- MOBILE ---------------------------------------- */}

          <div className="lg:hidden">
            <div className="flex flex-col gap-[clamp(24px,4vw,36px)]">
              <div className="text-[clamp(36px,4vw,64px)] ">Built for clarity</div>

              <div className={`w-full overflow-hidden  rounded-[clamp(14px,3vw,24px)] bg-[#F6F7FA] ${VIDEO_ASPECT}`}>
                <video
                  className="h-full w-full object-cover"
                  src="/VackoWebAbout-final.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                />
              </div>

              <div>
                <div className="text-[clamp(18px,2vw,20px)]  text-[#6E7179]">
                  VACKO exists to turn complexity into clarity. By aligning strategy, design, and development into a
                  single workflow, ideas move from definition to implementation without losing intent. The goal is to
                  create systems that communicate clearly, function reliably, and remain understandable over time.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <IntroSection
        buttonLink="/contact"
        buttonText="Tell us About Your Project"
        title="Work is built by understanding how decisions are made."
        kicker="Understanding how decisions are made defines the work."
        p1="Every project begins by examining goals, constraints, and perspective as parts of a single decision-making system. Instead of reacting to surface requests, the process focuses on how choices are formed, what influences them, and where clarity is gained or lost. By thinking from the client’s position, assumptions are replaced with structure before execution begins."
        p2="That structure guides every visual, technical, and interaction decision that follows. Design and engineering operate as one continuous process, shaped by intent rather than trends or isolated aesthetics. The result is work that feels composed rather than forced — clear in purpose, precise in execution, and built to endure."
      />

      <Footer />
    </>
  )
}