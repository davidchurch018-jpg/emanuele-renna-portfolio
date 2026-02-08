"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Target, Calendar, Share2, Palette, ArrowRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"

const servizi = [
  {
    icon: Target,
    title: "Strategia Marketing",
    description: "Analisi, posizionamento e pianificazione per raggiungere i tuoi obiettivi di business.",
    benefits: ["Analisi competitor", "Posizionamento brand", "Piano d'azione concreto"],
    target: "Per chi vuole crescere con metodo",
    accent: "from-[#DEEAFC] to-[#c8dcf5]",
    accentLight: "bg-[#DEEAFC]/20",
  },
  {
    icon: Calendar,
    title: "Produzione Eventi",
    description: "Dall'ideazione alla produzione, dalla ricerca sponsor alla gestione completa dell'evento.",
    benefits: ["Concept creativo", "Gestione sponsor", "Coordinamento completo"],
    target: "Per brand che vogliono esperienze memorabili",
    accent: "from-[#DEEAFC] to-[#c8dcf5]",
    accentLight: "bg-[#DEEAFC]/20",
  },
  {
    icon: Share2,
    title: "Social Media",
    description: "Piano editoriale, creazione contenuti e gestione community per una presenza autentica.",
    benefits: ["Piano editoriale", "Content creation", "Community management"],
    target: "Per chi vuole costruire una community",
    accent: "from-[#DEEAFC] to-[#c8dcf5]",
    accentLight: "bg-[#DEEAFC]/20",
  },
  {
    icon: Palette,
    title: "Branding & Funnel",
    description: "Identità visiva e percorsi di conversione ottimizzati per trasformare visitatori in clienti.",
    benefits: ["Visual identity", "Landing page", "Funnel ottimizzati"],
    target: "Per chi parte da zero o vuole evolvere",
    accent: "from-[#DEEAFC] to-[#c8dcf5]",
    accentLight: "bg-[#DEEAFC]/20",
  },
]

interface ServiceCardProps {
  servizio: typeof servizi[0]
  index: number
  isInView: boolean
}

function ServiceCard({ servizio, index, isInView }: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      <div className={cn(
        "relative h-full rounded-3xl border border-white/30 bg-white/20 backdrop-blur-sm p-8 transition-all duration-500",
        "hover:shadow-2xl hover:shadow-brand-primary/20 hover:border-brand-primary/30",
        "overflow-hidden"
      )}>
        {/* Hover background glow */}
        <motion.div
          className={cn("absolute inset-0 opacity-0 transition-opacity duration-500", servizio.accentLight)}
          animate={{ opacity: isHovered ? 1 : 0 }}
        />

        {/* Content */}
        <div className="relative z-10 space-y-5">
          {/* Icon with gradient background */}
          <motion.div 
            className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center",
              "bg-gradient-to-br", servizio.accent,
              "shadow-lg transition-transform duration-300"
            )}
            animate={{ scale: isHovered ? 1.1 : 1, rotate: isHovered ? 5 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <servizio.icon className="w-8 h-8 text-white" />
          </motion.div>

          {/* Title */}
          <h3 className="text-2xl font-bold tracking-tight">{servizio.title}</h3>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">{servizio.description}</p>

          {/* Benefits list */}
          <ul className="space-y-2 pt-2">
            {servizio.benefits.map((benefit, i) => (
              <motion.li
                key={benefit}
                className="flex items-center gap-2 text-sm"
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.4 + index * 0.12 + i * 0.05 }}
              >
                <div className="w-5 h-5 rounded-full bg-brand-primary/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-brand-secondary" />
                </div>
                <span className="text-foreground font-medium">{benefit}</span>
              </motion.li>
            ))}
          </ul>

          {/* Target audience */}
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground italic">{servizio.target}</p>
          </div>

          {/* Hover CTA */}
          <motion.div
            className="flex items-center gap-2 text-brand-secondary font-semibold"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            transition={{ duration: 0.3 }}
          >
            <span>Scopri di più</span>
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </div>

        {/* Corner decoration */}
        <motion.div
          className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-20"
          style={{ background: `linear-gradient(135deg, #DEEAFC 0%, transparent 70%)` }}
          animate={{ scale: isHovered ? 1.5 : 1 }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  )
}

export function ServiziSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -100])

  return (
    <section id="servizi" className="py-24 md:py-32 px-4 bg-background relative overflow-hidden" ref={sectionRef}>
      {/* Decorative background elements */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ y: backgroundY }}
      >
        <div className="absolute top-20 right-10 w-72 h-72 bg-brand-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-10 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl" />
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.span 
            className="inline-flex items-center gap-2 text-brand-primary font-semibold tracking-wide uppercase text-sm mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
          >
            <span className="w-8 h-px bg-brand-primary" />
            Servizi
            <span className="w-8 h-px bg-brand-primary" />
          </motion.span>
          
          <motion.h2 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mt-4 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            Come posso{" "}
            <span className="relative inline-block">
              <span className="relative z-10">aiutarti</span>
              <motion.span
                className="absolute bottom-2 left-0 w-full h-4 bg-brand-secondary/40 -z-0"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ delay: 0.6, duration: 0.6 }}
                style={{ originX: 0 }}
              />
            </span>
          </motion.h2>
          
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto mt-6"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            Soluzioni su misura per far crescere il tuo business. 
            Ogni servizio è progettato per portare risultati concreti.
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {servizi.map((servizio, index) => (
            <ServiceCard 
              key={servizio.title} 
              servizio={servizio} 
              index={index} 
              isInView={isInView}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
        >
          <p className="text-muted-foreground mb-4">Non sai quale servizio fa per te?</p>
          <motion.a
            href="#contatti"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-primary text-white rounded-full font-semibold shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/30 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.preventDefault()
              document.querySelector("#contatti")?.scrollIntoView({ behavior: "smooth" })
            }}
          >
            Parliamone insieme
            <ArrowRight className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
