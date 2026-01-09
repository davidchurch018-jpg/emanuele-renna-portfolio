"use client"

import { motion } from "framer-motion"
import { Power, Zap } from "lucide-react"
import { usePower } from "./power-context"
import { cn } from "@/lib/utils"

interface PowerToggleProps {
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  showHint?: boolean
}

export function PowerToggle({ size = "md", showLabel = true, showHint = true }: PowerToggleProps) {
  const { isOn, toggle } = usePower()

  const sizeClasses = {
    sm: "w-16 h-8",
    md: "w-24 h-12",
    lg: "w-28 h-14",
  }

  const thumbSizes = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  }

  const translateX = {
    sm: isOn ? 32 : 4,
    md: isOn ? 52 : 4,
    lg: isOn ? 60 : 4,
  }

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Toggle Container */}
      <div className="relative">
        {/* Outer Glow Ring - Only when ON */}
        {isOn && (
          <motion.div
            className="absolute -inset-3 rounded-full"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.3, 0.6, 0.3],
              boxShadow: [
                "0 0 20px rgba(43, 51, 222, 0.3), 0 0 40px rgba(43, 51, 222, 0.1)",
                "0 0 30px rgba(43, 51, 222, 0.5), 0 0 60px rgba(43, 51, 222, 0.2)",
                "0 0 20px rgba(43, 51, 222, 0.3), 0 0 40px rgba(43, 51, 222, 0.1)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        {/* Breathing hint pulse - Only when OFF */}
        {!isOn && (
          <>
            <motion.div
              className="absolute -inset-4 rounded-full border-2 border-[#2b33de]/20"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.4, 0, 0.4],
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -inset-2 rounded-full border border-[#2b33de]/10"
              animate={{
                scale: [1, 1.06, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </>
        )}

        <button
          onClick={toggle}
          className={cn(
            "relative rounded-full transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2b33de] focus-visible:ring-offset-2",
            sizeClasses[size],
            isOn
              ? "bg-gradient-to-r from-[#2b33de] to-[#4a50f0] shadow-[0_0_30px_rgba(43,51,222,0.5)]"
              : "bg-gradient-to-r from-gray-200 to-gray-100 border border-gray-300 shadow-inner",
          )}
          aria-label={isOn ? "Spegni il sito" : "Accendi il sito"}
          aria-pressed={isOn}
        >
          {/* Track highlight */}
          {isOn && (
            <motion.div
              className="absolute inset-0.5 rounded-full bg-gradient-to-b from-white/20 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* Thumb */}
          <motion.div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 rounded-full flex items-center justify-center",
              thumbSizes[size],
              isOn 
                ? "bg-white shadow-[0_4px_15px_rgba(0,0,0,0.2)]" 
                : "bg-white shadow-lg border border-gray-100",
            )}
            animate={{ x: translateX[size] }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 25,
              mass: 0.8
            }}
          >
            {/* Icon with animation */}
            <motion.div
              animate={{ 
                rotate: isOn ? 360 : 0,
                scale: isOn ? [1, 1.2, 1] : 1
              }}
              transition={{ 
                rotate: { duration: 0.5, ease: "easeOut" },
                scale: { duration: 0.3, delay: 0.2 }
              }}
            >
              {isOn ? (
                <Zap className={cn(iconSizes[size], "text-[#2b33de] fill-[#cefdb2]")} />
              ) : (
                <Power className={cn(iconSizes[size], "text-gray-400")} />
              )}
            </motion.div>
          </motion.div>

          {/* Active state inner glow */}
          {isOn && (
            <motion.div
              className="absolute inset-0 rounded-full"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: 1,
                background: [
                  "radial-gradient(circle at 70% 50%, rgba(206, 253, 178, 0.3) 0%, transparent 50%)",
                  "radial-gradient(circle at 75% 50%, rgba(206, 253, 178, 0.4) 0%, transparent 60%)",
                  "radial-gradient(circle at 70% 50%, rgba(206, 253, 178, 0.3) 0%, transparent 50%)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </button>
      </div>

      {/* Labels - Only show when ON */}
      {showLabel && isOn && (
        <motion.div
          className="flex flex-col items-center gap-1"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-sm font-semibold tracking-wide text-[#2b33de]">
            ✨ Sito acceso
          </span>
        </motion.div>
      )}

      {/* Hint arrow - Only when OFF and showHint is true */}
      {!isOn && showHint && (
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, -5, 0] }}
          transition={{ 
            opacity: { delay: 1, duration: 0.5 },
            y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            className="text-gray-400 rotate-180"
          >
            <path 
              d="M12 5L12 19M12 19L6 13M12 19L18 13" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-xs text-gray-400 mt-1">Clicca per entrare</span>
        </motion.div>
      )}
    </div>
  )
}
