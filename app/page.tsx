"use client"

import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { PowerProvider, usePower } from "@/components/power-context"
import { OffState } from "@/components/off-state"
import { OnState } from "@/components/on-state"

function PageContent() {
  const { isOn } = usePower()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return <AnimatePresence mode="wait">{!isOn ? <OffState key="off" /> : <OnState key="on" />}</AnimatePresence>
}

export default function Home() {
  return (
    <PowerProvider>
      <PageContent />
    </PowerProvider>
  )
}
