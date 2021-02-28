const path = require('path')
const fs = require('fs')

const files = fs.readdirSync('./sandbox/web/')


const targetFiles = files.filter(function(file) {
  return path.extname(file).toLowerCase() === '.js';
});

const entry = {}
targetFiles.forEach(filename => {
  const name = filename.substr(0, filename.lastIndexOf("."))
  entry[name] = `./sandbox/web/${filename}`
})




module.exports = {
  entry: entry,
  mode: 'development',
  output: {
    filename: '[name].bundle.js',
    publicPath: '/',
  },
  devServer: {
    contentBase: './sandbox/web',
    historyApiFallback: true,
    port: 9000,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              // '@babel/plugin-syntax-dynamic-import',
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    alias: {
      'raw': path.resolve(__dirname, 'src'),
    },
  },
}

