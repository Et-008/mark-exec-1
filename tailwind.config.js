// tailwind.config.js
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Removed html files from the path as index.css and codebase use JSX/TSX
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
