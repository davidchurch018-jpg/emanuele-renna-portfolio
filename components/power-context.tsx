"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface PowerContextType {
  isOn: boolean
  toggle: () => void
}

const PowerContext = createContext<PowerContextType | undefined>(undefined)

export function PowerProvider({ children }: { children: ReactNode }) {
  const [isOn, setIsOn] = useState(false)

  // Site always starts in OFF state - no localStorage persistence
  // This ensures users always see the "accendi" experience first

  const toggle = () => setIsOn((prev) => !prev)

  return <PowerContext.Provider value={{ isOn, toggle }}>{children}</PowerContext.Provider>
}

export function usePower() {
  const context = useContext(PowerContext)
  if (!context) {
    throw new Error("usePower must be used within a PowerProvider")
  }
  return context
}
