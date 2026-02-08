"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"
import { ArrowUpRight, Sparkles } from "lucide-react"

const skills = [
  { label: "Marketing Strategy", color: "bg-brand-primary text-white" },
  { label: "Event Production", color: "bg-brand-secondary text-foreground" },
  { label: "Social & Content", color: "bg-foreground text-white" },
]

const stats = [
  { value: "8+", label: "Anni di esperienza" },
  { value: "50+", label: "Progetti completati" },
  { value: "30+", label: "Clienti soddisfatti" },
]

export function ChiSonoSection() {
  const sectionRef = useRef(null)
  const imageRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const imageInView = useInView(imageRef, { once: true, margin: "-50px" })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  const imageY = useTransform(scrollYProgress, [0, 1], [50, -50])
  const decorY = useTransform(scrollYProgress, [0, 1], [0, -80])

  return (
    <section id="chi-sono" className="py-24 md:py-32 px-4 bg-background relative overflow-hidden" ref={sectionRef}>
      {/* Subtle background pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.5) 1px, transparent 0)`,
          backgroundSize: "40px 40px"
        }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Column */}
          <motion.div
            ref={imageRef}
            initial={{ opacity: 0, x: -60 }}
            animate={imageInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Main Image Container */}
            <motion.div 
              className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-muted"
              style={{ y: imageY }}
            >
              <Image 
                src="/images/180852123_2251823108285101_2908344964305872064_n.jpg" 
                alt="Emanuele Renna - Consulente Marketing" 
                fill 
                className="object-cover"
                priority
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/30 via-transparent to-transparent" />
              
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-24 h-24">
                <div className="absolute top-4 right-4 w-full h-full border-t-2 border-r-2 border-brand-secondary rounded-tr-3xl" />
              </div>
            </motion.div>

            {/* Floating accent shapes */}
            <motion.div
              className="absolute -bottom-8 -right-8 w-40 h-40 bg-brand-secondary rounded-3xl -z-10"
              style={{ y: decorY }}
              animate={{ rotate: [0, 3, 0, -3, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            
            <motion.div
              className="absolute -top-4 -left-4 w-20 h-20 border-2 border-brand-primary/20 rounded-2xl -z-10"
              animate={{ rotate: [0, -5, 0, 5, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Stats floating card */}
            <motion.div
              className="absolute -right-4 bottom-20 bg-card rounded-2xl shadow-xl p-4 border border-border"
              initial={{ opacity: 0, x: 30, scale: 0.9 }}
              animate={imageInView ? { opacity: 1, x: 0, scale: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="flex gap-6">
                {stats.map((stat, i) => (
                  <div key={stat.label} className="text-center">
                    <motion.span 
                      className="text-2xl font-bold text-brand-primary block"
                      initial={{ opacity: 0, y: 10 }}
                      animate={imageInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.6 + i * 0.1 }}
                    >
                      {stat.value}
                    </motion.span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{stat.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            {/* Section label */}
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
            >
              <Sparkles className="w-4 h-4 text-brand-primary" />
              <span className="text-brand-primary font-semibold tracking-wide uppercase text-sm">
                Chi sono
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h2 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
            >
              Emanuele{" "}
              <span className="relative">
                <span className="relative z-10">Renna</span>
                <motion.span 
                  className="absolute bottom-2 left-0 w-full h-3 bg-brand-secondary/50 -z-0"
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  style={{ originX: 0 }}
                />
              </span>
            </motion.h2>

            {/* Description */}
            <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
              >
                Consulente marketing con oltre <strong className="text-foreground">8 anni di esperienza</strong> nel 
                trasformare idee in strategie concrete. Ho lavorato con startup, PMI e brand affermati, 
                portando risultati tangibili attraverso un approccio <strong className="text-foreground">data-driven e creativo</strong>.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 }}
              >
                Dalla strategia alla produzione eventi, dalla gestione social alla creazione di contenuti: 
                costruisco percorsi di crescita su misura per ogni business, senza promesse irrealistiche 
                ma con <strong className="text-foreground">obiettivi chiari e misurabili</strong>.
              </motion.p>
            </div>

            {/* Skills tags */}
            <motion.div 
              className="flex flex-wrap gap-3 pt-2"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7 }}
            >
              {skills.map((skill, index) => (
                <motion.span
                  key={skill.label}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium ${skill.color} shadow-sm hover:shadow-md transition-shadow cursor-default`}
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                  transition={{ delay: 0.8 + index * 0.1, type: "spring", stiffness: 300 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {skill.label}
                </motion.span>
              ))}
            </motion.div>

            {/* CTA Link */}
            <motion.a
              href="#contatti"
              className="inline-flex items-center gap-2 text-brand-primary font-semibold group mt-4"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1 }}
              onClick={(e) => {
                e.preventDefault()
                document.querySelector("#contatti")?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              <span className="relative">
                Parliamo del tuo progetto
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full" />
              </span>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
