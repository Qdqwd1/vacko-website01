"use client"

import { Link } from "next-view-transitions"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState, useCallback } from "react"
import Image from "next/image"
import Button from "@/components/button"
import TextAnimation from "./textAnimation"

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Workflow", href: "/workflow" },
  { label: "Contact", href: "/contact" },
]

const socialItems = [
  { label: "LinkedIn", href: "https://linkedin.com", icon: "/LinkeInIcon.svg" },
  {
    label: "Instagram",
    href: "https://www.instagram.com/vackostudio?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    icon: "/InstragramIcon.svg",
  },
  { label: "Behance", href: "https://behance.net", icon: "/BehanceIcon.svg" },
]

export default function Navbar() {
  const pathname = usePathname()

  const [menuOpen, setMenuOpen] = useState(false)
  const [menuMounted, setMenuMounted] = useState(false)

  const closeTimeoutRef = useRef<number | null>(null)

  const openMenu = useCallback(() => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setMenuMounted(true)
    requestAnimationFrame(() => setMenuOpen(true))
  }, [])

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    if (closeTimeoutRef.current !== null) window.clearTimeout(closeTimeoutRef.current)
    closeTimeoutRef.current = window.setTimeout(() => {
      setMenuMounted(false)
      closeTimeoutRef.current = null
    }, 450)
  }, [])

  // Close menu on route change — no custom events needed
  useEffect(() => {
    closeMenu()
  }, [pathname, closeMenu])

  useEffect(() => {
    document.body.style.overflow = menuMounted ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuMounted])

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current !== null) window.clearTimeout(closeTimeoutRef.current)
    }
  }, [])

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-80">
        <div className="flex items-center px-[4.1667%] h-[clamp(72px,8.333vw,120px)]">
          <Link href="/" className="text-[clamp(24px,4vw,36px)] leading-none">
            <TextAnimation key={`logo-${pathname}`} text="VACKO" />
          </Link>

          {/* DESKTOP */}
          <div className="ml-auto hidden md:flex items-baseline">
            <nav className="group">
              <ul className="flex items-baseline gap-[1.5vw]">
                {navItems.map((item) => (
                  <li key={item.href} className="leading-none">
                    <Link
                      href={item.href}
                      className="group/navlink transition-colors duration-200 group-hover:text-[#7F828A] hover:text-[#333438] text-[clamp(18px,2vw,20px)] inline-flex items-baseline"
                    >
                      <span className="relative overflow-hidden block leading-none">
                        <span className="block transition-transform duration-300 ease-out group-hover/navlink:-translate-y-full">
                          {item.label}
                        </span>
                        <span className="absolute left-0 top-0 block translate-y-full transition-transform duration-300 ease-out group-hover/navlink:translate-y-0">
                          {item.label}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="ml-[3.333vw] self-baseline">
              <Button text="Start the Project" link="/contact" size="small" />
            </div>
          </div>

          {/* MOBILE TOGGLE */}
          <button
            type="button"
            onClick={menuOpen ? closeMenu : openMenu}
            className="ml-auto md:hidden relative z-60 text-[clamp(20px,2vw,24px)]"
          >
            <span className="relative overflow-hidden block">
              <span className={`block transition-transform duration-300 ease-out ${menuOpen ? "-translate-y-full" : "translate-y-0"}`}>
                Menu
              </span>
              <span className={`absolute left-0 top-0 block transition-transform duration-300 ease-out ${menuOpen ? "translate-y-0" : "translate-y-full"}`}>
                Close
              </span>
            </span>
          </button>
        </div>

        {/* MOBILE MENU */}
        {menuMounted && (
          <div
            className={`fixed bg-white inset-0 z-50 md:hidden transition-opacity duration-450 ease-out ${menuOpen ? "opacity-100" : "opacity-0"}`}
          >
            <div className="flex items-center px-[4.1667%] h-[clamp(72px,8.333vw,120px)]">
              <Link href="/" className="text-[clamp(24px,4vw,36px)] leading-none">
                VACKO
              </Link>
            </div>

            <nav className="h-[calc(100vh-120px)] px-[4.1667%]">
              <div className="h-full flex items-center justify-center">
                <div className="w-full flex flex-col items-center">
                  <ul className="w-full flex flex-col items-start gap-6">
                    {navItems.map((item, i) => {
                      const isActive = pathname === item.href
                      return (
                        <li key={item.href} className="w-full">
                          <span className="block overflow-hidden leading-none text-[clamp(48px,4vw,96px)]">
                            <Link
                              href={item.href}
                              className={`block tracking-tight text-left transition-transform duration-650 ease-out ${menuOpen ? "translate-y-0" : "translate-y-full"} ${isActive ? "text-[#333438]" : "text-[#7F828A]"}`}
                              style={{ transitionDelay: `${menuOpen ? 120 + i * 70 : 0}ms` }}
                            >
                              {item.label.toUpperCase()}
                            </Link>
                          </span>
                        </li>
                      )
                    })}
                  </ul>

                  <div
                    className={`flex items-center gap-5 self-start pt-[clamp(64px,4vh,128px)] transition-all duration-600 ease-out ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                    style={{ transitionDelay: `${menuOpen ? 120 + navItems.length * 70 + 80 : 0}ms` }}
                  >
                    {socialItems.map((s) => (
                      <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="inline-flex">
                        <Image src={s.icon} alt={s.label} width={28} height={28} className="h-7 w-7" />
                      </a>
                    ))}
                  </div>

                  <div className="h-6" />

                  <div
                    className={`self-start transition-all duration-600 ease-out ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                    style={{ transitionDelay: `${menuOpen ? 120 + navItems.length * 70 + 160 : 0}ms` }}
                  >
                    <Button text="Start the Project" link="/contact" size="medium" />
                  </div>
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}