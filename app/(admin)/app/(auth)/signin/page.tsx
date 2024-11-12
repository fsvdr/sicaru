'use client';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  SubmitButton,
  TextField,
} from '@components/generic/Form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { signin } from './actions';

const SignInPage = () => {
  const router = useRouter();
  const [response, handleSignIn] = useFormState(signin, { state: 'PENDING' });

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '' },
  });

  useEffect(() => {
    if (response.state === 'SUCCESS') router.push('/verify-email');
  }, [response]);

  return (
    <Form {...form}>
      <form className="" action={handleSignIn}>
        <div className="flex flex-col w-full max-w-sm gap-12 p-4 mx-auto bg-white border rounded shadow-sm border-brand-background">
          <header className="text-center">
            <h1 className="mb-2 text-lg font-medium">Accede a tu cuenta</h1>
            <p className="w-10/12 mx-auto text-sm leading-4">
              Accede a todas las herramientas de Sicaru para tu negocio
            </p>
          </header>

          <div className="flex flex-col gap-4">
            {/* <fieldset className="grid items-center grid-cols-2 gap-2">
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
            </div> */}

            <fieldset className="grid gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>

                    <FormControl>
                      <TextField type="email" autoComplete="email" {...field} />
                    </FormControl>

                    {response.state === 'ERROR' && <FormMessage>No existe un usuario con este correo</FormMessage>}
                  </FormItem>
                )}
              />
            </fieldset>

            <footer className="flex flex-col gap-4">
              <SubmitButton variant="primary" className="w-full" disabled={!form.formState.isValid}>
                Entrar con correo
              </SubmitButton>

              <small className="text-center">
                ¿Aún no te registras?&nbsp;
                <Link href="/signup" className="underline">
                  Crea tu cuenta
                </Link>
              </small>
            </footer>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default SignInPage;

export const signInSchema = z.object({
  email: z.string().email(),
});

export type SignInInput = z.infer<typeof signInSchema>;
