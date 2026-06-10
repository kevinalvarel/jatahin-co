import StaggeredMenu from '#/components/landing-page/animated-navbar'
import DotsBackground from '#/components/landing-page/dots-background'
import { SquigglyText } from '#/components/landing-page/squiggly-text'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

const menuItems = [
  { label: 'Home', ariaLabel: 'Homepage', link: '/' },
  { label: 'About', ariaLabel: 'About', link: '/about' },
  { label: 'Services', ariaLabel: 'Services', link: '/services' },
  { label: 'Contact', ariaLabel: 'Contact', link: '/contact' }
];

const actionButtons = [
  { label: 'Mulai', ariaLabel: 'Mulai', link: '/login' }
];


function Home() {
  return (
    <div className="w-full h-dvh relative">
      <StaggeredMenu
        position="right"
        isFixed={true}
        items={menuItems}
        actionButtons={actionButtons}
        displaySocials
        displayItemNumbering={true}
        menuButtonColor="#060a12"
        openMenuButtonColor="#060a12"
        changeMenuColorOnOpen={true}
        colors={['#B497CF', '#5227FF']}
        logoUrl="/logo.png"
        accentColor="#5227FF"
        onMenuOpen={() => console.log('Menu opened')}
        onMenuClose={() => console.log('Menu closed')}
      />
      <DotsBackground glowRadius={0} />
      <div className='absolute inset-0 flex flex-col items-center justify-center'>
        <h1 className="text-center text-5xl leading-tight font-bold text-neutral-900 md:text-7xl lg:text-8xl dark:text-neutral-100">
          Jatahin {""}
          <SquigglyText
            stepDuration={70}
            scale={[6, 9]}
            className="text-primary"
          >
            uangmu
          </SquigglyText>{" "}
          <br />
          demi {""}
          <SquigglyText
            className='text-primary'
            stepDuration={70}
            scale={[6, 9]}
          >masa </SquigglyText> {""} depanmu
        </h1>
      </div>
      <div className='h-screen'>
        Helloo
      </div>
    </div>
  )
}
