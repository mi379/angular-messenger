const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    screens:{
      'xs':{
        'min':'360px',
        'max':'640px'
      }
    }
  },
  plugins: [
   
  ],
}
