import { Geist_Mono, Public_Sans, DM_Sans } from "next/font/google"

import "./globals.css"

import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"

import { Providers } from "./providers"

const dmSansHeading = DM_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
})

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        publicSans.variable,
        dmSansHeading.variable
      )}
    >
      <body>
        <Providers>
          <Toaster position="top-center" richColors />
          {children}
        </Providers>
      </body>
    </html>
  )
}
