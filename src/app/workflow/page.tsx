"use client"

import { useEffect } from "react"
import Navbar from "@/components/navBar"
import Footer from "@/components/footer"
import Hero from "@/components/heroScreen"
import IntroSection from "@/components/introduction"
import InfoBlock from "./infoBlock"

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))


const blocks = [
  {
    index: "01",
    title: "Discovery",
    paragraphOne:
      "Discovery defines the foundation of the project. It clarifies the problem space, aligns goals, and defines constraints before design or development begins. Scope and success criteria are established early to ensure clarity from the start.",
    paragraphTwo:
      "This stage frames the right questions, surfaces risks, and sets shared direction for what follows.",
    image: "/01-Discovery-desktop.mp4",
  },
  {
    index: "02",
    title: "UX Architecture",
    paragraphOne:
      "UX Architecture translates research into structure. Information hierarchy, user flows, and interaction logic are defined to create a clear and intuitive experience before visual design begins.",
    paragraphTwo:
      "Establishing structure early allows complexity to be managed without compromising usability, resulting in a system that supports both user needs and business goals.",
    image: "/02-UX-desktop.mp4",
  },
  {
    index: "03",
    title: "UI & Visual Systems",
    paragraphOne:
      "Visual design is approached as a system rather than isolated screens. Typography, layout, spacing, color, and motion principles create consistency across the product, while components are designed to scale and adapt across contexts and devices.",
    paragraphTwo:
      "Every visual decision serves a functional purpose — guiding attention, reinforcing hierarchy, and supporting usability.",
    image: "/03-Ui-desktop.mp4",
  },
  {
    index: "04",
    title: "Frontend",
    paragraphOne:
      "Front-end development translates design systems into reliable, performant interfaces. Emphasis is placed on clean architecture, responsiveness, accessibility, and maintainability across devices and browsers.",
    paragraphTwo:
      "The goal is not only visual accuracy, but preserving design intent through precise interaction, performance optimization, and technical stability.",
    image: "/04-Code-desktop.mp4",
  },
  {
    index: "05",
    title: "Deployment",
    paragraphOne:
      "Deployment marks the transition to real-world use. Final testing, optimization, and launch preparation ensure reliable performance in production.",
    paragraphTwo:
      "Once live, the system is built to support iteration, refinement, and future scalability without structural compromise.",
    image: "/05-Deploy-desktop.mp4",
  },
] as const

export default function Workflow() {

  const FADE_VH = 22

  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-sticky-item]"))
    if (!items.length) return

    let rafId: number | null = null
    let fadePx = (window.innerHeight * FADE_VH) / 100

    const computeStarts = () => {
      items.forEach((el) => {
        el.dataset.start = String(el.offsetTop)
      })
    }

    const update = () => {
      const y = window.scrollY

      items.forEach((el, idx) => {
        const isLast = idx === items.length - 1

        if (isLast) {
          el.style.setProperty("--shade", "0")
          return
        }

        const start = Number(el.dataset.start || el.offsetTop)
        const p = clamp01((y - start) / fadePx)
        el.style.setProperty("--shade", String(p))
      })
    }

    const scheduleUpdate = () => {
      if (rafId !== null) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        update()
      })
    }

    const onResize = () => {
      fadePx = (window.innerHeight * FADE_VH) / 100
      computeStarts()
      scheduleUpdate()
    }

    computeStarts()
    update()

    window.addEventListener("scroll", scheduleUpdate, { passive: true })
    window.addEventListener("resize", onResize)

    return () => {
      window.removeEventListener("scroll", scheduleUpdate)
      window.removeEventListener("resize", onResize)
      if (rafId !== null) cancelAnimationFrame(rafId)
      rafId = null
    }
  }, [])

  return (
    <>
      <Navbar />
      <Hero pageTag="Workflow" />

      <main>
        <IntroSection
          showButton={false}
          title="A structured framework guiding design, development, and execution."
          pageTag="Workflow"
          kicker="Every project follows a clear structure — refined, intentional, and scalable."
          p1="VACKO approaches each project as a system rather than a sequence of isolated tasks. The workflow is designed to create clarity early, reduce unnecessary iteration, and ensure that every decision serves a defined purpose. Structure is established first, allowing complexity to be managed without compromising flexibility."
          p2="Research, UX thinking, visual systems, motion, and front-end development are treated as interconnected parts of a single process. Rather than working linearly, the workflow adapts to the project’s needs — balancing exploration with precision, and concept with execution — while remaining consistent and transparent from start to finish."
        />

        {/* Glued stack */}
        <section
          id="workflowProcess"
          className="w-full pt-[clamp(64px,4vw,128px)] pb-[clamp(128px,4vw,256px)]"
        >
          {blocks.map((b, i) => (
            <div
              key={b.index}
              data-sticky-item
              className="sticky top-0 w-full"
              style={{
                zIndex: i + 1,
              }}
            >
              {/* "paper" surface */}
              <div className="relative w-full">
                {/* base paper background */}
                <div className="absolute inset-0 bg-[#FFFFFF]" aria-hidden="true" />

                {/* ONLY background gets darker (content unaffected) */}
                <div
                  aria-hidden="true"
                  className="
                        absolute inset-0 pointer-events-none
                        bg-[#E6E6E6]
                        opacity-[calc(var(--shade,0)*1)]
                        transition-opacity duration-2000 ease-out
                    "
                />

                {/* actual content */}
                <div className="relative">
                  <InfoBlock
                    index={b.index}
                    title={b.title}
                    paragraphOne={b.paragraphOne}
                    paragraphTwo={b.paragraphTwo}
                    image={b.image}
                  />
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </>
  )
}