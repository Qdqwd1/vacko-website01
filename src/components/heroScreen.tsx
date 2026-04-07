"use client"

import React, { useLayoutEffect, useState } from "react"
import TextAnimation from "./textAnimation"

type HeroProps = {
  title?: string
  pageTag: string

  // optional bottom-left text (like in your screenshot)
  cornerText?: string
}

export default function Hero({ title = "VACKO", pageTag, cornerText }: HeroProps) {
  const [taKey, setTaKey] = useState(0)

  // IMPORTANT: initialize from the global flag so first paint is correct
  const [ready, setReady] = useState(() => {
    if (typeof window === "undefined") return true
    return !window.__vackoTransitioning
  })

  useLayoutEffect(() => {
    // lock immediately on mount (before paint)
    setReady(!window.__vackoTransitioning)

    const onStart = () => setReady(false)
    const onEnd = () => {
      setReady(true)
      setTaKey((k) => k + 1) // replay after transition ends
    }

    window.addEventListener("vacko:transition-start", onStart)
    window.addEventListener("vacko:transition-end", onEnd)

    return () => {
      window.removeEventListener("vacko:transition-start", onStart)
      window.removeEventListener("vacko:transition-end", onEnd)
    }
  }, [])

  return (
    <section className="w-full bg-white text-center pt-[10svh]">
      <div
        className="
          relative
          mx-auto
          w-[91.66%]
          min-h-[80svh]
          md:min-h-[70svh]
          flex flex-col
          md:pt-[20svh] lg:pt-[20svh] pt-[36svh]
          pb-[8svh]
        "
      >
        {/* Optional bottom-left corner text */}
        {cornerText ? (
          <div
            className="
              absolute
              left-0
              bottom-0
              text-left
              lg:w-[38%] 2xl:w-[40%]
              w-full
              text-[clamp(24px,2vw,36px)] 
              leading-[1.2] 
            "
          >
            {ready ? (
              <TextAnimation key={`corner-${taKey}`} speed="Body" text={cornerText} />
            ) : (
              <span >{cornerText}</span>
            )}
          </div>
        ) : null}

        <div className="leading-[0.9] text-[clamp(96px,28vw,512px)] 2xl:text-[clamp(256px,28vw,768px)] ">
          {ready ? <TextAnimation key={`title-${taKey}`} text={title} /> : <span>{title}</span>}
        </div>

        <div className="mt-[3svh] flex justify-end text-right  text-[clamp(16px,6vw,36px)]">
          <span>
            {ready ? (
              <TextAnimation key={`tag-${taKey}`} speed="Title" text={`(${pageTag})`} />
            ) : (
              <span>{`(${pageTag})`}</span>
            )}
          </span>
        </div>
      </div>
    </section>
  )
}