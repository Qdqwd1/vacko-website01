"use client"

import { useState } from "react"
import Navbar from "@/components/navBar";
import Footer from "@/components/footer";
import Hero from "@/components/heroScreen";

type CopyFieldProps = {
  label: string
  value: string
  copyValue?: string
}

function CopyField({ label, value, copyValue }: CopyFieldProps) {
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

  const handleCopy = async () => {
    const textToCopy = copyValue ?? value

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
    <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-[#7F828A] pb-4">
      <p className="text-[24px]">{label}</p>

      <div className="relative">
        <button
          type="button"
          onClick={handleCopy}
          className="md:text-[48px] text-[20px] hover:text-[#7F828A] transition cursor-pointer select-none  text-left"
        >
          {value}
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
  )
}

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero pageTag="Contact" />

      <main className="flex justify-center py-20">
        <div className="w-[91.666%] rounded-md xl:rounded-xl overflow-hidden">
          <iframe
            className="h-175 w-full"
            src="https://form.typeform.com/to/xgTHYjO2"
            frameBorder="0"
            allow="camera; microphone; autoplay; encrypted-media;"
          />
        </div>
      </main>

      <section className="w-full flex justify-center py-20">
        <div className="w-[91.666%]">
          <p className="text-[clamp(64px,4vw,128px)] mb-[clamp(32px,2vw,64px)]">
            Contact
          </p>

          <div className="flex flex-col gap-16">
            <CopyField
              label="Work"
              value="work@vacko.studio"
            />

            <CopyField
              label="Phone"
              value="+372 5399 8887"
              copyValue="+37253998887"
            />

            <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-[#7F828A] pb-4">
              <p className="text-[24px]">Location</p>
              <p className="md:text-[48px] text-[20px]">
                Estonia, Tallinn
              </p>
            </div>

            <CopyField
              label="Business"
              value="ruslanvassiljev05@gmail.com"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}