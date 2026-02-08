"use client"

import { Suspense, useRef, useEffect, useState, useCallback, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useGLTF, Environment, ContactShadows } from "@react-three/drei"
import * as THREE from "three"

// ============================================================
// CONFIGURAZIONE
// ============================================================
const CONFIG = {
  model: {
    path: "/models/head.glb",
    scale: 7.5,           // Scala del modello - aumenta/diminuisci se troppo piccolo/grande
    positionY: 0.3,       // Offset verticale
  },
  rotation: {
    maxYaw: 25,           // Rotazione massima orizzontale in gradi
    maxPitch: 15,         // Rotazione massima verticale in gradi
    dampingFactor: 0.06,  // Smoothing (più basso = più smooth, ma anche più lento)
    returnSpeed: 0.015,   // Velocità ritorno a posizione neutra (più lento = più fluido)
  },
  breathing: {
    enabled: true,
    yAmplitude: 0.015,    // Ampiezza movimento Y (ridotto per subtilità)
    rotAmplitude: 0.008,  // Ampiezza rotazione (ridotto per subtilità)
    speed: 0.6,           // Velocità breathing (più lento = più naturale)
    fadeSpeed: 0.03,      // Velocità fade in/out del breathing
  },
  camera: {
    fov: 45,
    position: [0, 0, 5] as [number, number, number],
  },
}

// ============================================================
// TIPI
// ============================================================
interface HeadModelProps {
  targetRotation: React.MutableRefObject<{ x: number; y: number }>
  prefersReducedMotion: boolean
  isIdle: boolean
}

interface Head3DProps {
  className?: string
  containerRef?: React.RefObject<HTMLElement | null>
}

// ============================================================
// LOADING SKELETON
// ============================================================
function LoadingSkeleton() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-32 h-32 rounded-full bg-white/10 animate-pulse backdrop-blur-sm" />
    </div>
  )
}

// ============================================================
// HEAD MODEL COMPONENT (inside Canvas)
// ============================================================
function HeadModel({ targetRotation, prefersReducedMotion, isIdle }: HeadModelProps) {
  const { scene } = useGLTF(CONFIG.model.path)
  const groupRef = useRef<THREE.Group>(null)
  const currentRotation = useRef({ x: 0, y: 0 })
  const breathingOffset = useRef(0)
  const breathingIntensity = useRef(0) // Per fade smooth del breathing

  // Memoizza il clone della scena per evitare ricalcoli ad ogni render
  const clonedScene = useMemo(() => scene.clone(), [scene])

  useFrame((state, delta) => {
    if (!groupRef.current) return

    const { dampingFactor, returnSpeed } = CONFIG.rotation
    const { enabled, yAmplitude, rotAmplitude, speed, fadeSpeed } = CONFIG.breathing

    // Se reduced motion, mantieni posizione statica
    if (prefersReducedMotion) {
      groupRef.current.rotation.x = 0
      groupRef.current.rotation.y = 0
      groupRef.current.position.y = CONFIG.model.positionY
      return
    }

    // Target rotation (da mouse/touch/orientation)
    let targetX = targetRotation.current.x
    let targetY = targetRotation.current.y

    // Se idle, ritorna lentamente verso centro
    if (isIdle) {
      targetX = THREE.MathUtils.lerp(targetX, 0, returnSpeed)
      targetY = THREE.MathUtils.lerp(targetY, 0, returnSpeed)
      targetRotation.current.x = targetX
      targetRotation.current.y = targetY
      // Fade in del breathing
      breathingIntensity.current = THREE.MathUtils.lerp(breathingIntensity.current, 1, fadeSpeed)
    } else {
      // Fade out del breathing (smooth transition)
      breathingIntensity.current = THREE.MathUtils.lerp(breathingIntensity.current, 0, fadeSpeed)
    }

    // Lerp verso il target (smoothing) - usa delta per frame-rate independence
    const smoothFactor = 1 - Math.pow(1 - dampingFactor, delta * 60)
    currentRotation.current.x = THREE.MathUtils.lerp(
      currentRotation.current.x,
      targetX,
      smoothFactor
    )
    currentRotation.current.y = THREE.MathUtils.lerp(
      currentRotation.current.y,
      targetY,
      smoothFactor
    )

    // Applica rotazione
    groupRef.current.rotation.x = currentRotation.current.x
    groupRef.current.rotation.y = currentRotation.current.y

    // Breathing animation con fade smooth
    if (enabled) {
      breathingOffset.current += delta * speed
      const intensity = breathingIntensity.current
      const breathY = Math.sin(breathingOffset.current) * yAmplitude * intensity
      const breathRot = Math.sin(breathingOffset.current * 0.7) * rotAmplitude * intensity

      groupRef.current.position.y = CONFIG.model.positionY + breathY
      groupRef.current.rotation.z = breathRot
    } else {
      groupRef.current.position.y = CONFIG.model.positionY
      groupRef.current.rotation.z = 0
    }
  })

  return (
    <group ref={groupRef} position={[0, CONFIG.model.positionY, 0]}>
      <primitive object={clonedScene} scale={CONFIG.model.scale} />
    </group>
  )
}

// ============================================================
// SCENE SETUP (lights, environment)
// ============================================================
function SceneSetup() {
  return (
    <>
      {/* Illuminazione ottimizzata: solo 2 luci */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.2}
        castShadow={false}
      />
      
      {/* Environment per riflessi naturali */}
      <Environment preset="city" />
      
      {/* Ombra di contatto sottile */}
      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.4}
        scale={10}
        blur={2}
        far={4}
      />
    </>
  )
}

// ============================================================
// MAIN HEAD3D COMPONENT
// ============================================================
export function Head3D({ className = "", containerRef }: Head3DProps) {
  const localContainerRef = useRef<HTMLDivElement>(null)
  
  const targetRotation = useRef({ x: 0, y: 0 })
  const [isIdle, setIsIdle] = useState(true)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Helper per ottenere il container effettivo
  const getContainer = useCallback(() => {
    return containerRef?.current || localContainerRef.current
  }, [containerRef])

  // --------------------------------------------------------
  // REDUCED MOTION CHECK
  // --------------------------------------------------------
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mql.matches)
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mql.addEventListener("change", handler)
    
    return () => mql.removeEventListener("change", handler)
  }, [])

  // --------------------------------------------------------
  // CONVERT MOUSE/TOUCH TO ROTATION
  // --------------------------------------------------------
  const handlePointerInput = useCallback((clientX: number, clientY: number) => {
    const container = getContainer()
    if (prefersReducedMotion || !container) return

    const rect = container.getBoundingClientRect()
    
    // Normalizza coordinate [-1, 1] rispetto al container
    const normalizedX = ((clientX - rect.left) / rect.width) * 2 - 1
    const normalizedY = ((clientY - rect.top) / rect.height) * 2 - 1

    // Converti in radianti con limiti
    const maxYawRad = THREE.MathUtils.degToRad(CONFIG.rotation.maxYaw)
    const maxPitchRad = THREE.MathUtils.degToRad(CONFIG.rotation.maxPitch)

    targetRotation.current.y = normalizedX * maxYawRad
    targetRotation.current.x = -normalizedY * maxPitchRad // Inverted per movimento naturale

    // Reset idle
    setIsIdle(false)
    
    if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current)
    idleTimeoutRef.current = setTimeout(() => setIsIdle(true), 2000)
  }, [prefersReducedMotion, getContainer])

  // --------------------------------------------------------
  // POINTER EVENTS (mouse + touch)
  // --------------------------------------------------------
  useEffect(() => {
    if (prefersReducedMotion) return
    const container = getContainer()
    if (!container) return

    const handlePointerMove = (e: PointerEvent) => {
      handlePointerInput(e.clientX, e.clientY)
    }

    container.addEventListener("pointermove", handlePointerMove, { passive: true })
    
    return () => {
      container.removeEventListener("pointermove", handlePointerMove)
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current)
    }
  }, [handlePointerInput, prefersReducedMotion, getContainer])

  // --------------------------------------------------------
  // DEVICE ORIENTATION (mobile fallback)
  // --------------------------------------------------------
  useEffect(() => {
    if (prefersReducedMotion) return
    if (typeof window === "undefined") return
    
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (!isMobile) return

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return
      
      // gamma: -90 to 90 (tilt left/right)
      // beta: -180 to 180 (tilt forward/back)
      const maxYawRad = THREE.MathUtils.degToRad(CONFIG.rotation.maxYaw)
      const maxPitchRad = THREE.MathUtils.degToRad(CONFIG.rotation.maxPitch)

      // Normalizza e limita
      const normalizedX = THREE.MathUtils.clamp(e.gamma / 45, -1, 1)
      const normalizedY = THREE.MathUtils.clamp((e.beta - 45) / 45, -1, 1)

      targetRotation.current.y = normalizedX * maxYawRad
      targetRotation.current.x = normalizedY * maxPitchRad

      setIsIdle(false)
      
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current)
      idleTimeoutRef.current = setTimeout(() => setIsIdle(true), 2000)
    }

    // Request permission on iOS 13+
    const requestPermission = async () => {
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        // @ts-expect-error - iOS specific
        typeof DeviceOrientationEvent.requestPermission === "function"
      ) {
        try {
          // @ts-expect-error - iOS specific
          const permission = await DeviceOrientationEvent.requestPermission()
          if (permission === "granted") {
            window.addEventListener("deviceorientation", handleOrientation, { passive: true })
          }
        } catch (err) {
          console.warn("Device orientation permission denied:", err)
        }
      } else {
        // Non-iOS or older browsers
        window.addEventListener("deviceorientation", handleOrientation, { passive: true })
      }
    }

    // Auto-request or wait for user interaction
    const container = getContainer()
    if (container) {
      const handleFirstTouch = () => {
        requestPermission()
        container.removeEventListener("touchstart", handleFirstTouch)
      }
      container.addEventListener("touchstart", handleFirstTouch, { once: true, passive: true })
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation)
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current)
    }
  }, [prefersReducedMotion, getContainer])

  // --------------------------------------------------------
  // RENDER
  // --------------------------------------------------------
  return (
    <div 
      ref={localContainerRef}
      className={`relative w-full h-full ${className}`}
      style={{ touchAction: "pan-y" }}
    >
      {/* Loading skeleton */}
      {!isLoaded && <LoadingSkeleton />}

      <Canvas
        dpr={[1, 1.5]} // Limita pixel ratio per performance
        camera={{
          fov: CONFIG.camera.fov,
          position: CONFIG.camera.position,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          alpha: true,
        }}
        style={{ 
          background: "transparent",
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.5s ease-in-out"
        }}
        frameloop="always" // "always" per smoothing continuo; usa "demand" se vuoi risparmiare GPU quando idle
        onCreated={() => setIsLoaded(true)}
      >
        <Suspense fallback={null}>
          <SceneSetup />
          <HeadModel
            targetRotation={targetRotation}
            prefersReducedMotion={prefersReducedMotion}
            isIdle={isIdle}
          />
        </Suspense>
      </Canvas>

      {/* Accessibility: reduced motion indicator (hidden, for screen readers) */}
      {prefersReducedMotion && (
        <span className="sr-only">
          Animazione 3D disabilitata per rispettare le preferenze di movimento ridotto
        </span>
      )}
    </div>
  )
}

// Preload del modello
useGLTF.preload(CONFIG.model.path)

export default Head3D
