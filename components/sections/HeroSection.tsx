"use client"
import { useEffect, useRef } from "react"
import Link from "next/link"

const LINES = [
  { text: "MORE", color: "var(--white)" },
  { text: "TRAFFIK.", color: "var(--green)" },
  { text: "MORE", color: "var(--white)" },
  { text: "SALES.", color: "var(--orange)" },
  { text: "FULLY", color: "var(--white)" },
  { text: "AUTOMATED.", color: "var(--green)" },
]

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const init = async () => {
      const { gsap } = await import("gsap")
      const lines = containerRef.current?.querySelectorAll("[data-line]")
      const fades = containerRef.current?.querySelectorAll("[data-fade]")
      if (!lines || !fades) return
      const tl = gsap.timeline({ delay: 0.1 })
      tl.fromTo(
        Array.from(lines),
        { y: "110%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 1.0, stagger: 0.08, ease: "power4.out" }
      ).fromTo(
        Array.from(fades),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" },
        "-=0.4"
      )
    }
    init()
  }, [])

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-24 pb-20 px-8 md:px-12 hero-grid"
      style={{ background: "var(--navy)" }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(0,255,135,0.07) 0%, transparent 70%)" }}
        aria-hidden
      />

      <div ref={containerRef} className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Live badge */}
        <div data-fade className="opacity-0 flex items-center gap-2 mb-8 w-fit border border-[var(--border-green)] bg-[rgba(0,255,135,0.06)] px-3 py-1.5">
          <div className="pulse-dot" />
          <span className="text-[11px] font-bold tracking-[3px] uppercase" style={{ color: "var(--green)" }}>
            AI Revenue Engine — Active
          </span>
        </div>

        {/* Headline — each line in overflow:hidden for line reveal */}
        <h1 className="mb-0" aria-label="More Traffik. More Sales. Fully Automated.">
          {LINES.map((line, i) => (
            <div key={i} style={{ overflow: "hidden", lineHeight: 1, paddingBottom: "0.06em" }}>
              <div
                data-line
                className="font-display opacity-0"
                style={{
                  fontSize: "clamp(72px, 12vw, 160px)",
                  letterSpacing: "0.02em",
                  color: line.color,
                  display: "block",
                  lineHeight: 0.93,
                }}
              >
                {line.text}
              </div>
            </div>
          ))}
        </h1>

        {/* Subheading */}
        <p
          data-fade
          className="opacity-0 mt-8 text-[18px] leading-relaxed max-w-[540px]"
          style={{ color: "var(--text-dim)" }}
        >
          AI-Powered Growth Infrastructure built for businesses ready to scale fast.
          Not a marketing agency — an <em>autonomous revenue machine.</em>
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          
            data-fade
            href="#capture"
            className="opacity-0 inline-flex items-center gap-2 text-black text-[14px] font-bold tracking-widest uppercase px-8 py-4 transition-colors"
            style={{ background: "var(--green)" }}
            onMouseOver={e => (e.currentTarget.style.background = "var(--green-dim)")}
            onMouseOut={e => (e.currentTarget.style.background = "var(--green)")}
          >
            🔥 Get More Leads Now
          </a>
          <Link
            data-fade
            href="/get-started"
            className="opacity-0 inline-flex items-center gap-2 text-[var(--white)] text-[14px] font-semibold tracking-widest uppercase px-8 py-4 border border-[rgba(255,255,255,0.2)] hover:border-[var(--green)] hover:text-[var(--green)] transition-colors"
          >
            ⚡ Get Free Growth Plan
          </Link>
        </div>

        {/* AI recommendation banner */}
        <div
          data-fade
          className="opacity-0 mt-8 inline-flex items-center gap-3 border border-[rgba(255,77,28,0.2)] bg-[rgba(255,77,28,0.06)] px-5 py-3 text-[13px]"
        >
          <span className="font-bold text-[11px] tracking-widest uppercase" style={{ color: "var(--orange)" }}>
            AI Recommendation
          </span>
          <span style={{ color: "var(--text-dim)" }}>Based on your industry, we recommend</span>
          <strong style={{ color: "var(--white)" }}>SEO + Paid Ads + AI Automation</strong>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
        <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>Scroll</span>
        <div className="w-px h-8 animate-pulse" style={{ background: "var(--border-green)" }} />
      </div>
    </section>
  )
}