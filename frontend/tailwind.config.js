/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "oklch(var(--background) / <alpha-value>)",
        foreground: "oklch(var(--foreground) / <alpha-value>)",
        card: {
          DEFAULT: "oklch(var(--card) / <alpha-value>)",
          foreground: "oklch(var(--card-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "oklch(var(--popover) / <alpha-value>)",
          foreground: "oklch(var(--popover-foreground) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "oklch(var(--primary) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary) / <alpha-value>)",
          foreground: "oklch(var(--secondary-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "oklch(var(--muted) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "oklch(var(--accent) / <alpha-value>)",
          foreground: "oklch(var(--accent-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground) / <alpha-value>)",
        },
        border: "oklch(var(--border) / <alpha-value>)",
        input: "oklch(var(--input) / <alpha-value>)",
        ring: "oklch(var(--ring) / <alpha-value>)",
        neon: {
          green: "#39FF14",
          dim: "oklch(0.65 0.22 142)",
          dark: "oklch(0.35 0.15 142)",
        },
        surface: {
          DEFAULT: "oklch(0.11 0.008 150)",
          elevated: "oklch(0.14 0.01 150)",
          overlay: "oklch(0.17 0.012 150)",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Courier New", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "neon-sm": "0 0 8px oklch(0.85 0.28 142 / 0.4)",
        "neon-md": "0 0 15px oklch(0.85 0.28 142 / 0.5), 0 0 30px oklch(0.85 0.28 142 / 0.2)",
        "neon-lg": "0 0 25px oklch(0.85 0.28 142 / 0.6), 0 0 50px oklch(0.85 0.28 142 / 0.3)",
        "neon-xl": "0 0 40px oklch(0.85 0.28 142 / 0.7), 0 0 80px oklch(0.85 0.28 142 / 0.4)",
        "glass": "0 8px 32px oklch(0 0 0 / 0.4), inset 0 1px 0 oklch(0.85 0.28 142 / 0.1)",
        "glass-strong": "0 8px 32px oklch(0 0 0 / 0.6), inset 0 1px 0 oklch(0.85 0.28 142 / 0.2)",
      },
      keyframes: {
        "neon-pulse": {
          "0%, 100%": { boxShadow: "0 0 15px oklch(0.85 0.28 142 / 0.4)" },
          "50%": { boxShadow: "0 0 30px oklch(0.85 0.28 142 / 0.8), 0 0 60px oklch(0.85 0.28 142 / 0.3)" },
        },
        "badge-pulse": {
          "0%, 100%": { boxShadow: "0 0 8px oklch(0.85 0.28 142 / 0.6)" },
          "50%": { boxShadow: "0 0 16px oklch(0.85 0.28 142 / 0.9), 0 0 24px oklch(0.85 0.28 142 / 0.4)" },
        },
        "scan": {
          "0%": { top: "-2px" },
          "100%": { top: "100%" },
        },
        "fade-in-down": {
          from: { opacity: "0", transform: "translateY(-20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out-up": {
          from: { opacity: "1", transform: "translateY(0)" },
          to: { opacity: "0", transform: "translateY(-20px)" },
        },
        "glow-border": {
          "0%, 100%": { borderColor: "oklch(0.85 0.28 142 / 0.3)" },
          "50%": { borderColor: "oklch(0.85 0.28 142 / 0.8)" },
        },
      },
      animation: {
        "neon-pulse": "neon-pulse 2s ease-in-out infinite",
        "badge-pulse": "badge-pulse 2s ease-in-out infinite",
        "scan": "scan 4s linear infinite",
        "fade-in-down": "fade-in-down 0.3s ease forwards",
        "fade-out-up": "fade-out-up 0.3s ease forwards",
        "glow-border": "glow-border 2s ease-in-out infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
};
