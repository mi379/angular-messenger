const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      maxHeight: {
      	'fit-plus-20': `calc(auto + 50px)`
      }
    },
  },
  plugins: [
   
  ],
}