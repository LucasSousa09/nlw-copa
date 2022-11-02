/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.tsx',
  ],
  theme: {
    extend: {
      backgroundImage: {
        app: 'url(/bg_image.png)'
      },
      fontFamily: {
        sans: 'Roboto, sans-serif'
      },
      colors: {
        green: {
          500: '#129E57'
        },
        yellow: {
          500: '#F7DD43',
          700: '#E5CD3D'
        },
        gray: {
          100: '#E1E1E6',
          300: '#8D8D99',
          600: '#32323B',
          800: '#282824',
          900: '#121214'
        }
      }
    },
  },
  plugins: [],
}
