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
        '4_5': '1.125rem',
        '11': '2.75rem'
      },
      lineHeight: {
        '5_5': '1.375rem',
        '6_5': '1.625rem',
      },
      height: {
        '200': '50rem',
        '15_5': '3.875rem',
        '15': '3.75rem',
        '13': '3.25rem',
        '12_5': '3.125rem',
        '8_5': '2.125rem',
        '2_5': '0.625rem'
      },
      width: {
        '125': '31.25rem',
        '110': '27.5rem',
        '95': '23.75rem',
        '85': '21.75rem',
        '15': '3.75rem',
        '2_5': '0.625rem'
      },
      padding: {
        '52_5': '13.125rem',
        '45': '11.25rem',
        '33_75': '8.4375rem',
        '15': '3.75rem',
        '4_75': '1.1875rem',
        '2_5': '0.625rem'
      },
      margin: {
        '15': '3.75rem',
        '2_5': '0.625rem'
      },
      inset: {
        '15': '3.75rem'
      },
      gap: {
        '10': '2.5rem',
        '3_75': '0.9375rem',
        '2_5': '0.625rem'
      }
    },
  },
  plugins: [],
}
