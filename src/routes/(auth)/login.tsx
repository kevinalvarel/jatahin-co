import LiquidChrome from '#/components/animated/liquid-chrome'
import { LoginForm } from '#/components/login-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            Jatahin
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block rounded-tl-3xl">
        <LiquidChrome
          baseColor={[
            0.6784313725490196, 0.6941176470588235, 0.7098039215686275,
          ]}
          speed={0.3}
          amplitude={0.3}
          interactive
        />
      </div>
    </div>
  )
}
