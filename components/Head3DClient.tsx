"use client"

import dynamic from "next/dynamic"

// Dynamic import per evitare SSR del Canvas Three.js
const Head3D = dynamic(
  () => import("./Head3D").then((mod) => mod.Head3D),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-32 h-32 rounded-full bg-white/10 animate-pulse backdrop-blur-sm" />
      </div>
    ),
  }
)

export { Head3D as Head3DClient }
export default Head3D
