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
          DEFAULT: "#F0C14B",
          bright: "#FFD76A",
          ink: "#8A6A12",
        },
        cream: {
          DEFAULT: "#F4EFE6",
          card: "#FFFcf7",
          mute: "#E8E0D2",
        },
        ink: {
          DEFAULT: "#1A1412",
          soft: "#5C524C",
          faint: "#8A8178",
        },
      },
      fontFamily: {
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        lift: "0 12px 40px rgba(26, 20, 18, 0.10)",
        card: "0 1px 0 rgba(26,20,18,0.04), 0 8px 24px rgba(26,20,18,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
