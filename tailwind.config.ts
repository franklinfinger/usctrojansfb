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
        // Deeper, multi-layer elevation for standalone feature cards.
        elevated:
          "0 1px 0 rgba(26,20,18,0.05), 0 4px 10px rgba(26,20,18,0.08), 0 20px 48px -12px rgba(26,20,18,0.20)",
        // For light cards floating on a dark section — a dark shadow alone
        // barely reads there, so pair it with a thin gold hairline ring.
        glow: "0 0 0 1px rgba(240,193,75,0.25), 0 24px 48px -12px rgba(0,0,0,0.55)",
      },
      // Non-default opacity steps used by @apply rules in globals.css.
      // Tailwind's @apply only resolves modifiers present in this scale —
      // unlike direct className usage, it can't fall back to arbitrary JIT values.
      opacity: {
        6: "0.06",
        8: "0.08",
        35: "0.35",
        55: "0.55",
      },
    },
  },
  plugins: [],
};

export default config;
