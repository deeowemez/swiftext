/** @type {import('tailwindcss').Config} */
export const content = ["./src/**/*.{html,js,jsx,tsx,ts}", "./index.html,"];

export const theme = {
  extend: {
    fontFamily: {
      title: ["Fredoka"],
      sserif: ["Inter", "sans-serif"],
      dmsans: ["DM Sans"],
    },
    backgroundImage: {
      "teal-gradient": "linear-gradient(to left, #AAD9D1, #017373)",
    },
    textColor: {
      transparent: "transparent",
    },
    borderColor: {
      tealOne: "#048C80",
    },
  },
};

export const plugins = [
  function ({ addUtilities }) {
    addUtilities({
      ".gradient-text": {
        "background-image": "linear-gradient(to left, #FFBF8F, #FF6D00)",
        "-webkit-background-clip": "text",
        "background-clip": "text",
        color: "transparent",
      },
    });
  },
];
