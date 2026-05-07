import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "var(--lithique-obsidian)",
        gold: "var(--lithique-gold)",
        "warm-white": "var(--lithique-warm-white)",
        "stone-mid": "var(--lithique-stone-mid)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        luxury: "var(--tracking-luxury)",
      },
      transitionTimingFunction: {
        relic: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        relic: "600ms",
      },
    },
  },
  plugins: [],
};
export default config;
