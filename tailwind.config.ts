import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#0A0A0F",
          50: "#F8F8FF",
          100: "#E8E8F0",
          200: "#C8C8DA",
          300: "#9898B0",
          400: "#606080",
          500: "#3A3A55",
          600: "#252535",
          700: "#18182A",
          800: "#12121E",
          900: "#0A0A0F",
          950: "#050508",
        },
        violet: {
          DEFAULT: "#7C3AED",
          50: "#F5F0FF",
          100: "#EDE5FF",
          200: "#D5BFFF",
          300: "#B794FF",
          400: "#9F6AFF",
          500: "#7C3AED",
          600: "#6620D4",
          700: "#5010B8",
          800: "#3B0A8A",
          900: "#280560",
        },
        coral: {
          DEFAULT: "#FF4D6D",
          50: "#FFF0F3",
          100: "#FFE0E7",
          200: "#FFB8C8",
          300: "#FF8AA6",
          400: "#FF6485",
          500: "#FF4D6D",
          600: "#E6304F",
          700: "#C02040",
          800: "#951530",
          900: "#6A0B22",
        },
        cyan: {
          DEFAULT: "#00D4FF",
          50: "#F0FEFF",
          100: "#CCFBFF",
          200: "#88F4FF",
          300: "#44EDFF",
          400: "#00E4FF",
          500: "#00D4FF",
          600: "#00AACC",
          700: "#007F99",
          800: "#005566",
          900: "#002B33",
        },
        emerald: {
          DEFAULT: "#10B981",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-violet": "linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)",
        "gradient-coral": "linear-gradient(135deg, #FF4D6D 0%, #C02040 100%)",
        "gradient-hero": "linear-gradient(135deg, #0A0A0F 0%, #18182A 50%, #0A0A0F 100%)",
        "glow-violet": "radial-gradient(ellipse at center, rgba(124,58,237,0.15) 0%, transparent 70%)",
        "glow-coral": "radial-gradient(ellipse at center, rgba(255,77,109,0.15) 0%, transparent 70%)",
        "card-shine": "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%)",
      },
      boxShadow: {
        "violet-glow": "0 0 30px rgba(124,58,237,0.3), 0 0 60px rgba(124,58,237,0.1)",
        "coral-glow": "0 0 30px rgba(255,77,109,0.3), 0 0 60px rgba(255,77,109,0.1)",
        "cyan-glow": "0 0 20px rgba(0,212,255,0.3)",
        "card": "0 4px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04) inset",
        "card-hover": "0 8px 40px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.06) inset",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 8s linear infinite",
        "shimmer": "shimmer 2s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "score-fill": "score-fill 1.5s ease-out forwards",
        "slide-up": "slide-up 0.4s ease-out forwards",
        "fade-in": "fade-in 0.3s ease-out forwards",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(124,58,237,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(124,58,237,0.6), 0 0 80px rgba(124,58,237,0.2)" },
        },
        "score-fill": {
          "0%": { strokeDashoffset: "283" },
          "100%": { strokeDashoffset: "var(--score-offset)" },
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
