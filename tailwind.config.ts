import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'brand-body': 'var(--font-brand-body)',
        'brand-logo': 'var(--font-brand-logo)',
        'brand-wordmark': 'var(--font-brand-wordmark)',
      },
      fontSize: {
        '2xs': '0.625rem',
        xs: '0.75rem',
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        melrose: {
          '50': '#f4f3ff',
          '100': '#eceafd',
          '200': '#dad8fc',
          '300': '#beb8fa',
          '400': '#9d90f5',
          '500': '#7d62f0',
          '600': '#6b41e6',
          '700': '#5c2fd2',
          '800': '#4c27b0',
          '900': '#402290',
          '950': '#261461',
        },
        'brand-surface': '#beb8fa',
        'brand-background': '#F1E6D0',
        'store-primary': 'var(--su-color-primary)',
        'alizarin-crimson': {
          '50': '#fdf3f3',
          '100': '#fce4e5',
          '200': '#faced0',
          '300': '#f5acaf',
          '400': '#ee7b80',
          '500': '#df4047',
          '600': '#ce343b',
          '700': '#ad282e',
          '800': '#8f252a',
          '900': '#772529',
          '950': '#400f11',
        },
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
