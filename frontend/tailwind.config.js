/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        bio: {
          primary: '#2d5016',
          'primary-light': '#4a7c23',
          secondary: '#1a4b84',
          'secondary-light': '#2563eb',
          accent: '#7c2d12',
          'accent-light': '#dc2626',
          neutral: '#0f172a',
          'neutral-light': '#334155',
          surface: '#f8fafc',
          'surface-elevated': '#ffffff',
          border: '#e2e8f0',
          text: '#1e293b',
          'text-muted': '#64748b',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
