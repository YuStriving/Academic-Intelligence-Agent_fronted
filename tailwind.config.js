/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sidebar: '#1a2538',
        'sidebar-hover': '#243347',
        'sidebar-active': '#2d4059',
      }
    },
  },
  plugins: [],
}
