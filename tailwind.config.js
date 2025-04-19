// frontend/tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#34D399", // Mint green for accent
        secondary: "#6B7280", // Soft gray for text
        background: "#F9FAFB", // Light gray background
        accent: "#3B82F6", // Sky blue for buttons
        success: "#10B981", // Green for success
        warning: "#F59E0B", // Amber for warning
        error: "#EF4444", // Red for error
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-out",
        fadeInDelay: "fadeIn 1s ease-out",
        slideInLeft: "slideInLeft 0.6s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
