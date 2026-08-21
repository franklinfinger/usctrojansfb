import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cardinal: {
          DEFAULT: "#990000",
          soft: "#B31217",
          deep: "#6E0000",
        },
        gold: {
          DEFAULT: "#FFC72C",
          ink: "#C9A227",
        },
        cream: {
          DEFAULT: "#F6F1E8",
          card: "#FFFbf5",
          mute: "#EDE6D9",
        },
        ink: {
          DEFAULT: "#1A1412",
          soft: "#4A403A",
        },
      },
      fontFamily: {
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        lift: "0 18px 50px rgba(26, 20, 18, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
