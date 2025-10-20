module.exports = {
  // ...
  safelist: [
    "bg-red-500/15",
    "border-red-400/40",
    "text-red-300",
    "bg-red-400",
    "bg-indigo-500/12",
    "border-indigo-400/30",
    "text-indigo-300",
    "bg-indigo-400",
    // add all color classes you plan to use
  ],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("tailwind-scrollbar")],
};
