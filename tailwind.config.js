module.exports = {
  // purge: [
  //   './src/**/*.html',
  //   './src/**/*.js',
  // ],
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#FA701A',
        'hard-black': '#1C1919',
        'soft-black': '#231F1F',
        'soft-white': '#AAAAAA',
        'custom-green': '#4BB21A',
        'custom-green-rgba': 'rgba(75, 178, 26, 0.05)',
        'warn': '#FA701A',
        'warning': '#FA701A'
      },
      fontSize: {
        '4_5': '1.125rem'
      },
      lineHeight: {
        '5_5': '1.375rem',
        '6_5': '1.625rem',
      },
      height: {
        '200': '50rem',
        '15_5': '3.875rem',
        '15': '3.75rem',
        '12_5': '3.125rem',
      },
      width: {
        '125': '31.25rem',
        '95': '23.75rem',
        '15': '3.75rem'
      },
      padding: {
        '45': '11.25rem',
        '33_75': '8.4375rem',
        '15': '3.75rem',
        '4_75': '1.1875rem'
      },
      margin: {
        '15': '3.75rem'
      },
      inset: {
        '15': '3.75rem'
      }
    },
  },
  plugins: [],
}
