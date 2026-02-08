"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Sparkles } from "lucide-react"
import { useRef } from "react"
import dynamic from "next/dynamic"

// Dynamic import per evitare SSR del Canvas Three.js
const Head3D = dynamic(() => import("@/components/Head3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-white/10 animate-pulse backdrop-blur-sm" />
    </div>
  ),
})

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  })

  const textY = useTransform(scrollYProgress, [0, 1], [0, 100])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const head3DScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])
  const head3DOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen flex flex-col lg:flex-row items-center justify-center px-4 py-20 lg:py-0 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Primary gradient orb */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(222, 234, 252, 0.25) 0%, transparent 60%)"
          }}
          animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Secondary accent orb */}
        <motion.div
          className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(222, 234, 252, 0.3) 0%, transparent 50%)"
          }}
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Bottom right orb */}
        <motion.div
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(222, 234, 252, 0.25) 0%, transparent 60%)"
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* ============================================ */}
      {/* LEFT SIDE: 3D HEAD */}
      {/* ============================================ */}
      <motion.div 
        className="w-full lg:w-1/2 h-[50vh] lg:h-screen flex items-center justify-center relative z-10 order-2 lg:order-1"
        style={{ scale: head3DScale, opacity: head3DOpacity }}
      >
        <div className="w-full h-full max-w-[500px] lg:max-w-none">
          <Head3D containerRef={sectionRef} />
        </div>
      </motion.div>

      {/* ============================================ */}
      {/* RIGHT SIDE: BADGE ONLY */}
      {/* ============================================ */}
      <motion.div 
        className="w-full lg:w-1/2 lg:pr-8 xl:pr-16 flex items-center justify-center lg:justify-start relative z-10 order-1 lg:order-2"
        style={{ y: textY, opacity }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-sm"
        >
          <motion.span
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            <Sparkles className="w-5 h-5 text-[#d6e8f5]" />
          </motion.span>
          <span className="text-base font-medium text-foreground">Consulente Marketing & Event Manager</span>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <motion.div 
          className="flex flex-col items-center gap-2 text-muted-foreground"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-xs uppercase tracking-wider">Scroll</span>
          <div className="w-6 h-10 rounded-full border-2 border-border flex items-start justify-center p-1">
            <motion.div
              className="w-1.5 h-1.5 bg-brand-primary rounded-full"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
