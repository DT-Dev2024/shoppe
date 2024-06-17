/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    'node_modules/flowbite-react/lib/esm/**/*.js',
  ],
  theme: {
    colors: {
      main: '#fb6445',
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require('flowbite/plugin')],
}
