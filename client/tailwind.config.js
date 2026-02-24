/** @type {import('tailwindcss').Config} */
module.exports = {
  // OJO: Actualizamos la ruta para que lea dentro de src/
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}" 
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // MU Online Palette
        'mu-gold':       '#c9a84c',
        'mu-gold-light': '#f0d080',
        'mu-gold-dark':  '#7a5e1a',
        'mu-crimson':    '#8b1a1a',
        'mu-crimson-light':'#c0392b',
        'mu-bg-deep':    '#050508',
        'mu-bg-dark':    '#0a0a12',
        'mu-bg-card':    '#0e0e1a',
        'mu-bg-card2':   '#12121f',
        'mu-steel':      '#4a5568',
        'mu-steel-light':'#718096',
        
        // Classes & Stats
        'mu-knight':     '#c0392b',
        'mu-wizard':     '#4a90d9',
        'mu-elf':        '#27ae60',
        'mu-hp':         '#8b0000',
        'mu-hp-bright':  '#e53e3e',
        'mu-mp':         '#1a3a6b',
        'mu-mp-bright':  '#4a90d9',
      },
      fontFamily: {
        cinzel: ['Cinzel_400Regular', 'serif'],
        cinzelBold: ['Cinzel_700Bold', 'serif'],
        cinzelDeco: ['CinzelDecorative_700Bold', 'serif'],
        crimson: ['CrimsonPro_400Regular', 'serif'],
        crimsonItalic: ['CrimsonPro_400Regular_Italic', 'serif'],
        crimsonBold: ['CrimsonPro_700Bold', 'serif'],
      }
    },
  },
  plugins: [],
}