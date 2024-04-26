const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/ts/main.ts',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ]
    },
    optimization: {
      chunkIds: 'named',
      mangleExports: 'size',
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      filename: 'main.js',
      chunkFilename: '[name].js',
      path: path.resolve(__dirname, 'build/js'),
    },
};