/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
  ],

  darkTheme: "dark",

  themes: [
    {
      light: {
        primary: "#FFFFFF",
        "primary-content": "#000000",
        secondary: "#FFA500",
        "secondary-content": "#000000",
        accent: "#FFA500",
        "accent-content": "#000000",
        neutral: "#FFFFFF",
        "neutral-content": "#000000",
        "base-100": "#FFFFFF",
        "base-200": "#FFFFFF",
        "base-300": "#FFFFFF",
        "base-content": "#000000",
        info: "#FFA500",
        success: "#34EEB6",
        warning: "#FFCF72",
        error: "#FF8863",
        ".bg-gradient-modal": {
          "background-image":
            "linear-gradient(270deg, #FFF8DC 0%, #FFA500 100%)",
        },
        ".bg-modal": {
          background: "linear-gradient(270deg, #FFF8DC 0%, #FFA500 100%)",
        },
        ".modal-border": {
          border: "1px solid #FFA500",
        },
        ".bg-gradient-nav": {
          background: "#000000",
        },
        ".bg-main": {
          background: "#FFFFFF",
        },
        ".bg-underline": {
          background: "linear-gradient(270deg, #FFF8DC 0%, #FFA500 100%)",
        },
        ".bg-container": {
          background: "transparent",
        },
        ".bg-btn-wallet": {
          background: "#FFA500",
        },
        ".bg-input": {
          background: "rgba(0, 0, 0, 0.07)",
        },
        ".bg-component": {
          background: "rgba(255, 255, 255, 0.55)",
        },
        ".bg-function": {
          background: "linear-gradient(270deg, #FFF8DC 0%, #FFA500 100%)",
        },
        ".text-function": {
          color: "#FFA500",
        },
        ".text-network": {
          color: "#FFA500",
        },
        "--rounded-btn": "9999rem",

        ".tooltip": {
          "--tooltip-tail": "6px",
        },
        ".link": {
          textUnderlineOffset: "2px",
        },
        ".link:hover": {
          opacity: "80%",
        },
        ".contract-content": {
          background: "#FFFFFF",
        },
      },
    },
    {
      dark: {
        primary: "#000000",
        "primary-content": "#FFFFFF",
        secondary: "#FFA500",
        "secondary-content": "#000000",
        accent: "#FFA500",
        "accent-content": "#000000",
        neutral: "#000000",
        "neutral-content": "#FFFFFF",
        "base-100": "#000000",
        "base-200": "#000000",
        "base-300": "#000000",
        "base-content": "#FFFFFF",
        info: "#FFA500",
        success: "#34EEB6",
        warning: "#FFCF72",
        error: "#FF8863",
        ".bg-gradient-modal": {
          background: "#000000",
        },
        ".bg-modal": {
          background: "#000000",
        },
        ".modal-border": {
          border: "1px solid #FFA500",
        },
        ".bg-gradient-nav": {
          background: "#000000",
        },
        ".bg-main": {
          background: "#000000",
        },
        ".bg-underline": {
          background: "#FFA500",
        },
        ".bg-container": {
          background: "#000000",
        },
        ".bg-btn-wallet": {
          background: "#FFA500",
        },
        ".bg-input": {
          background: "rgba(255, 255, 255, 0.07)",
        },
        ".bg-component": {
          background: "rgba(255, 255, 255, 0.05)",
        },
        ".bg-function": {
          background: "rgba(255, 165, 0, 0.37)",
        },
        ".text-function": {
          color: "#FFA500",
        },
        ".text-network": {
          color: "#FFA500",
        },

        "--rounded-btn": "9999rem",

        ".tooltip": {
          "--tooltip-tail": "6px",
          "--tooltip-color": "oklch(var(--p))",
        },
        ".link": {
          textUnderlineOffset: "2px",
        },
        ".link:hover": {
          opacity: "80%",
        },
        ".contract-content": {
          background: "#000000",
        },
      },
    },
  ],

  theme: {
    extend: {
      boxShadow: {
        center: "0 0 12px -2px rgb(0 0 0 / 0.05)",
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      backgroundImage: {
        "gradient-light": "linear-gradient(270deg, #FFF8DC 0%, #FFA500 100%)",
        "gradient-dark": "linear-gradient(90deg, #000000 0%, #000000 100%)",
        "gradient-vertical": "linear-gradient(180deg, #000000 0%, #000000 100%)",
        "gradient-icon": "linear-gradient(90deg, #000000 0%, #000000 100%)",
      },
    },
  },
};
