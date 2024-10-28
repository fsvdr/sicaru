import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontSize: {
        xs: '0.75rem',
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'store-primary': 'var(--su-color-primary)',
      },
      gridTemplateColumns: {
        store: '4vw minmax(0, 1fr)',
      },
      padding: {
        'safe-area-bottom-0': 'max(env(safe-area-inset-bottom), 0)',
        'safe-area-bottom-1': 'max(env(safe-area-inset-bottom), 4px)',
        'safe-area-bottom-2': 'max(env(safe-area-inset-bottom), 8px)',
        'safe-area-bottom-3': 'max(env(safe-area-inset-bottom), 12px)',
        'safe-area-bottom-4': 'max(env(safe-area-inset-bottom), 16px)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
export default config;
