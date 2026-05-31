/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './context/**/*.{js,ts,jsx,tsx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
    './styles/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    { pattern: /bg-\[#(1A0A08|FAF6F0|2A1208|8B1A1A|C9A84C|A52020|8C7A6A|100504|31a8ff|001e36|cc00ff|2d0036|6B1414|E8C98A)\]/ },
    { pattern: /text-\[#(1A0A08|FAF6F0|2A1208|8B1A1A|C9A84C|A52020|8C7A6A|100504|31a8ff|001e36|cc00ff|2d0036|6B1414|E8C98A)\]/ },
    { pattern: /border-\[#(1A0A08|FAF6F0|2A1208|8B1A1A|C9A84C|A52020|8C7A6A|100504|31a8ff|001e36|cc00ff|2d0036|6B1414|E8C98A)\]/ },
    { pattern: /from-\[#(1A0A08|FAF6F0|2A1208|8B1A1A|C9A84C|A52020|8C7A6A|100504|31a8ff|001e36|cc00ff|2d0036|6B1414|E8C98A)\]/ },
    { pattern: /via-\[#(1A0A08|FAF6F0|2A1208|8B1A1A|C9A84C|A52020|8C7A6A|100504|31a8ff|001e36|cc00ff|2d0036|6B1414|E8C98A)\]/ },
    { pattern: /to-\[#(1A0A08|FAF6F0|2A1208|8B1A1A|C9A84C|A52020|8C7A6A|100504|31a8ff|001e36|cc00ff|2d0036|6B1414|E8C98A)\]/ },
  ],
  theme: {
    extend: {
      keyframes: {
        'slide-right': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      animation: {
        'slide-right': 'slide-right 0.3s ease-out forwards',
        'slide-down': 'slide-down 0.2s ease-out forwards',
        'fade-in': 'fade-in 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
}
