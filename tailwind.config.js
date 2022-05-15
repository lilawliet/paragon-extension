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
        'warn': '#FA701A',
        'warning': '#FA701A'
      },
      fontSize: {
        main: '18px'
      },
      lineHeight: {
        main: '22px'
      }
    },
  },
  plugins: [],
}
