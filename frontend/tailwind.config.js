/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
      colors: {
        'primary': '#00A651',     
        'secondary': '#E6FFE0',   
        'hover': '#009147',       
        'accent': '#B8F5C8',
        'accent-2': '#F0FFF0'       
      }
  	}
  },
}