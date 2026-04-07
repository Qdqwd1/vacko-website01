"use client"

import { useState } from "react"
import { Link } from "next-view-transitions"
import TextAnimation from "./textAnimation"

const sitemap = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Workflow", href: "/workflow" },
  { label: "Contact", href: "/contact" },
]

const social = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/vackostudio?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
  },
  { label: "Behance", href: "https://behance.net" },
  { label: "LinkedIn", href: "https://linkedin.com" },
]

export default function Footer() {
  const [copied, setCopied] = useState(false)

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea")
    textArea.value = text
    textArea.style.position = "fixed"
    textArea.style.top = "0"
    textArea.style.left = "0"
    textArea.style.width = "2px"
    textArea.style.height = "2px"
    textArea.style.padding = "0"
    textArea.style.border = "none"
    textArea.style.outline = "none"
    textArea.style.boxShadow = "none"
    textArea.style.background = "transparent"

    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    textArea.setSelectionRange(0, 99999)

    try {
      document.execCommand("copy")
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error("Fallback copy failed:", err)
    }

    document.body.removeChild(textArea)
  }

  const handleCopyEmail = async () => {
    const textToCopy = "work@vacko.studio"

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      } else {
        fallbackCopyTextToClipboard(textToCopy)
      }
    } catch (err) {
      fallbackCopyTextToClipboard(textToCopy)
    }
  }

  return (
    <footer className="w-full ">
    
      <div className="px-[8%] md:px-[2.7778%] md:pr-[4.4444%]">
        <div className="h-px w-full bg-[#333438]/30" />
      </div>

     
      <div className="px-[8%] md:px-[2.7778%] md:pr-[4.4444%]">
     
        <div
          className="pt-[clamp(32px,4.5vw,64px)] flex flex-col md:flex-row md:items-start 
                        md:justify-between gap-[8svh]  md:gap-0"
        >

          <div className="flex flex-col">
            <div className="text-[#1A1C24] text-[clamp(32px,4vw,48px)]">
              <TextAnimation speed="Title" text="Let's talk," />
            </div>

            <div className="relative w-fit">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-block underline underline-offset-[0.25em] text-[clamp(24px,4vw,36px)] hover:text-[#7F828A] transition cursor-pointer select-none  text-left"
              >
                work@vacko.studio
              </button>

              <span
                className={`absolute right-0 -top-10 md:text-[18px] text-[14px] text-white rounded-md bg-black md:px-3 md:py-2 px-2 py-1 
                  transform origin-bottom-right transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
                  ${
                    copied
                      ? "opacity-100 scale-100 translate-y-0"
                      : "opacity-0 scale-0 translate-y-2 pointer-events-none"
                  }`}
              >
                Copied!
              </span>
            </div>
          </div>

         
          <div className="flex items-start pr-[9%] gap-[clamp(64px,8.89vw,128px)]">
        
            <div>
              <div className="lg:text-[clamp(24px,4vw,32px)] text-[clamp(32px,4vw,36px)]">
                Sitemap
              </div>

              <ul className="mt-4 space-y-5">
                {sitemap.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="relative block overflow-hidden leading-none group 
                              lg:text-[clamp(20px,4vw,24px)] text-[clamp(24px,4vw,32px)]"
                    >
                      <span
                        className="block  text-[#7F828A]  transition-transform duration-500 
                                    ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-full"
                      >
                        {item.label}
                      </span>

                      <span
                        className="absolute left-0 top-0 block  translate-y-full 
                                    transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] 
                                    group-hover:translate-y-0"
                      >
                        {item.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          
            <div>
              <div className="lg:text-[clamp(24px,4vw,32px)] text-[clamp(32px,4vw,36px)]">
                Social
              </div>

              <ul className="mt-4 space-y-5">
                {social.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="relative block overflow-hidden leading-none group 
                              lg:text-[clamp(20px,4vw,24px)] text-[clamp(24px,4vw,32px)]"
                    >
                      <span
                        className="block  text-[#7F828A] transition-transform duration-500
                                      ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-full"
                      >
                        {item.label}
                      </span>

                      <span
                        className="absolute left-0 top-0 block   translate-y-full 
                                      transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] 
                                      group-hover:translate-y-0"
                      >
                        {item.label}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

       
        <div className="mt-[clamp(96px,8.9vw,128px)] flex flex-col md:flex-row md:items-end md:justify-between gap-5">
 
          <div className=" text-center text-[clamp(12px,4vw,16px)]">
            © Copyright 2025 | Design & Developed by <b>VACKO</b>
          </div>

         
          <div
            className="
    w-full
    font-medium
    leading-none
    tracking-[-0.02em]
    text-center md:text-right lg:text-right
    text-[clamp(64px,22vw,256px)]
  "
          >
            <TextAnimation speed="Title" text="VACKO" />
          </div>
        </div>

        <div className="h-[clamp(24px,4vw,48px)]" />
      </div>
    </footer>
  )
}