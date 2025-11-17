/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.html",
    "./**/*.js",
    "!./node_modules/**/*",
    "!./dist/**/*"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary:'#e6b15f',
        secondary:'#131818',
        accent:'#18312e',
      }
    }
  },
  corePlugins: {
    direction: true,
  }
}