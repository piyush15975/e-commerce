import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import Navbar from "@/components/Navbar"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "ShopHub - Modern E-commerce",
  description: "Discover amazing products at great prices",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <Navbar />
          <main className="min-h-screen bg-background">
            <div className="container py-8">{children}</div>
          </main>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
