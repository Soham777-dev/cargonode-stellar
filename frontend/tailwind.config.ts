import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0a7cff",
        secondary: "#1a1a2e",
        accent: "#00d4aa",
      },
      screens: {
        // Mobile: 320-640px (default sm breakpoint)
        'mobile': '320px',
        // Tablet: 641-1024px
        'tablet': '641px',
        // Desktop: 1025px+
        'desktop': '1025px',
      },
    },
  },
  plugins: [],
};

export default config;
