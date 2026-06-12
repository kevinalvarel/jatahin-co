import { AboutDetail } from '#/components/landing-page/about-detail'
import StaggeredMenu from '#/components/landing-page/animated-navbar'
import DotsBackground from '#/components/landing-page/dots-background'
import { FaqSection } from '#/components/landing-page/faq-section'
import { Footer } from '#/components/landing-page/footer'
import Orb from '#/components/landing-page/orb-background'
import { SquigglyText } from '#/components/landing-page/squiggly-text'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

const menuItems = [
  { label: 'Home', ariaLabel: 'Homepage', link: '/' },
  { label: 'About', ariaLabel: 'About', link: '#about' },
  { label: 'FAQ', ariaLabel: 'FAQ', link: '#faq' },
  { label: 'Contact', ariaLabel: 'Contact', link: '#contact' },
]

const actionButtons = [{ label: 'Mulai', ariaLabel: 'Mulai', link: '/login' }]

function Home() {
  return (
    <div className="w-full">
      {/* Navbar — fixed, always on top */}
      <StaggeredMenu
        position="right"
        isFixed={true}
        items={menuItems}
        actionButtons={actionButtons}
        displaySocials
        displayItemNumbering={true}
        menuButtonColor="#c96442"
        openMenuButtonColor="#c96442"
        changeMenuColorOnOpen={true}
        colors={['#c96442', '#c96442']}
        logoUrl="/logo.png"
        accentColor="#c96442"
      />

      {/* Hero section — self-contained stacking context */}
      <section className="relative h-dvh w-full overflow-hidden bg-[#262624]">
        {/* Dots background: purely decorative, never blocks pointer events */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <DotsBackground glowRadius={0} />
        </div>

        {/* Hero text — sits above dots, below navbar */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none px-4">
          <h1 className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-tight font-bold text-secondary dark:text-neutral-100 max-w-4xl mx-auto">
            Jatahin{' '}
            <SquigglyText
              stepDuration={70}
              scale={[6, 9]}
              className="text-primary"
            >
              uangmu
            </SquigglyText>{' '}
            <br />
            demi{' '}
            <SquigglyText
              className="text-primary"
              stepDuration={70}
              scale={[6, 9]}
            >
              masa{' '}
            </SquigglyText>{' '}
            {''} depanmu
          </h1>
        </div>
      </section>

      {/* About section — normal flow, fully interactive */}
      <section className="relative z-10 w-full">
        <AboutDetail />
      </section>

      {/* FAQ section */}
      <FaqSection />

      {/* CTA section */}
      <section className="w-full h-dvh relative">
        <Orb
          hoverIntensity={2}
          rotateOnHover
          hue={0}
          forceHoverState={false}
          backgroundColor="#faf9f5"
        />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none px-4">
          <h2 className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-tight font-bold text-foreground dark:text-neutral-100 max-w-4xl mx-auto">
            Tunggu Apalagi?
            <br />
            Ayo{' '}
            <SquigglyText
              stepDuration={70}
              scale={[6, 9]}
              className="text-primary"
            >
              Jatahin
            </SquigglyText>{' '}
            Uangmu!
          </h2>
        </div>
      </section>

      <Footer />
    </div>
  )
}
