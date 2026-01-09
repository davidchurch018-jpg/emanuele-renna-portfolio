"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Play, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRef } from "react"

export function HeroSection() {
  const sectionRef = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  })

  const textY = useTransform(scrollYProgress, [0, 1], [0, 100])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const scrollToSection = (id: string) => {
    const element = document.querySelector(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Primary gradient orb */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(43, 51, 222, 0.06) 0%, transparent 60%)"
          }}
          animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Secondary accent orb */}
        <motion.div
          className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(206, 253, 178, 0.15) 0%, transparent 50%)"
          }}
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Bottom right orb */}
        <motion.div
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(43, 51, 222, 0.08) 0%, transparent 60%)"
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div 
        className="max-w-5xl mx-auto text-center space-y-10 relative z-10"
        style={{ y: textY, opacity }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm"
        >
          <motion.span
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            <Sparkles className="w-4 h-4 text-brand-primary" />
          </motion.span>
          <span className="text-sm font-medium text-gray-700">Consulente Marketing & Event Manager</span>
        </motion.div>

        {/* Main headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-4"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-foreground text-balance leading-[1.1]">
            pronto ad accendere{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#2b33de]">il tuo business</span>
              <motion.span
                className="absolute bottom-2 md:bottom-4 left-0 w-full h-3 md:h-5 bg-brand-secondary/50 -z-0"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{ originX: 0 }}
              />
            </span>
            ?
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p 
          className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Strategie di marketing, produzione eventi e gestione social che trasformano 
          la tua visione in <strong className="text-foreground">risultati concreti</strong> e misurabili.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="lg"
              className="bg-[#2b33de] hover:bg-[#2b33de]/90 text-white px-8 py-7 text-lg rounded-full shadow-xl shadow-[#2b33de]/25 hover:shadow-2xl hover:shadow-[#2b33de]/30 transition-all duration-300"
              onClick={() => scrollToSection("#preventivo")}
            >
              Richiedi preventivo
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-7 text-lg rounded-full border-2 border-gray-200 hover:bg-[#cefdb2]/20 hover:border-[#2b33de]/30 bg-white/50 backdrop-blur-sm transition-all duration-300"
              onClick={() => scrollToSection("#portfolio")}
            >
              <Play className="mr-2 w-5 h-5 fill-current" />
              Guarda i lavori
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator - positioned outside the parallax container */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <motion.div 
          className="flex flex-col items-center gap-2 text-gray-400"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-xs uppercase tracking-wider">Scroll</span>
          <div className="w-6 h-10 rounded-full border-2 border-gray-300 flex items-start justify-center p-1">
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
