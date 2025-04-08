/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './client/src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#40635E',
        'primary-foreground': '#ffffff',
        secondary: '#F5F5DC',
        'secondary-foreground': '#000000',
        muted: '#F3F4F6',
        'muted-foreground': '#6B7280',
        accent: '#F3F4F6',
        'accent-foreground': '#111827',
        card: '#ffffff',
        'card-foreground': '#111827',
        destructive: '#EF4444',
        'destructive-foreground': '#ffffff',
        border: '#E5E7EB',
        ring: '#40635E',
      },
    },
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1400px',
      },
    },
  },
  plugins: [],
} 