/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', 'Inter', 'sans-serif'],
      },
      animation: {
        'gradient': 'gradient 8s ease infinite',
        ripple: 'ripple 0.6s linear',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'hover-glow': 'hover-glow 1.5s infinite',
        'scale': 'scale 0.2s ease-out',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2)', opacity: '0' }
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'slide-in': {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        'hover-glow': {
          '0%': { boxShadow: '0 0 0 0 rgba(var(--primary), 0.4)' },
          '70%': { boxShadow: '0 0 0 10px rgba(var(--primary), 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(var(--primary), 0)' }
        }
      },
      transitionProperty: {
        'size': 'width, height',
      }
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#8b5cf6",
          secondary: "#ec4899",
          accent: "#0ea5e9",
          neutral: "#2a2e37",
          "base-100": "#ffffff",
          "base-200": "#f9fafb",
          "base-300": "#f3f4f6",
          info: "#06b6d4",
          success: "#10b981",
          warning: "#f59e0b",
          error: "#ef4444",
        },
        dark: {
          primary: "#8b5cf6",
          secondary: "#ec4899",
          accent: "#0ea5e9",
          neutral: "#2a2e37",
          "base-100": "#1f2937",
          "base-200": "#111827",
          "base-300": "#0f172a",
          info: "#06b6d4",
          success: "#10b981",
          warning: "#f59e0b",
          error: "#ef4444",
        },
      },
    ],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: false,
  },
};
