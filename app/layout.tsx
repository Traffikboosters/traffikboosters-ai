import type { Metadata } from "next"
import "./globals.css"
import ClientProviders from "@/components/ClientProviders"

export const metadata: Metadata = {
  title: "Traffik Boosters — AI-Powered Growth Engine",
  description: "More Traffik. More Sales. Fully Automated. AI-Powered Growth Infrastructure for businesses ready to scale fast.",
  keywords: "AI marketing, lead generation, SEO, paid ads, business growth, Fort Lauderdale",
  openGraph: {
    title: "Traffik Boosters — AI-Powered Growth Engine",
    description: "Not a marketing agency. An autonomous revenue machine.",
    type: "website",
    url: "https://traffikboosters.ai",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}