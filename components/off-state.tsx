"use client"

import { motion } from "framer-motion"
import { PowerToggle } from "./power-toggle"
import { useEffect } from "react"
import { usePower } from "./power-context"

export function OffState() {
  const { toggle } = usePower()

  useEffect(() => {
    let lastScroll = 0
    const handleScroll = (e: WheelEvent) => {
      // Toggle if scrolling down with enough force
      if (e.deltaY > 20) {
        toggle()
      }
    }
    
    // Also handle touch swipe
    const handleTouchStart = (e: TouchEvent) => {
      lastScroll = e.touches[0].clientY
    }
    
    const handleTouchMove = (e: TouchEvent) => {
      if (lastScroll - e.touches[0].clientY > 50) {
        toggle()
      }
    }

    // Add delay to prevent immediate toggle on page load
    const timer = setTimeout(() => {
      window.addEventListener("wheel", handleScroll)
      window.addEventListener("touchstart", handleTouchStart)
      window.addEventListener("touchmove", handleTouchMove)
    }, 1000)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("wheel", handleScroll)
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchmove", handleTouchMove)
    }
  }, [toggle])

  return (
    <motion.div
      className="min-h-screen bg-[#0a0a0a] flex flex-col relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98, filter: "blur(20px)" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Subtle ambient background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft radial gradient */}
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(187, 224, 83, 0.08) 0%, transparent 60%)"
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Secondary breathing orb */}
        <motion.div 
          className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(222, 234, 252, 0.15) 0%, transparent 50%)"
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(187, 224, 83, 1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(187, 224, 83, 1) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px"
          }}
        />
      </div>

      {/* Main Content - Centered vertically */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <motion.div
          className="text-center max-w-3xl mx-auto"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Name Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/10 backdrop-blur-sm border border-brand-primary/20 shadow-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
            <span className="text-sm font-medium tracking-wide text-brand-primary">Emanuele Renna</span>
          </motion.div>
          
          {/* Main Headline */}
          <motion.h1 
            className="font-condensed text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight text-balance leading-[1] mb-12 uppercase"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <span className="text-brand-primary">Se sei arrivato fin qui, </span>
            <span className="text-brand-primary">forse è il momento di </span>
            <span className="relative inline-block">
              <span className="text-brand-primary font-medium">accendere</span>
              <motion.span
                className="absolute bottom-1 md:bottom-2 left-0 w-full h-2 md:h-3 bg-brand-secondary/40 -z-0"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{ originX: 0 }}
              />
            </span>
            <span className="text-brand-primary"> qualcosa</span>
          </motion.h1>

          {/* Power Toggle - Main Focus */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <PowerToggle size="lg" showHint={true} />
          </motion.div>

          {/* Subtle tagline */}
          <motion.p
            className="text-sm text-brand-primary/70 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Consulente Marketing • Event Manager • Social Media Strategist
          </motion.p>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer
        className="px-6 py-6 flex items-center justify-between text-xs text-brand-primary/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className="tracking-wider">© 2026 Emanuele Renna</span>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">Milano, Italia</span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary/60" />
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary/20" />
          </div>
        </div>
      </motion.footer>
    </motion.div>
  )
}