import type { Config } from 'tailwindcss';

export default <Partial<Config>>{
  content: ['./components/**/*.{js,vue,ts}', './layouts/**/*.vue', './pages/**/*.vue', './plugins/**/*.{js,ts}', './nuxt.config.{js,ts}', './app.vue'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      fontFamily: {
        sans: ['Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        primary: {
          light: '#898eff',
          DEFAULT: process.env.PRIMARY_COLOR || '#0009ff',
          dark: '#0007b4',
        },
        kanna: '#eeff87',
        gray: {
          100: '#e9e9e4',
        },
      },
      borderColor: {
        DEFAULT: '#000000',
      },
      aspectRatio: {
        '9/8': '1 / 1.125',
      },
      screens: {
        '2xl': '1400px',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
