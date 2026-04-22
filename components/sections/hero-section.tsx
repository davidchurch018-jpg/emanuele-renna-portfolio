"use client"

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Instagram, MessageCircle } from "lucide-react"
import { useRef, useState, useEffect, useCallback } from "react"

// ============================================
// Chat conversation data
// ============================================
interface ChatMessage {
  id: number
  text: string
  sender: "user" | "bot"
}

const conversations: { question: string; answer: string }[] = [
  {
    question: "Utilizzate anche AI?",
    answer:
      "Sì! Integriamo strumenti AI per velocizzare analisi, contenuti e automazioni — ma la strategia resta sempre umana.",
  },
  {
    question: "Come funziona il primo incontro?",
    answer:
      "È una call conoscitiva gratuita di 30 minuti. Capiamo insieme dove sei e dove vuoi arrivare.",
  },
  {
    question: "Quanto costa una consulenza?",
    answer: "Dipende dal progetto. Dopo la call ti mando un preventivo chiaro, senza sorprese.",
  },
  {
    question: "Lavorate anche con piccoli brand?",
    answer:
      "Assolutamente sì. Anzi, è lì che facciamo la differenza — costruiamo le fondamenta giuste fin dall'inizio.",
  },
]

// ============================================
// Typing indicator (3 bouncing dots)
// ============================================
function TypingIndicator() {
  return (
    <div className="flex items-center gap-[5px] px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-[7px] h-[7px] rounded-full bg-foreground/40"
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

// ============================================
// iMessage-style Chat component
// ============================================
function IMessageChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [fadingIds, setFadingIds] = useState<Set<number>>(new Set())
  const [showGreeting, setShowGreeting] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [currentConvIndex, setCurrentConvIndex] = useState(0)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    const container = messagesContainerRef.current
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, scrollToBottom])

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSelectQuestion(0)
    }, 1500)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSelectQuestion = (index: number) => {
    if (isAnimating) return
    setIsAnimating(true)
    setShowSuggestions(false)

    if (showGreeting) {
      setShowGreeting(false)
    }

    if (messages.length > 0) {
      const oldIds = new Set(messages.map((m) => m.id))
      setFadingIds(oldIds)
      setTimeout(() => {
        setMessages((prev) => prev.filter((m) => !oldIds.has(m.id)))
        setFadingIds(new Set())
      }, 900)
    }

    const conv = conversations[index]

    setTimeout(() => {
      const userMsg: ChatMessage = {
        id: Date.now(),
        text: conv.question,
        sender: "user",
      }
      setMessages((prev) => [...prev, userMsg])

      setTimeout(() => {
        setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
          const botMsg: ChatMessage = {
            id: Date.now() + 1,
            text: conv.answer,
            sender: "bot",
          }
          setMessages((prev) => [...prev, botMsg])

          setTimeout(() => {
            const nextIndex = (index + 1) % conversations.length
            setCurrentConvIndex(nextIndex)
            setShowSuggestions(true)
            setIsAnimating(false)
          }, 800)
        }, 1200 + Math.random() * 800)
      }, 400)
    }, messages.length > 0 ? 300 : 0)
  }

  const visibleSuggestions = [
    conversations[currentConvIndex],
    conversations[(currentConvIndex + 1) % conversations.length],
  ]

  return (
    <div className="w-full max-w-[350px] md:max-w-[420px] h-[360px] md:h-[400px] flex flex-col rounded-[28px] bg-white/92 backdrop-blur-sm border border-foreground/[0.06] shadow-[0_18px_50px_rgba(20,20,20,0.08)] overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-foreground/[0.06] bg-white/70">
        <div className="w-9 h-9 rounded-full bg-brand-primary flex items-center justify-center text-[12px] font-bold text-foreground shadow-[0_8px_20px_rgba(139,203,0,0.22)]">
          E
        </div>
        <div>
          <div className="text-[14px] font-semibold text-foreground">emarketing</div>
          <div className="text-[11px] text-foreground/50">online</div>
        </div>
      </div>

      {/* Messages area */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5 scrollbar-none bg-[linear-gradient(180deg,rgba(249,250,245,0.75)_0%,rgba(255,255,255,0.96)_100%)]">
        <AnimatePresence>
          {showGreeting && (
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, filter: "blur(12px)", scale: 0.9, transition: { duration: 0.4 } }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <div className="max-w-[85%] px-4 py-3 text-[13px] leading-[1.35] bg-white text-foreground/90 rounded-[20px] rounded-bl-[6px] shadow-[0_8px_22px_rgba(20,20,20,0.06)]">
                Ciao! Chiedimi quello che vuoi 👋
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {messages.map((msg, i) => {
          const isFading = fadingIds.has(msg.id)
          const fadeIndex = isFading ? [...fadingIds].indexOf(msg.id) : 0

          if (isFading) {
            return (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} msg-vaporize`} style={{ animationDelay: `${fadeIndex * 150}ms` }}>
                <div className={`max-w-[85%] px-4 py-3 text-[13px] leading-[1.35] ${msg.sender === "user" ? "bg-brand-primary text-foreground rounded-[20px] rounded-br-[6px]" : "bg-white text-foreground/90 rounded-[20px] rounded-bl-[6px] shadow-[0_8px_22px_rgba(20,20,20,0.06)]"}`}>
                  {msg.text}
                </div>
              </div>
            )
          }

          return (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] px-4 py-3 text-[13px] leading-[1.35] ${msg.sender === "user" ? "bg-brand-primary text-foreground rounded-[20px] rounded-br-[6px]" : "bg-white text-foreground/90 rounded-[20px] rounded-bl-[6px] shadow-[0_8px_22px_rgba(20,20,20,0.06)]"}`}>
                {msg.text}
                {msg.sender === "user" && i === messages.length - 1 && (
                  <motion.div className="text-[10px] text-foreground/40 text-right mt-1 font-medium" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                    Consegnato
                  </motion.div>
                )}
              </div>
            </motion.div>
          )
        })}

        {isTyping && (
          <motion.div className="flex justify-start" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-white rounded-[20px] rounded-bl-[6px] shadow-[0_8px_22px_rgba(20,20,20,0.06)]">
              <TypingIndicator />
            </div>
          </motion.div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested questions */}
      <div className="h-[82px] px-4 pb-4 pt-1.5 flex flex-col justify-end gap-2 shrink-0 bg-[linear-gradient(180deg,rgba(250,250,250,0.65)_0%,rgba(255,255,255,0.96)_100%)] border-t border-foreground/[0.04]">
        <AnimatePresence mode="wait">
          {showSuggestions && (
            <motion.div key={`suggestions-${currentConvIndex}`} className="flex flex-col gap-1.5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4, transition: { duration: 0.15 } }} transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}>
              {visibleSuggestions.map((conv, i) => (
                <motion.button key={`${currentConvIndex}-${i}`} onClick={() => handleSelectQuestion((currentConvIndex + i) % conversations.length)} className="w-full text-left px-4 py-2.5 text-[12px] font-medium text-foreground bg-brand-primary/14 rounded-full border border-brand-primary/20 hover:bg-brand-primary/22 transition-colors cursor-pointer" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} whileTap={{ scale: 0.97 }}>
                  {conv.question}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ============================================
// Scroll indicator (mouse icon)
// ============================================
function ScrollIndicator() {
  return (
    <motion.div className="flex flex-col items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.6 }}>
      <div className="w-6 h-10 rounded-full border-2 border-foreground/15 flex items-start justify-center p-1.5">
        <motion.div className="w-1.5 h-1.5 rounded-full bg-foreground/25" animate={{ y: [0, 12, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} />
      </div>
    </motion.div>
  )
}

// ============================================
// Cloud + Folder composition (desktop + mobile)
// ============================================
function CloudComposition({ mobile = false }: { mobile?: boolean }) {
  const handleClick = (selector: string) => {
    const el = document.querySelector(selector)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  if (mobile) {
    return (
      <div className="w-full flex justify-center mt-6 pointer-events-auto">
        <div className="relative w-[320px] h-[200px]">
          <motion.img src="/images/nuvola_2.png" alt="nuvola grande" className="absolute left-1/2 top-0 w-64 -translate-x-1/2 opacity-95" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} />

          <motion.img src="/images/nuvola_1.webp" alt="nuvola piccola" className="absolute left-0 top-14 w-40 rotate-6 opacity-95" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} />

          <motion.img src="/images/nuvola_3.webp" alt="nuvola media" className="absolute right-2 bottom-2 w-36 -rotate-6 opacity-95" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} />
          <div className="absolute left-8 top-12">
            <button onClick={() => handleClick("#servizi")} aria-label="Vai a servizi" className="flex flex-col items-center bg-white/95 rounded-xl shadow-md p-3 hover:scale-105 transition-transform">
              <img src="/images/cartella.webp" alt="cartella servizi" className="w-10 h-10 object-contain" />
              <span className="mt-2 text-xs font-semibold text-brand-primary">Servizi</span>
            </button>
          </div>

          <div className="absolute right-12 top-20">
            <button onClick={() => handleClick("#portfolio")} aria-label="Vai a portfolio" className="flex flex-col items-center bg-white/95 rounded-xl shadow-sm p-3 transform rotate-6 hover:scale-105 transition-transform">
              <img src="/images/cartella.webp" alt="cartella portfolio" className="w-10 h-10 object-contain" />
              <span className="mt-2 text-xs font-semibold text-brand-primary">Portfolio</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-[420px] h-[420px] pointer-events-auto select-none">
      <motion.img src="/images/nuvola_1.webp" alt="nuvola 1" className="absolute left-0 top-8 w-60 opacity-95 drop-shadow-lg" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} />

      <motion.img src="/images/nuvola_2.png" alt="nuvola 2" className="absolute left-44 top-0 w-80 rotate-6 opacity-95 drop-shadow-xl" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} />

      <motion.img src="/images/nuvola_3.webp" alt="nuvola 3" className="absolute right-16 bottom-8 w-56 -rotate-12 opacity-95 drop-shadow-md" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} />

        <div className="absolute left-6 top-44">
          <button onClick={() => handleClick("#servizi")} aria-label="Vai a servizi" className="flex flex-col items-center bg-white/95 rounded-xl shadow-2xl p-3 hover:scale-105 transition-transform">
            <img src="/images/cartella.webp" alt="cartella servizi" className="w-14 h-14 object-contain" />
            <span className="mt-2 text-sm font-semibold text-brand-primary">Servizi</span>
          </button>
        </div>

        <div className="absolute right-10 top-10">
          <button onClick={() => handleClick("#portfolio")} aria-label="Vai a portfolio" className="flex flex-col items-center bg-white/95 rounded-lg shadow-md p-3 transform rotate-6 hover:scale-105 transition-transform">
            <img src="/images/cartella.webp" alt="cartella portfolio" className="w-12 h-12 object-contain" />
            <span className="mt-2 text-sm font-semibold text-brand-primary">Portfolio</span>
          </button>
        </div>

        <div className="absolute left-52 bottom-8">
          <button onClick={() => handleClick("#contatti")} aria-label="Vai ai contatti" className="flex flex-col items-center bg-white/95 rounded-lg shadow-sm p-3 -rotate-12 hover:scale-105 transition-transform">
            <img src="/images/cartella.webp" alt="cartella contatti" className="w-11 h-11 object-contain" />
            <span className="mt-2 text-sm font-semibold text-brand-primary">Contatti</span>
          </button>
        </div>
    </div>
  )
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const [chatOpen, setChatOpen] = useState(false)

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section ref={sectionRef} className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_center_top,rgba(139,203,0,0.10)_0%,rgba(139,203,0,0.04)_28%,transparent_68%)]" />

      <motion.div className="relative z-10 w-full flex flex-col items-center justify-center px-5 sm:px-6 md:px-8 py-12 md:py-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
        <div className="w-full max-w-5xl flex flex-col lg:flex-row lg:items-center lg:justify-center lg:gap-16 xl:gap-20">

          {/* Profile column */}
          <motion.div className="flex w-full lg:w-auto flex-col items-center lg:items-start lg:flex-1 lg:max-w-[520px]" style={{ opacity }}>
            <div className="mb-3 md:mb-4 inline-flex items-center gap-2 rounded-full border border-brand-primary/18 bg-white/65 px-3 py-1.5 text-[0.65rem] md:text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-foreground/55 backdrop-blur-sm">Strategia ADS</div>

            {/* Avatar image */}
            <motion.div className="mb-2.5 md:mb-3 h-28 w-28 sm:h-32 sm:w-32 md:h-40 md:w-40 relative overflow-hidden rounded-full" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.88)_0%,rgba(245,247,239,0.92)_65%,rgba(232,237,224,0.95)_100%)] shadow-[0_18px_48px_rgba(20,20,20,0.05)]" />
              <div className="absolute inset-[10%] rounded-full border border-white/70" />
              <img src="/images/ema.webp" alt="Emanuele Renna" className="relative z-10 w-full h-full object-cover" loading="eager" />
            </motion.div>

            <motion.p className="text-muted-foreground/90 text-[0.88rem] md:text-[1.02rem] mb-2 md:mb-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5 }}>
              @emanuelerenna
            </motion.p>

            <motion.h1 className="text-center lg:text-left font-bold leading-[0.9] tracking-[-0.05em] mb-3 md:mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.7 }}>
              <span className="block text-[2.8rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] text-foreground">Emanuele </span>
              <span className="block text-[2.8rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] text-brand-primary">Renna</span>
            </motion.h1>

            <motion.div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 md:gap-2.5 mb-3 md:mb-4" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }}>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/[0.06] px-3.5 py-1.5 md:px-4 md:py-2 text-[0.82rem] md:text-[0.92rem] font-semibold text-foreground tracking-[-0.01em]"><span className="w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0" />Gestione ADS</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/[0.06] px-3.5 py-1.5 md:px-4 md:py-2 text-[0.82rem] md:text-[0.92rem] font-semibold text-foreground tracking-[-0.01em]"><span className="w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0" />Social Media Strategist</span>
            </motion.div>

            <motion.p className="text-brand-primary text-[0.92rem] md:text-[1.15rem] lg:text-[1.28rem] font-medium leading-[1.34] tracking-[-0.01em] text-center lg:text-left max-w-[24ch] md:max-w-[32ch] [text-wrap:balance] mb-6 md:mb-7" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }}>
              Trasformo il tuo budget pubblicitario in clienti reali
            </motion.p>

            <motion.div className="flex items-center gap-4" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 0.6 }}>
              <a href="https://instagram.com/emanuele.renna" target="_blank" rel="noopener noreferrer" className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-foreground/10 bg-white/92 backdrop-blur-sm flex items-center justify-center shadow-[0_12px_28px_rgba(20,20,20,0.08)] hover:bg-brand-primary/10 transition-colors">
                <Instagram className="w-5 h-5 md:w-6 md:h-6 text-foreground/60" />
              </a>
              <a href="https://wa.me/39XXXXXXXXXX" target="_blank" rel="noopener noreferrer" className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-foreground/10 bg-white/92 backdrop-blur-sm flex items-center justify-center shadow-[0_12px_28px_rgba(20,20,20,0.08)] hover:bg-brand-primary/10 transition-colors">
                <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-foreground/60" />
              </a>
            </motion.div>
          </motion.div>

          {/* Chat column */}
          <motion.div className="mt-10 lg:mt-0 w-full lg:w-auto flex items-center justify-center lg:flex-1 lg:max-w-[460px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.6, ease: "easeOut" }}>
            <div className="relative">
              <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[40px] bg-[radial-gradient(circle_at_center,rgba(139,203,0,0.10)_0%,transparent_70%)] blur-2xl" />

              <div className="lg:hidden">
                {chatOpen ? (
                  <div className="relative">
                    <IMessageChat />
                    <button onClick={() => setChatOpen(false)} aria-label="Chiudi chat" className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:opacity-95">×</button>
                  </div>
                ) : (
                  <button onClick={() => setChatOpen(true)} aria-label="Apri chat" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary text-white shadow-lg"><MessageCircle className="w-5 h-5" />Domande?</button>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Cloud composition: desktop (absolute) */}
        <div className="hidden lg:block absolute right-32 top-24 z-20 pointer-events-auto">
          <CloudComposition />
        </div>

        {/* Chat toggle / panel for desktop (floating near composition but above clouds) */}
        <div className="hidden lg:block absolute right-12 top-12 z-40 pointer-events-auto">
          {chatOpen ? (
            <div className="relative">
              <IMessageChat />
              <button
                onClick={() => setChatOpen(false)}
                aria-label="Chiudi chat"
                className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:opacity-95"
              >
                ×
              </button>
            </div>
          ) : (
            <button
              onClick={() => setChatOpen(true)}
              aria-label="Apri chat"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary text-white shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              Chat
            </button>
          )}
        </div>

        {/* Cloud composition: mobile (stacked below content) */}
        <div className="block lg:hidden">
          <CloudComposition mobile />
        </div>

        {/* Scroll indicator */}
        <div className="mt-8 md:mt-12">
          <ScrollIndicator />
        </div>
      </motion.div>
    </section>
  )
}
