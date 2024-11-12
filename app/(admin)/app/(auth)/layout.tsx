import { ReactNode } from 'react';

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex flex-col items-center justify-center min-h-dvh bg-brand-background/20">
      <div className="flex flex-col w-full gap-8 px-4">
        <header>
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="text-6xl leading-3 font-brand-logo">Sicaru</span>
            <span className="text-3xl font-brand-wordmark">food</span>
          </div>
        </header>

        {children}
      </div>

      <footer>
        <small className="opacity-50">&copy;{new Date().getFullYear()} Sicaru</small>
      </footer>
    </main>
  );
};

export default AuthLayout;
