
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  safelist: [
    'bg-pastelOrange',
    'bg-pastelYellow',
    'bg-pastelGreen',
    'bg-pastelBlue',
    'text-pastelOrange',
    'text-pastelBlue',
    'bg-pastelYellow/20',
    'bg-pastelOrange/20',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        fredoka: ['Fredoka', 'ui-rounded', 'sans-serif'],
        inter: ['Inter', 'sans-serif']
      },
      colors: {
        pastelYellow: "#fbcfe8", // Changed to pastel pink
        pastelBlue: "#b4dcff",
        pastelOrange: "#fecdd3", // Changed to pastel rose
        pastelGreen: "#bbf7d0",
        choco: "#614e3e",
        'off-white': '#faf9f7',
      },
      borderRadius: {
        ...{
          lg: '1.25rem',
          md: '0.75rem',
          sm: '0.5rem'
        }
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
