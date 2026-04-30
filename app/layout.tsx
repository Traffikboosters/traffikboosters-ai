import type { Metadata } from "next"
import "./globals.css"
export const metadata: Metadata = {
  title: "Traffik Boosters — AI-Powered Growth Engine",
  description: "More Traffik. More Sales. Fully Automated. AI-Powered Growth Infrastructure for businesses ready to scale fast.",
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}