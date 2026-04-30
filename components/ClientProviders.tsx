"use client"
import { useEffect, useRef } from "react"

function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })
  const raf = useRef<number>(0)

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return
    const dot = dotRef.current!
    const ringEl = ringRef.current!
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
      dot.style.transform = `translate(${e.clientX}px,${e.clientY}px) translate(-50%,-50%)`
    }
    const tick = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12
      ring.current.y += (pos.current.y - ring.current.y) * 0.12
      ringEl.style.transform = `translate(${ring.current.x}px,${ring.current.y}px) translate(-50%,-50%)`
      raf.current = requestAnimationFrame(tick)
    }
    const onEnter = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a,button,[data-hover]"))
        document.body.classList.add("cursor-hover")
    }
    const onLeave = () => document.body.classList.remove("cursor-hover")
    const onDown = () => document.body.classList.add("cursor-click")
    const onUp = () => document.body.classList.remove("cursor-click")
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseover", onEnter)
    window.addEventListener("mouseout", onLeave)
    window.addEventListener("mousedown", onDown)
    window.addEventListener("mouseup", onUp)
    raf.current = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseover", onEnter)
      window.removeEventListener("mouseout", onLeave)
      window.removeEventListener("mousedown", onDown)
      window.removeEventListener("mouseup", onUp)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden />
      <div ref={ringRef} className="cursor-ring" aria-hidden />
    </>
  )
}

function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let lenis: any
    const init = async () => {
      const LenisMod = await import("lenis")
      const Lenis = LenisMod.default
      lenis = new Lenis({ duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
      const { gsap } = await import("gsap")
      const { ScrollTrigger } = await import("gsap/ScrollTrigger")
      gsap.registerPlugin(ScrollTrigger)
      lenis.on("scroll", ScrollTrigger.update)
      gsap.ticker.add((time: number) => lenis.raf(time * 1000))
      gsap.ticker.lagSmoothing(0)
    }
    init()
    return () => { lenis?.destroy() }
  }, [])
  return <>{children}</>
}

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <LenisProvider>
      <CustomCursor />
      {children}
    </LenisProvider>
  )
}