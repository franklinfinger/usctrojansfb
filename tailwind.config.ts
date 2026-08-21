import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cardinal: {
          DEFAULT: "#990000",
          soft: "#B31212",
          deep: "#6B0000",
        },
        gold: {
          DEFAULT: "#FFC72C",
          soft: "#FFE08A",
          muted: "#C9A227",
        },
        ink: {
          DEFAULT: "#070708",
          elev: "#121214",
          card: "#17171A",
          line: "#2A2A2E",
        },
      },
      boxShadow: {
        glow: "0 0 40px rgba(153, 0, 0, 0.35)",
        card: "0 10px 40px rgba(0,0,0,0.45)",
      },
      backgroundImage: {
        "hero-mesh":
          "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(153,0,0,0.55), transparent 60%), radial-gradient(ellipse 50% 40% at 100% 0%, rgba(255,199,44,0.12), transparent 50%)",
        "card-shine":
          "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 40%)",
      },
      fontFamily: {
        sans: ["var(--font-geist)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
