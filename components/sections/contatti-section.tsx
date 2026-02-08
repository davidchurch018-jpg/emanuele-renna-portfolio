"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Mail, Instagram, Linkedin, MessageCircle, Send, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function ContattiSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const contactLinks = [
    {
      icon: Mail,
      label: "Email",
      value: "emanuele@example.com",
      href: "mailto:emanuele@example.com",
    },
    {
      icon: Instagram,
      label: "Instagram",
      value: "@emanuele.renna",
      href: "https://instagram.com/emanuele.renna",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "Emanuele Renna",
      href: "https://linkedin.com/in/emanuelerenna",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "+39 XXX XXX XXXX",
      href: "https://wa.me/39XXXXXXXXXX",
    },
  ]

  return (
    <section id="contatti" className="py-24 px-4 bg-background" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-brand-secondary font-semibold tracking-wide uppercase text-sm">Contatti</span>
          <h2 className="font-condensed text-5xl md:text-6xl lg:text-7xl font-bold mt-4 uppercase leading-none">Parliamone</h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Hai un progetto in mente? Contattami per una consulenza gratuita.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            {isSubmitted ? (
              <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-8 shadow-lg text-center space-y-4">
                <div className="w-16 h-16 bg-brand-secondary rounded-full flex items-center justify-center mx-auto">
                  <Send className="w-8 h-8 text-brand-primary" />
                </div>
                <h3 className="text-xl font-semibold">Messaggio inviato!</h3>
                <p className="text-muted-foreground">Ti ricontatterò il prima possibile.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-8 shadow-lg space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Nome</Label>
                    <Input id="contact-name" placeholder="Il tuo nome" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email</Label>
                    <Input id="contact-email" type="email" placeholder="la-tua@email.com" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-subject">Oggetto</Label>
                  <Input id="contact-subject" placeholder="Di cosa vorresti parlare?" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-message">Messaggio</Label>
                  <Textarea
                    id="contact-message"
                    placeholder="Racconta il tuo progetto o la tua idea..."
                    rows={5}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-brand-primary hover:bg-brand-primary/90 py-6 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Invio in corso..." : "Invia messaggio"}
                </Button>
              </form>
            )}
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            <div className="bg-brand-primary rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">Prenota una call</h3>
              <p className="text-white/80 mb-6">
                Preferisci parlare a voce? Prenota una call gratuita di 30 minuti per discutere del tuo progetto.
              </p>
              <Button variant="secondary" className="bg-brand-secondary text-brand-primary hover:bg-brand-secondary/80">
                Prenota su Calendly
              </Button>
            </div>

            <div className="space-y-4">
              {contactLinks.map((contact) => (
                <a
                  key={contact.label}
                  href={contact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center group-hover:bg-brand-primary transition-colors">
                    <contact.icon className="w-5 h-5 text-brand-primary group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{contact.label}</p>
                    <p className="font-medium">{contact.value}</p>
                  </div>
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Milano, Italia · Disponibile da remoto</span>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-24 pt-8 border-t border-border text-center"
        >
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Emanuele Renna. Tutti i diritti riservati.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
