"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"

const LINKS = [
  { label: "AI Team", href: "/#agents" },
  { label: "Services", href: "/#services" },
  { label: "Case Studies", href: "/#cases" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Scanner", href: "/#scanner" },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    const animate = async () => {
      const { gsap } = await import("gsap")
      const overlay = overlayRef.current
      const items = linksRef.current?.querySelectorAll("[data-nav-item]")
      if (!overlay || !items) return
      if (open) {
        gsap.fromTo(overlay, { x: "100%" }, { x: "0%", duration: 0.35, ease: "power3.out" })
        gsap.fromTo(items, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, delay: 0.15, ease: "power3.out" })
      } else {
        gsap.to(overlay, { x: "100%", duration: 0.3, ease: "power3.in" })
      }
    }
    animate()
  }, [open])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-12 py-5 transition-all duration-300 ${
          scrolled
            ? "bg-[rgba(8,9,26,0.92)] border-b border-[var(--border-green)] backdrop-blur-[16px]"
            : "bg-transparent"
        }`}
      >
        <Link href="/" className="flex items-center gap-1.5">
          <span className="font-display text-[24px] tracking-[0.1em] text-[var(--white)]">
            TRAFFIK<span style={{ color: "var(--green)" }}>BOOSTERS</span>
          </span>
          <span className="text-[10px] font-bold tracking-widest text-[var(--green)] border border-[var(--border-green)] px-1.5 py-0.5">.AI</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {LINKS.map(l => (
            <Link key={l.href} href={l.href}
              className="text-[13px] font-semibold tracking-widest uppercase text-[var(--text-dim)] hover:text-[var(--green)] transition-colors duration-200">
              {l.label}
            </Link>
          ))}
        </div>

        <Link href="/get-started"
          className="hidden md:flex items-center bg-[var(--green)] text-black text-[13px] font-bold tracking-widest uppercase px-6 py-3 hover:bg-[var(--green-dim)] transition-colors duration-200">
          Free Growth Plan
        </Link>

        <button
          className="md:hidden flex flex-col gap-[6px] p-2"
          onClick={() => setOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-px bg-white transition-all duration-300 origin-center ${open ? "rotate-45 translate-y-[7px]" : ""}`} />
          <span className={`block w-6 h-px bg-white transition-all duration-300 ${open ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-px bg-white transition-all duration-300 origin-center ${open ? "-rotate-45 -translate-y-[7px]" : ""}`} />
        </button>
      </nav>

      {/* Mobile overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-40 bg-[var(--navy)] flex flex-col justify-center px-10"
        style={{ transform: "translateX(100%)" }}
      >
        <div ref={linksRef} className="flex flex-col gap-8">
          {[...LINKS, { label: "Get Started", href: "/get-started" }].map(l => (
            <Link
              key={l.href}
              href={l.href}
              data-nav-item
              onClick={() => setOpen(false)}
              className="font-display text-[clamp(36px,8vw,56px)] tracking-widest text-[var(--white)] hover:text-[var(--green)] transition-colors"
            >
              {l.label.toUpperCase()}
            </Link>
          ))}
        </div>
        <div className="mt-16 text-[var(--text-muted)] text-sm">📞 954-637-3041</div>
      </div>
    </>
  )
}