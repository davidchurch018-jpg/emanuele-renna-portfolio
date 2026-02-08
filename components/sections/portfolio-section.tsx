"use client"

import { useState, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

type Category = "tutti" | "eventi" | "social" | "brand" | "campaign"

interface PortfolioItem {
  id: string
  title: string
  category: Category
  image: string
  featured?: boolean
  caseStudy: {
    objective: string
    activities: string
    result: string
    services: string[]
    assets: string[]
  }
}

const portfolioItems: PortfolioItem[] = [
  {
    id: "1",
    title: "Festival Tech Summer",
    category: "eventi",
    image: "/tech-festival-outdoor-stage-summer-event.jpg",
    featured: true,
    caseStudy: {
      objective:
        "Creare un evento tech che unisse networking, formazione e intrattenimento per startup e professionisti del settore.",
      activities:
        "Ideazione concept, ricerca sponsor, gestione venue, coordinamento speaker, campagna social pre-evento.",
      result: "Oltre 1.000 partecipanti, diversi sponsor acquisiti, feedback post-evento molto positivi.",
      services: ["Event Production", "Sponsorship", "Marketing"],
      assets: ["Brand identity", "Landing page", "Social kit"],
    },
  },
  {
    id: "2",
    title: "Rebrand Ristorante Stellato",
    category: "brand",
    image: "/elegant-restaurant-branding-minimal-logo-design.jpg",
    caseStudy: {
      objective:
        "Rinnovare l'identità visiva di un ristorante stellato mantenendo l'heritage ma modernizzando la comunicazione.",
      activities: "Audit brand esistente, definizione nuova brand strategy, design sistema visivo, guidelines.",
      result:
        "Significativo aumento engagement social, copertura media su testate food, nuovo target demografico raggiunto.",
      services: ["Branding", "Strategy"],
      assets: ["Logo", "Brand guidelines", "Menu design", "Social templates"],
    },
  },
  {
    id: "3",
    title: "Campagna Lancio App Fitness",
    category: "campaign",
    image: "/fitness-app-mobile-marketing-campaign-colorful.jpg",
    featured: true,
    caseStudy: {
      objective: "Lanciare una nuova app fitness sul mercato italiano con budget contenuto.",
      activities: "Strategia go-to-market, influencer marketing micro, campagna social, content UGC.",
      result: "Obiettivi di download superati nel primo mese, CPA sotto target, community attiva creata.",
      services: ["Marketing Strategy", "Social Media", "Influencer"],
      assets: ["Funnel ads", "Content kit", "Landing page"],
    },
  },
  {
    id: "4",
    title: "Social Strategy Fashion Brand",
    category: "social",
    image: "/fashion-brand-social-media-content-creation-aesthe.jpg",
    caseStudy: {
      objective: "Rilanciare la presenza social di un brand moda italiano con focus su Instagram e TikTok.",
      activities: "Audit canali, definizione tone of voice, piano editoriale 6 mesi, shooting content.",
      result: "Crescita follower significativa, engagement rate triplicato, incremento vendite e-commerce.",
      services: ["Social Media", "Content Creation"],
      assets: ["PED 6 mesi", "Social templates", "Shooting guidelines"],
    },
  },
  {
    id: "5",
    title: "Convention Aziendale 500 pax",
    category: "eventi",
    image: "/corporate-convention-large-venue-professional-even.jpg",
    caseStudy: {
      objective: "Organizzare convention annuale per multinazionale con 500 dipendenti da 12 paesi.",
      activities: "Logistica completa, produzione contenuti, coordinamento tecnico, team building activities.",
      result: "Feedback eccellente, logistica impeccabile, partecipazione totale alle attività.",
      services: ["Event Production", "Content"],
      assets: ["Programma evento", "Kit welcome", "Video recap"],
    },
  },
  {
    id: "6",
    title: "E-commerce Food Startup",
    category: "campaign",
    image: "/food-ecommerce-startup-packaging-delivery-marketin.jpg",
    caseStudy: {
      objective: "Costruire presenza digitale e primi clienti per startup food delivery gourmet.",
      activities: "Brand positioning, e-commerce setup, campagna lancio, partnership food blogger.",
      result: "Break-even raggiunto nei tempi previsti, base clienti solida costruita, buona retention.",
      services: ["Marketing Strategy", "Branding", "Social Media"],
      assets: ["E-commerce", "Brand identity", "Content kit"],
    },
  },
]

const categories: { value: Category; label: string }[] = [
  { value: "tutti", label: "Tutti" },
  { value: "eventi", label: "Eventi" },
  { value: "social", label: "Social" },
  { value: "brand", label: "Brand" },
  { value: "campaign", label: "Campaign" },
]

export function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState<Category>("tutti")
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const headerY = useTransform(scrollYProgress, [0, 0.15], [0, -50])
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1, 0.15], [1, 1, 0])
  const filtersY = useTransform(scrollYProgress, [0.1, 0.2], [50, 0])
  const filtersOpacity = useTransform(scrollYProgress, [0.1, 0.2], [0, 1])
  const backgroundProgress = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.03, 0.03, 0])

  const filteredItems =
    activeCategory === "tutti" ? portfolioItems : portfolioItems.filter((item) => item.category === activeCategory)

  return (
    <section id="portfolio" ref={containerRef} className="relative" style={{ height: "350vh" }}>
      {/* Dynamic background */}
      <motion.div
        className="fixed inset-0 bg-brand-primary pointer-events-none z-0"
        style={{ opacity: backgroundProgress }}
      />

      <div ref={stickyRef} className="sticky top-0 min-h-screen py-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header with scroll animation */}
          <motion.div className="text-center mb-12" style={{ y: headerY, opacity: headerOpacity }}>
            <span className="text-brand-secondary font-semibold tracking-wide uppercase text-sm">Portfolio</span>
            <h2 className="font-condensed text-5xl md:text-6xl lg:text-7xl font-bold mt-4 uppercase leading-none">Progetti selezionati</h2>
          </motion.div>

          {/* Filters with entrance animation */}
          <motion.div
            className="flex flex-wrap justify-center gap-2 mb-12"
            style={{ y: filtersY, opacity: filtersOpacity }}
          >
            {categories.map((cat) => (
              <motion.button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  activeCategory === cat.value
                    ? "bg-[#DEEAFC] text-foreground shadow-lg"
                    : "bg-white/20 text-foreground border border-white/30 hover:bg-white/30",
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {cat.label}
              </motion.button>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <PortfolioCard
                key={item.id}
                item={item}
                index={index}
                scrollProgress={scrollYProgress}
                onClick={() => setSelectedItem(item)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Case Study Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedItem && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-brand-primary text-xs font-semibold uppercase tracking-wider">
                    {selectedItem.category}
                  </span>
                </div>
                <DialogTitle className="text-2xl">{selectedItem.title}</DialogTitle>
              </DialogHeader>

              <div className="relative aspect-video rounded-lg overflow-hidden mb-6">
                <Image
                  src={selectedItem.image || "/placeholder.svg"}
                  alt={selectedItem.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-brand-primary mb-2">Obiettivo</h4>
                  <p className="text-muted-foreground">{selectedItem.caseStudy.objective}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-brand-primary mb-2">Attività</h4>
                  <p className="text-muted-foreground">{selectedItem.caseStudy.activities}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-brand-primary mb-2">Risultato</h4>
                  <p className="text-muted-foreground">{selectedItem.caseStudy.result}</p>
                </div>

                <div className="flex flex-wrap gap-4 pt-4 border-t">
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Servizi</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.caseStudy.services.map((service) => (
                        <span
                          key={service}
                          className="bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2">Asset</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.caseStudy.assets.map((asset) => (
                        <span
                          key={asset}
                          className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {asset}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}

function PortfolioCard({
  item,
  index,
  scrollProgress,
  onClick,
}: {
  item: PortfolioItem
  index: number
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"]
  onClick: () => void
}) {
  // Staggered reveal based on scroll and index
  const startOffset = 0.15 + index * 0.03
  const endOffset = startOffset + 0.15

  const y = useTransform(scrollProgress, [startOffset, endOffset], [100, 0])
  const opacity = useTransform(scrollProgress, [startOffset, startOffset + 0.05, endOffset], [0, 0.5, 1])
  const scale = useTransform(scrollProgress, [startOffset, endOffset], [0.9, 1])
  const rotateX = useTransform(scrollProgress, [startOffset, endOffset], [15, 0])

  return (
    <motion.div
      style={{ y, opacity, scale, rotateX }}
      className={cn(
        "group cursor-pointer perspective-1000",
        item.featured && "sm:col-span-2 lg:col-span-1 lg:row-span-2",
      )}
      onClick={onClick}
    >
      <motion.div
        className={cn(
          "relative overflow-hidden rounded-2xl bg-muted",
          item.featured ? "aspect-[4/5]" : "aspect-[4/3]",
        )}
        whileHover={{ scale: 1.02, y: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <span className="text-brand-secondary text-xs font-semibold uppercase tracking-wider">{item.category}</span>
          <h3 className="text-white text-xl font-bold mt-1">{item.title}</h3>
        </div>

        {/* Featured badge */}
        {item.featured && (
          <div className="absolute top-4 right-4 bg-brand-secondary text-foreground px-3 py-1 rounded-full text-xs font-semibold">
            Featured
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
