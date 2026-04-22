"use client"

import { Suspense, useRef, useEffect, useState, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useGLTF, Environment } from "@react-three/drei"
import * as THREE from "three"

// ============================================================
// CONFIGURAZIONE
// ============================================================
const CONFIG = {
  model: {
    path: "/models/head.glb",
    scale: 7.5,           // Scala del modello - aumenta/diminuisci se troppo piccolo/grande
    positionY: -0.10,     // Offset verticale per centrare il volto nel cerchio
  },
  rotation: {
    maxYaw: 25,
    maxPitch: 15,
    dampingFactor: 0.06,
    returnSpeed: 0.015,
    // Fixed 3/4 view rotation (in degrees)
    fixedYaw: 20,
    fixedPitch: -5,
  },
  breathing: {
    enabled: true,
    yAmplitude: 0.012,    // Ampiezza movimento Y (molto subtile)
    rotAmplitude: 0.006,  // Ampiezza rotazione (molto subtile)
    speed: 0.5,           // Velocità breathing (lento = naturale)
  },
  // Micro-oscillazione autonoma attorno alla posa 3/4
  idle: {
    yawAmplitude: 0.035,  // Oscillazione orizzontale (radianti) ~2°
    pitchAmplitude: 0.02, // Oscillazione verticale (radianti) ~1°
    yawSpeed: 0.3,        // Velocità oscillazione yaw
    pitchSpeed: 0.2,      // Velocità oscillazione pitch (diversa per naturalezza)
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
  prefersReducedMotion: boolean
}

interface Head3DProps {
  className?: string
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
function HeadModel({ prefersReducedMotion }: HeadModelProps) {
  const { scene } = useGLTF(CONFIG.model.path)
  const groupRef = useRef<THREE.Group>(null)
  const currentRotation = useRef({ x: 0, y: 0 })
  const timeRef = useRef(0)

  // Memoizza il clone della scena e riduci lucidità materiali
  const clonedScene = useMemo(() => {
    const clone = scene.clone()
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        if (mesh.material && (mesh.material as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
          const mat = (mesh.material as THREE.MeshStandardMaterial).clone()
          mat.roughness = Math.max(mat.roughness, 0.7)
          mat.metalness = Math.min(mat.metalness, 0.05)
          mat.envMapIntensity = 0.3
          mesh.material = mat
        }
      }
    })
    return clone
  }, [scene])

  useFrame((_, delta) => {
    if (!groupRef.current) return

    const { enabled, yAmplitude, rotAmplitude, speed } = CONFIG.breathing
    const { yawAmplitude, pitchAmplitude, yawSpeed, pitchSpeed } = CONFIG.idle

    // Se reduced motion, mantieni posizione statica
    if (prefersReducedMotion) {
      groupRef.current.rotation.x = THREE.MathUtils.degToRad(CONFIG.rotation.fixedPitch)
      groupRef.current.rotation.y = THREE.MathUtils.degToRad(CONFIG.rotation.fixedYaw)
      groupRef.current.position.y = CONFIG.model.positionY
      return
    }

    timeRef.current += delta

    // Posa base 3/4
    const baseYaw = THREE.MathUtils.degToRad(CONFIG.rotation.fixedYaw)
    const basePitch = THREE.MathUtils.degToRad(CONFIG.rotation.fixedPitch)

    // Micro-oscillazione autonoma (sin con velocità diverse per look organico)
    const idleYaw = Math.sin(timeRef.current * yawSpeed) * yawAmplitude
    const idlePitch = Math.sin(timeRef.current * pitchSpeed + 1.5) * pitchAmplitude

    const targetY = baseYaw + idleYaw
    const targetX = basePitch + idlePitch

    // Smooth lerp
    const smoothFactor = 1 - Math.pow(1 - CONFIG.rotation.dampingFactor, delta * 60)
    currentRotation.current.x = THREE.MathUtils.lerp(currentRotation.current.x, targetX, smoothFactor)
    currentRotation.current.y = THREE.MathUtils.lerp(currentRotation.current.y, targetY, smoothFactor)

    groupRef.current.rotation.x = currentRotation.current.x
    groupRef.current.rotation.y = currentRotation.current.y

    // Breathing animation
    if (enabled) {
      const breathY = Math.sin(timeRef.current * speed) * yAmplitude
      const breathRot = Math.sin(timeRef.current * speed * 0.7) * rotAmplitude

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
      {/* Illuminazione morbida, no riflessi glossy */}
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.6}
        castShadow={false}
      />
      <directionalLight
        position={[-3, 2, 4]}
        intensity={0.3}
        castShadow={false}
      />
      
      {/* Environment soft per fill-light diffusa */}
      <Environment preset="apartment" />
    </>
  )
}

// ============================================================
// MAIN HEAD3D COMPONENT
// ============================================================
export function Head3D({ className = "" }: Head3DProps) {
  const localContainerRef = useRef<HTMLDivElement>(null)
  
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

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
        toneMappingExposure: 1.0,
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
            prefersReducedMotion={prefersReducedMotion}
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
