module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,
        modules: false,
        ...(process.env.NODE_ENV === 'test' && {
          targets: {
            node: 'current'
          }
        })
      },
    ],
  ],
  plugins: [
    process.env.NODE_ENV === 'test' &&
      '@babel/plugin-transform-modules-commonjs',
  ].filter(Boolean),
}