"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Briefcase, MessageSquare, Phone, FolderOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePower } from "./power-context"

interface MenuItem {
  id: string
  label: string
  icon: React.ReactNode
  href: string
}

const menuItems: MenuItem[] = [
  { id: "chi-sono", label: "chi sono", icon: <User className="w-4 h-4" />, href: "#chi-sono" },
  { id: "portfolio", label: "portfolio", icon: <FolderOpen className="w-4 h-4" />, href: "#portfolio" },
  { id: "servizi", label: "servizi", icon: <Briefcase className="w-4 h-4" />, href: "#servizi" },
  { id: "testimonianze", label: "dicono di me", icon: <MessageSquare className="w-4 h-4" />, href: "#testimonianze" },
  { id: "contatti", label: "contatti", icon: <Phone className="w-4 h-4" />, href: "#contatti" },
]

interface GlowMenuProps {
  disabled?: boolean
}

export function GlowMenu({ disabled = false }: GlowMenuProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const { isOn } = usePower()

  const handleClick = (e: React.MouseEvent, href: string) => {
    if (disabled || !isOn) {
      e.preventDefault()
      return
    }

    e.preventDefault()
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <nav
      className={cn(
        "inline-flex items-center gap-1 px-3 py-2.5 rounded-full border transition-all duration-500",
        isOn
          ? "bg-white/90 backdrop-blur-xl border-gray-200/80 shadow-lg shadow-black/5"
          : "bg-white/40 backdrop-blur-sm border-gray-200/30",
      )}
      aria-label="Menu principale"
    >
      {menuItems.map((item) => (
        <a
          key={item.id}
          href={item.href}
          onClick={(e) => handleClick(e, item.href)}
          onMouseEnter={() => !disabled && setHoveredItem(item.id)}
          onMouseLeave={() => setHoveredItem(null)}
          className={cn(
            "relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
            disabled || !isOn 
              ? "cursor-not-allowed text-gray-400" 
              : "cursor-pointer",
            hoveredItem === item.id && isOn 
              ? "text-[#2b33de]" 
              : isOn 
                ? "text-gray-700 hover:text-gray-900" 
                : "text-gray-400",
          )}
          aria-disabled={disabled || !isOn}
        >
          {/* Hover glow effect */}
          <AnimatePresence>
            {hoveredItem === item.id && isOn && (
              <motion.div
                layoutId="menu-glow"
                className="absolute inset-0 rounded-full"
                style={{
                  background: "linear-gradient(135deg, rgba(206, 253, 178, 0.4) 0%, rgba(206, 253, 178, 0.2) 100%)"
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </AnimatePresence>
          
          {/* Icon */}
          <motion.span 
            className="relative z-10 hidden sm:inline-flex"
            animate={{ 
              scale: hoveredItem === item.id && isOn ? 1.1 : 1,
              color: hoveredItem === item.id && isOn ? "#2b33de" : undefined
            }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            {item.icon}
          </motion.span>
          
          {/* Label */}
          <span className="relative z-10">{item.label}</span>

          {/* Active indicator dot */}
          {hoveredItem === item.id && isOn && (
            <motion.div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#2b33de] rounded-full"
              layoutId="active-dot"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            />
          )}
        </a>
      ))}

      {/* Disabled state overlay pulse */}
      {(!isOn || disabled) && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          animate={{ 
            boxShadow: [
              "inset 0 0 0 1px rgba(43, 51, 222, 0.05)",
              "inset 0 0 0 1px rgba(43, 51, 222, 0.1)",
              "inset 0 0 0 1px rgba(43, 51, 222, 0.05)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </nav>
  )
}
