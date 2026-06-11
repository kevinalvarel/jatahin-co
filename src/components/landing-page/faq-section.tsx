import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#/components/ui/accordion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

const faqs = [
  {
    id: 'item-1',
    question: 'Apa itu Jatahin?',
    answer:
      'Jatahin adalah platform manajemen keuangan pribadi yang dirancang untuk membantu kamu merencanakan, melacak, dan mengelola pengeluaran serta tabungan dengan mudah dan menyenangkan.',
  },
  {
    id: 'item-2',
    question: 'Apakah Jatahin gratis untuk digunakan?',
    answer:
      'Ya! Jatahin tersedia secara gratis untuk semua pengguna. Kami percaya bahwa setiap orang berhak mendapatkan alat keuangan yang baik tanpa harus mengeluarkan biaya tambahan.',
  },
  {
    id: 'item-3',
    question: 'Apakah data keuangan saya aman di Jatahin?',
    answer:
      'Keamanan data kamu adalah prioritas utama kami. Semua data dienkripsi menggunakan standar industri terkini, dan kami tidak pernah menjual atau membagikan informasi pribadi kamu kepada pihak ketiga.',
  },
  {
    id: 'item-4',
    question: 'Fitur apa saja yang tersedia di Jatahin?',
    answer:
      'Jatahin menyediakan berbagai fitur unggulan seperti pencatatan pemasukan & pengeluaran otomatis, analisis kebiasaan belanja, penetapan anggaran bulanan, pengingat tagihan, dan laporan keuangan visual yang mudah dipahami.',
  },
  {
    id: 'item-5',
    question: 'Bagaimana cara memulai menggunakan Jatahin?',
    answer:
      'Cukup daftar dengan email kamu, buat profil keuangan singkat, dan langsung mulai mencatat transaksimu. Proses onboarding hanya membutuhkan waktu kurang dari 2 menit!',
  },
  {
    id: 'item-6',
    question: 'Apakah Jatahin tersedia di perangkat mobile?',
    answer:
      'Jatahin didesain secara responsif sehingga dapat diakses dengan nyaman di smartphone, tablet, maupun desktop. Aplikasi mobile native juga sedang dalam tahap pengembangan.',
  },
]

export function FaqSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // --- Badge + heading stagger reveal ---
      const headingChildren = headingRef.current
        ? Array.from(headingRef.current.children)
        : []

      gsap.fromTo(
        headingChildren,
        { opacity: 0, y: 40, filter: 'blur(6px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.75,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        },
      )

      // --- Accordion items stagger slide-in ---
      const accordionItems = itemsRef.current
        ? Array.from(itemsRef.current.querySelectorAll('[data-slot="accordion-item"]'))
        : []

      gsap.fromTo(
        accordionItems,
        { opacity: 0, x: -32, filter: 'blur(4px)' },
        {
          opacity: 1,
          x: 0,
          filter: 'blur(0px)',
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.09,
          scrollTrigger: {
            trigger: itemsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="w-full py-20 md:py-28 lg:py-36 bg-background">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headingRef} className="mb-12 md:mb-16 text-center">
          <span className="inline-block mb-3 text-xs sm:text-sm font-semibold tracking-widest uppercase text-primary">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Pertanyaan yang{' '}
            <span className="text-primary">Sering Ditanya</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
            Temukan jawaban atas pertanyaan umum seputar Jatahin. Tidak menemukan jawabannya?{' '}
            <a
              href="/contact"
              className="text-primary font-medium underline underline-offset-4 hover:opacity-75 transition-opacity"
            >
              Hubungi kami
            </a>
            .
          </p>
        </div>

        {/* Accordion */}
        <div ref={itemsRef}>
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="border border-border bg-card rounded-xl px-5 shadow-sm last:border-b"
              >
                <AccordionTrigger className="text-sm sm:text-base md:text-lg font-medium text-foreground hover:no-underline hover:text-primary transition-colors py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
