import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cardinal: "#990000",
        gold: "#FFC72C",
        ink: "#0E0E0E",
      },
    },
  },
  plugins: [],
};

export default config;
