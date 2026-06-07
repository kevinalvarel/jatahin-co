import { cn } from '#/lib/utils.ts'
import { Button } from '#/components/ui/button.tsx'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '#/components/ui/field.tsx'
import { Input } from '#/components/ui/input.tsx'
import { useForm } from '@tanstack/react-form'
import * as z from 'zod'
import { toast } from 'sonner'
import { authClient } from '#/lib/auth-client'
import { Github, Loader2 } from 'lucide-react'

const formSchema = z.object({
  email: z.email('Email tidak sesuai'),
  password: z.string().min(1, 'Password tidak boleh kosong'),
})

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
          callbackURL: '/dashboard',
        },
        {
          onSuccess: () => {
            toast.success('Berhasil Masuk')
          },
          onError: (ctx) => {
            toast.error(ctx.error.message)
          },
        },
      )
    },
  })

  return (
    <form
      id="login-form"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className={cn('flex flex-col gap-6', className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>

        <form.Field
          name="email"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <form.Subscribe
                  selector={(state) => state.isSubmitting}
                  children={(isSubmitting) => (
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="m@example.com"
                      autoComplete="off"
                      disabled={isSubmitting}
                    />
                  )}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />
        <form.Field
          name="password"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <form.Subscribe
                  selector={(state) => state.isSubmitting}
                  children={(isSubmitting) => (
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="off"
                      type="password"
                      disabled={isSubmitting}
                    />
                  )}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />
        <Field>
          <form.Subscribe
            selector={(state) => state.isSubmitting}
            children={(isSubmitting) => (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Login'}
              </Button>
            )}
          />
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <form.Subscribe
            selector={(state) => state.isSubmitting}
            children={(isSubmitting) => (
              <Button variant="outline" type="button" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Github />
                )}
                Masuk dengan GitHub
              </Button>
            )}
          />
          <FieldDescription className="text-center">
            Tidak punya akun?{' '}
            <a href="/register" className="underline underline-offset-4">
              Daftar
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
