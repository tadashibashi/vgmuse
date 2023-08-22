/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            keyframes: {
                "hover": {
                    "0%, 100%": { transform: "translateY(0)"},
                    "50%": { transform: "translateY(-4px)"},
                },
                "shadow-hover": {
                    "0%, 100%": { background: "rgba(117,117,117,0.47)", filter: "blur(7px)"},
                    "50%": { background: "rgba(155,155,155,0.4)", filter: "blur(8px)"},
                }
            },
            animation: {
                "hover-slow": "hover 5s ease-in-out infinite",
                "shadow-hover-slow": "shadow-hover 5s ease-in-out infinite",
            }
        },
    },
    plugins: ["@tailwindcss/forms"],
}
