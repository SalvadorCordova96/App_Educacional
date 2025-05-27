// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html', // Busca clases en tu HTML principal
    './src/**/*.{js,jsx,ts,tsx}', // Busca clases en todos los archivos JS/JSX/TS/TSX dentro de src/
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
