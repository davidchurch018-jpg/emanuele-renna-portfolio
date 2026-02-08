"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { ArrowRight, Clock, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export function PreventivoBlock() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  return (
    <section id="preventivo" className="py-24 px-4 bg-brand-primary" ref={ref}>
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="space-y-6"
        >
          <h2 className="font-condensed text-5xl md:text-6xl lg:text-7xl font-bold text-white uppercase leading-none">
            Parliamo del tuo progetto
          </h2>

          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Raccontami la tua idea: ti rispondo entro 24-48 ore con una proposta su misura.
          </p>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="bg-[#DEEAFC] text-foreground hover:bg-[#cddff5] px-10 py-7 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Richiedi preventivo
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-2xl">Richiedi un preventivo</DialogTitle>
              </DialogHeader>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 space-y-4"
                >
                  <div className="w-16 h-16 bg-brand-secondary rounded-full flex items-center justify-center mx-auto">
                    <Send className="w-8 h-8 text-brand-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Richiesta inviata!</h3>
                  <p className="text-muted-foreground">Ti ricontatterò entro 24-48 ore.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" placeholder="Il tuo nome" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="la-tua@email.com" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="objective">Obiettivo</Label>
                    <Textarea
                      id="objective"
                      placeholder="Descrivi brevemente cosa vorresti ottenere..."
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget indicativo</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona un range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-1k">{"< 1.000€"}</SelectItem>
                        <SelectItem value="1k-3k">1.000€ - 3.000€</SelectItem>
                        <SelectItem value="3k-5k">3.000€ - 5.000€</SelectItem>
                        <SelectItem value="5k-10k">5.000€ - 10.000€</SelectItem>
                        <SelectItem value="over-10k">{"> 10.000€"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-brand-primary hover:bg-brand-primary/90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Invio in corso..." : "Invia richiesta"}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3" />
                    Risposta entro 24-48h
                  </p>
                </form>
              )}
            </DialogContent>
          </Dialog>

          <p className="text-white/60 text-sm flex items-center justify-center gap-2">
            <Clock className="w-4 h-4" />
            Rispondo entro 24-48 ore
          </p>
        </motion.div>
      </div>
    </section>
  )
}
