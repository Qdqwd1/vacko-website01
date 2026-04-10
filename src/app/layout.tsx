import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import localFont from "next/font/local"
import "./globals.css"
import { ViewTransitions } from "next-view-transitions"
import SmoothScroll from "@/components/smoothScroll"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

const neueMontreal = localFont({
  src: [
    {
      path: "../../public/fonts/PPNeueMontreal-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-neue-montreal",
  display: "swap",
})

export const metadata: Metadata = {
  title: "vacko",
  description: "Digital experience",
  icons: {
    icon: "/favicon.png",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransitions>
      <html lang="en">
        <body
          className={`${neueMontreal.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <SmoothScroll>{children}</SmoothScroll>
        </body>
      </html>
    </ViewTransitions>
  )
}