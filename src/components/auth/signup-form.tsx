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
import { useNavigate } from '@tanstack/react-router'

const formSchema = z.object({
  name: z
    .string()
    .min(1, 'Nama tidak boleh kosong')
    .max(50, 'Nama maksimal 50 karakter'),
  email: z.email('Email tidak sesuai').max(50, 'Email maksimal 50 karakter'),
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .max(50, 'Password maksimal 50 karakter')
    .regex(/[A-Z]/, 'Password harus mengandung setidaknya satu huruf besar')
    .regex(/[a-z]/, 'Password harus mengandung setidaknya satu huruf kecil')
    .regex(/[0-9]/, 'Password harus mengandung setidaknya satu angka'),
})

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const navigater = useNavigate()
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          name: value.name,
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            toast.success('Akun berhasil didaftarkan')
            navigater({ to: '/dashboard' })
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
      id="signup-form"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className={cn('flex flex-col gap-6', className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Daftarkan Akun Anda</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Masukan Email Anda di bawah untuk mendaftarkan akun
          </p>
        </div>

        <form.Field
          name="name"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Nama</FieldLabel>
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
                      placeholder="Kevin Alvarel"
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
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Daftar'}
              </Button>
            )}
          />
        </Field>
        <FieldSeparator>Atau daftar dengan</FieldSeparator>
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
                Daftar dengan GitHub
              </Button>
            )}
          />
          <FieldDescription className="text-center">
            Sudah punya akun?{' '}
            <a href="/login" className="underline underline-offset-4">
              Masuk
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
