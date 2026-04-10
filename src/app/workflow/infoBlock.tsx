"use client"

import { useEffect, useRef } from "react"

type WorkflowBlockProps = {
  index: string
  title: string
  paragraphOne: string
  paragraphTwo: string
  image: string
}

export default function InfoBlock({
  index,
  title,
  paragraphOne,
  paragraphTwo,
  image,
}: WorkflowBlockProps) {
  const isVideo = image.endsWith(".mp4")
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const loadedRef = useRef(false)

  useEffect(() => {
    if (!isVideo) return

    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        if (loadedRef.current) return

        loadedRef.current = true
        video.src = image
        video.play().catch(() => {})
        observer.disconnect()
      },
      { rootMargin: "200px" }
    )

    observer.observe(video)

    return () => observer.disconnect()
  }, [image, isVideo])

  return (
    <section data-block className="w-full origin-top will-change-transform">
      <div className="w-[91.66%] mx-auto pt-[clamp(36px,4vw,64px)] pb-[clamp(64px,4vw,128px)]">
        <div className="flex justify-between items-start py-[clamp(36px,4vw,64px)]">
          <p className="text-[clamp(32px,4vw,36px)] lg:text-[clamp(48px,4vw,96px)]">
            {title}
          </p>
          <span className="text-[clamp(32px,4vw,36px)] lg:text-[clamp(48px,4vw,96px)]">
            ({index})
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 items-start">
          <div className="order-1 lg:order-2">
            <div className="relative w-full aspect-[1.539] overflow-hidden max-w-350 inset-y-0 right-0 rounded-[clamp(14px,4vw,18px)] 2xl:rounded-[clamp(22px,4vw,24px)]">
              {isVideo ? (
                <video
                  ref={videoRef}
                  muted
                  loop
                  playsInline
                  preload="none"
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <img
                  src={image}
                  alt={title}
                  loading="lazy"
                  className="w-full h-full object-cover object-center"
                />
              )}
            </div>
          </div>

          <div className="order-2 lg:order-1 space-y-6 lg:w-[80%] w-full xl:w-[50%] text-[clamp(18px,2vw,20px)] 2xl:text-[clamp(22px,4vw,28px)] text-[#6E7179] pt-[clamp(24px,4vw,36px)] pb-[clamp(64px,4vw,128px)]">
            <p>{paragraphOne}</p>
            <p>{paragraphTwo}</p>
          </div>
        </div>
      </div>
    </section>
  )
}