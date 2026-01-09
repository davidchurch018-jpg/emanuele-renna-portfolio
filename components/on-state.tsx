"use client"

import { motion } from "framer-motion"
import { HeroSection } from "./sections/hero-section"
import { ChiSonoSection } from "./sections/chi-sono-section"
import { ServiziSection } from "./sections/servizi-section"
import { PreventivoBlock } from "./sections/preventivo-block"
import { PortfolioSection } from "./sections/portfolio-section"
import { TestimonianzeSection } from "./sections/testimonianze-section"
import { ContattiSection } from "./sections/contatti-section"
import { FloatingNav } from "./floating-nav"

// Staggered section animation
const sectionVariants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]
    }
  })
}

export function OnState() {
  return (
    <motion.div
      className="min-h-screen bg-[#fafafa] relative"
      initial={{ opacity: 0, filter: "blur(20px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Blue grid pattern - global */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(43, 51, 222, 1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(43, 51, 222, 1) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px"
        }}
      />

      {/* Initial light burst effect */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-50"
        initial={{ 
          background: "radial-gradient(circle at center, rgba(206, 253, 178, 0.8) 0%, transparent 50%)",
          opacity: 1 
        }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      {/* Ambient background glow */}
      <motion.div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center top, rgba(43, 51, 222, 0.05) 0%, transparent 60%)"
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      />

      <FloatingNav />
      
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: { staggerChildren: 0.15, delayChildren: 0.3 }
          }
        }}
      >
        <motion.div variants={sectionVariants} custom={0}>
          <HeroSection />
        </motion.div>
        
        <motion.div variants={sectionVariants} custom={1}>
          <ChiSonoSection />
        </motion.div>
        
        <motion.div variants={sectionVariants} custom={2}>
          <ServiziSection />
        </motion.div>
        
        <motion.div variants={sectionVariants} custom={3}>
          <PreventivoBlock />
        </motion.div>
        
        <motion.div variants={sectionVariants} custom={4}>
          <PortfolioSection />
        </motion.div>
        
        <motion.div variants={sectionVariants} custom={5}>
          <TestimonianzeSection />
        </motion.div>
        
        <motion.div variants={sectionVariants} custom={6}>
          <ContattiSection />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
