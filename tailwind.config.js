/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // or 'media' or 'class'
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        'general': '#1E90FF',
        'buttons': '#398fe5',
        'buttons-hover': '#2e7ac2',
        'screen': '#DBDBDB',
        'general-dark': '#2E86C1',
        'screen-dark': '#1B2631',
        'buttons-dark': '#398fe5',
        'buttons--darkhover': '#2e7ac2',
        'component-dark': '#444B51',
        'buttons-disabled': '#398fe580',
      },
      width: {
        'calc-50': 'calc(50% - 1.25rem)',
      },
      height: {
        'screen-60': '60vh',
        'screen-80': '80vh',
      },
      width: {
        'product-descrition': '38rem'
      },
      fontFamily: {
        'noto-serif-display': '"Noto Serif Display", serif',
        'raleway': '"Raleway", sans-serif',
        'ubuntu-mono': '"Ubuntu Mono", monospace'
      }
    },
  },
  plugins: [],
}

