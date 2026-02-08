"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Quote } from "lucide-react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import LogoLoop from "@/components/LogoLoop"

const testimonials = [
  {
    id: "1",
    quote:
      "Emanuele ha trasformato completamente la nostra presenza social. Non solo numeri in crescita, ma una community vera che interagisce e acquista.",
    author: "Marco Bianchi",
    role: "CEO, TechStart Italia",
    image: "/professional-man-portrait.png",
  },
  {
    id: "2",
    quote:
      "L'evento che ha organizzato per noi ha superato ogni aspettativa. Cura maniacale dei dettagli e zero stress per il nostro team.",
    author: "Giulia Rossi",
    role: "Marketing Director, EventiPro",
    image: "/placeholder-user.jpg",
  },
  {
    id: "3",
    quote:
      "Finalmente qualcuno che parla di marketing in modo concreto, con numeri e obiettivi realistici. Collaborazione che dura da 3 anni.",
    author: "Alessandro Verdi",
    role: "Founder, GreenFood",
    image: "/entrepreneur-man-portrait-casual-headshot.jpg",
  },
]

const clientLogos = [
  { name: "TechStart", logo: "/client-logo-2.png" },
  { name: "EventiPro", logo: "/event-company-logo-minimal.jpg" },
  { name: "GreenFood", logo: "/client-logo-4.png" },
  { name: "Fashion House", logo: "/minimal-fashion-logo.png" },
  { name: "Digital Agency", logo: "/digital-agency-logo-minimal.jpg" },
]

// Logos formatted for LogoLoop component
const logoLoopItems = clientLogos.map((client) => ({
  src: client.logo,
  alt: client.name,
}))

export function TestimonianzeSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="testimonianze" className="py-24 px-4 bg-background" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-brand-secondary font-semibold tracking-wide uppercase text-sm">Testimonianze</span>
          <h2 className="font-condensed text-5xl md:text-6xl lg:text-7xl font-bold mt-4 uppercase leading-none">Dicono di me</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.15 }}
            >
              <Card className="h-full border border-border shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
                <CardContent className="p-6 space-y-4">
                  <Quote className="w-8 h-8 text-brand-secondary" />

                  <p className="text-foreground leading-relaxed italic">"{testimonial.quote}"</p>

                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.author}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{testimonial.author}</p>
                      <p className="text-muted-foreground text-xs">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Client Logos with LogoLoop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="border-t border-border pt-16"
        >
          <p className="text-center text-sm font-medium text-muted-foreground mb-10 uppercase tracking-wider">Hanno lavorato con me</p>
          <div className="relative h-24 overflow-hidden">
            <LogoLoop
              logos={logoLoopItems}
              speed={80}
              direction="left"
              logoHeight={60}
              gap={60}
              hoverSpeed={20}
              scaleOnHover
              fadeOut
              fadeOutColor="#BBE053"
              ariaLabel="Clienti e partner"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
