import React from "react"
import Button from "@/components/button"
import TextAnimation from "./textAnimation"

type IntroSectionProps = {
  pageTag?: string
  title: string
  kicker: string
  p1: string
  p2: string

 
  showButton?: boolean
  buttonText?: string
  buttonLink?: string
}

export default function IntroSection({
  pageTag = "About",
  title = "Title",
  kicker = "kicker",
  p1 = "P1",
  p2 = "p2",

  showButton = true,
  buttonText = "Button Text",
  buttonLink = "link",
}: IntroSectionProps) {
  
  const bodyText = [p1, p2].filter(Boolean).join("\n\n")

  const shouldRenderButton =
    showButton && Boolean(buttonText?.trim()) && Boolean(buttonLink?.trim())

  return (
    <section className="w-full justify-center flex pt-[clamp(128px,8vw,256px)]">
      <div className=" w-[91.66%]">
        <div className="relative pb-[clamp(64px,8vw,128px)]">
         
          <div className="relative">
            
            <div className="w-full md:w-[79.3%]">
              <div className=" leading-[1.1] lg:text-[clamp(64px,4vw,128px)] text-[clamp(36px,4vw,48px)] text-[#1A1C24] ">
                <TextAnimation text={title} />
              </div>
            </div>

            
            <div className="mt-[clamp(32px,4vw,64px)] md:mt-0 md:absolute md:right-0 md:top-0">
              <span className="text-[#1A1C24] text-[clamp(18px,2vw,24px)]">({pageTag})</span>
            </div> 
          </div>

          
          <div className="mt-[clamp(32px,4vw,64px)]" />

          
          <div className="md:mx-auto w-full md:w-[45.14%] 2xl:w-[40%]">
            <TextAnimation
              className="text-[clamp(18px,2vw,20px)] 2xl:text-[clamp(20px,2vw,24px)] text-[#1A1C24]"
              speed="Body"
              text={kicker}
            />

            <div className=" whitespace-pre-line text-[#6E7179] mt-[clamp(16px,2vw,24px)] text-[clamp(18px,2vw,20px)] 2xl:text-[clamp(20px,2vw,24px)] ">
              {bodyText}
            </div>

            
            {shouldRenderButton && (
              <div className="mt-[clamp(32px,8vw,64px)] flex md:justify-center">
                <Button
                  link={buttonLink!}
                  text={buttonText!}
                  sizeResponsive={{ base: "small",
                                    md: "small",
                                    lg: "medium", 
                                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}