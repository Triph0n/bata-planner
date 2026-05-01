/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                navy: {
                    DEFAULT: '#0B1B3D',
                    light: '#1A2F5A',
                    dark: '#050d21',
                },
                gold: {
                    DEFAULT: '#D4AF37',
                    light: '#F3E5AB',
                    dark: '#AA8C2C',
                },
                elegant: {
                    bg: '#F8F9FA',
                    card: '#FFFFFF',
                    text: '#2C3E50',
                }
            },
            fontFamily: {
                serif: ['Merriweather', 'serif'],
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
