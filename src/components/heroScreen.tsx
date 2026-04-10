"use client"

import React from "react"
import TextAnimation from "./textAnimation"

type HeroProps = {
  title?: string
  pageTag: string
  cornerText?: string
}

export default function Hero({ title = "VACKO", pageTag, cornerText }: HeroProps) {
  return (
    <section className="w-full bg-white text-center pt-[10svh]">
      <div
        className="
          relative mx-auto w-[91.66%]
          min-h-[80svh] md:min-h-[70svh]
          flex flex-col
          md:pt-[20svh] lg:pt-[20svh] pt-[36svh]
          pb-[8svh]
        "
      >
        {cornerText && (
          <div className="absolute left-0 bottom-0 text-left lg:w-[38%] 2xl:w-[40%] w-full text-[clamp(24px,2vw,36px)] leading-[1.2]">
            <TextAnimation speed="Body" text={cornerText} />
          </div>
        )}

        <div className="leading-[0.9] text-[clamp(96px,28vw,512px)] 2xl:text-[clamp(256px,28vw,768px)]">
          <TextAnimation text={title} />
        </div>

        <div className="mt-[3svh] flex justify-end text-right text-[clamp(16px,6vw,36px)]">
          <TextAnimation speed="Title" text={`(${pageTag})`} />
        </div>
      </div>
    </section>
  )
}