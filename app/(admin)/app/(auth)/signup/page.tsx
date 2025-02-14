'use client';

import AppleLogo from '@assets/icons/logo-apple.svg';
import GoogleLogo from '@assets/icons/logo-google.svg';
import Button from '@components/generic/Button';
import { FormItem, FormLabel, FormMessage, SubmitButton, TextField } from '@components/generic/Form';
import { useForm } from '@tanstack/react-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { z } from 'zod';
import { signup } from './actions';

const SignUpPage = () => {
  const router = useRouter();
  const [response, handleSignUp] = useFormState(signup, { state: 'PENDING' });

  const form = useForm({
    defaultValues: { email: '', firstName: '', lastName: '' } as SignUpInput,
    validators: {
      onChange: signUpSchema,
    },
  });

  useEffect(() => {
    if (response.state === 'SUCCESS') router.push('/verify-email');
  }, [response]);

  return (
    <form className="" action={handleSignUp}>
      <div className="flex flex-col w-full max-w-sm gap-12 p-4 mx-auto bg-white border rounded shadow-sm border-brand-background">
        <header className="text-center">
          <h1 className="mb-2 text-lg font-medium">Crea tu cuenta</h1>
          <p className="w-10/12 mx-auto text-sm leading-4">Accede a todas las herramientas de Sicaru para tu negocio</p>
        </header>

        <div className="flex flex-col gap-4">
          <fieldset className="grid items-center grid-cols-2 gap-2">
            <Button type="button">
              <GoogleLogo className="w-4" />
              Google
            </Button>

            <Button type="button">
              <AppleLogo className="w-4" />
              Apple
            </Button>
          </fieldset>

          <div className="relative flex items-center justify-center before:absolute before:inset-0 before:m-auto before:h-px before:w-full before:bg-slate-200">
            <p className="relative inline-block px-2 m-auto text-xs bg-white w-max">O entra con tu correo</p>
          </div>

          <fieldset className="grid grid-cols-2 gap-2">
            <form.Field
              name="firstName"
              children={(field) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Nombre</FormLabel>

                  <TextField
                    type="text"
                    name={field.name}
                    autoComplete="given-name"
                    meta={field.state.meta}
                    value={field.state.value}
                    onChange={(e) => field.handleChange((e.target as HTMLInputElement).value)}
                    id={field.name}
                  />
                </FormItem>
              )}
            />

            <form.Field
              name="lastName"
              children={(field) => (
                <FormItem>
                  <FormLabel htmlFor={field.name}>Apellido</FormLabel>

                  <TextField
                    type="text"
                    name={field.name}
                    autoComplete="family-name"
                    meta={field.state.meta}
                    value={field.state.value}
                    onChange={(e) => field.handleChange((e.target as HTMLInputElement).value)}
                    id={field.name}
                  />
                </FormItem>
              )}
            />

            <form.Field
              name="email"
              children={(field) => (
                <FormItem className="col-span-2">
                  <FormLabel htmlFor={field.name}>Correo electrónico</FormLabel>

                  <TextField
                    type="email"
                    name={field.name}
                    autoComplete="email"
                    meta={field.state.meta}
                    value={field.state.value}
                    onChange={(e) => field.handleChange((e.target as HTMLInputElement).value)}
                    id={field.name}
                  />

                  {response.state === 'ERROR' && <FormMessage>Ya existe una cuenta con este correo</FormMessage>}
                </FormItem>
              )}
            />
          </fieldset>

          <footer className="flex flex-col gap-4">
            <form.Subscribe selector={({ isDirty, isValid }) => ({ isDirty, isValid })}>
              {({ isDirty, isValid }) => (
                <SubmitButton variant="primary" className="w-full" disabled={!isDirty || !isValid}>
                  Crear cuenta
                </SubmitButton>
              )}
            </form.Subscribe>

            <small className="text-center">
              ¿Ya tienes una cuenta?&nbsp;
              <Link href="/signin" className="underline">
                Inicia sesión
              </Link>
            </small>
          </footer>
        </div>
      </div>
    </form>
  );
};

export default SignUpPage;

export const signUpSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
