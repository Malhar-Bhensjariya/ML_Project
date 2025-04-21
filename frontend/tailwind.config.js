module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
        },
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          500: '#a855f7',
          600: '#9333ea',
          800: '#6b21a8',
        },
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          800: '#1e40af',
        },
        cyan: {
          50: '#ecfeff',
          100: '#cffafe',
          500: '#06b6d4',
          800: '#155e75',
        },
      },
      animation: {
        'pulse': 'pulse 2s infinite',
        'gradient-flow': 'gradientFlow 10s ease infinite',
      },
      keyframes: {
        gradientFlow: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        }
      },
      backgroundImage: {
        'gradient-teacher': 'linear-gradient(135deg, #1a1c2e 0%, #2b2f4c 100%)',
        'gradient-student': 'linear-gradient(135deg, #f6f8fd 0%, #f0f4ff 100%)',
        'gradient-primary': 'linear-gradient(to right, #7B61FF, #007BFF)',
        'gradient-live': 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      }
    },
  },
  plugins: [],
}
