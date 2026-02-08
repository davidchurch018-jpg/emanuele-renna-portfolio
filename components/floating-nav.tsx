"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { GlowMenu } from "./glow-menu"
import { cn } from "@/lib/utils"

export function FloatingNav() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Check initial state
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.div
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-50",
      )}
      initial={{ y: -100, opacity: 0 }}
      animate={{ 
        y: 0, 
        opacity: 1 
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Menu container with enhanced styling when scrolled */}
      <motion.div
        className={cn(
          "relative rounded-full transition-all duration-500",
          isScrolled && "shadow-xl shadow-black/10"
        )}
        animate={{
          scale: isScrolled ? 0.95 : 1,
        }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <GlowMenu />
      </motion.div>
    </motion.div>
  )
}
