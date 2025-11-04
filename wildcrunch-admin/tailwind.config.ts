import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef3e2',
          100: '#fce7c5',
          200: '#f9cf8b',
          300: '#f6b751',
          400: '#f39f17',
          500: '#d98810',
          600: '#a86a0c',
          700: '#774c09',
          800: '#462d05',
          900: '#150f02',
        },
      },
    },
  },
  plugins: [],
}
export default config
