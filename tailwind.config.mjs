/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eef6ff',
          100: '#d9eaff',
          200: '#bcd9ff',
          300: '#8ec0ff',
          400: '#599cff',
          500: '#3478f5',
          600: '#1f5be0',
          700: '#1947b8',
          800: '#173d92',
          900: '#173672',
        },
        ink: {
          900: '#0b1220',
          700: '#1f2a44',
          500: '#475067',
          300: '#94a0bb',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Source Serif Pro', 'Georgia', 'serif'],
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            color: theme('colors.ink.700'),
            a: { color: theme('colors.brand.600'), textDecoration: 'none' },
            'a:hover': { textDecoration: 'underline' },
          },
        },
      }),
    },
  },
  plugins: [],
};
