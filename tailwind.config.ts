
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
    // Add new colors from DB to ensure they are generated
    'bg-rose-200',
    'bg-pink-200',
    'bg-red-200',
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
        pastelYellow: "#fecaca", // red-200
        pastelBlue: "#fbcfe8",   // pink-200
        pastelOrange: "#fecdd3", // rose-200
        pastelGreen: "#f0abfc",  // fuchsia-300
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
