/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          main: '#080A0C',
          card: '#111417',
          sub: '#161A1E',
          hover: '#1C2228',
        },
        brand: {
          mint: '#64F5B3',
          'mint-hover': '#4ee6a0',
          'mint-dim': 'rgba(100, 245, 179, 0.12)',
          blue: '#78A9FF',
          'blue-dim': 'rgba(120, 169, 255, 0.12)',
        },
        content: {
          primary: '#F5F7F8',
          secondary: '#949CA6',
          muted: '#636C78',
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.08)',
          light: 'rgba(255, 255, 255, 0.15)',
          mint: 'rgba(100, 245, 179, 0.3)',
        }
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace',
        ],
      },
      boxShadow: {
        'glow-mint': '0 0 25px -5px rgba(100, 245, 179, 0.15)',
        'glow-blue': '0 0 25px -5px rgba(120, 169, 255, 0.15)',
        'card-subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
};
