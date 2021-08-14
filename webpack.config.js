const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    background: "./src/background.ts",
    main: "./src/main.tsx",
  },
  output: {
    path: `${__dirname}/dist`,
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.ts(x)?$/,
        use: "ts-loader"
      },
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                ident: 'postcss',
                plugins: [
                  require('tailwindcss'),
                  require('autoprefixer'),
                ],
              },
            },
          }
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        loader: "file-loader",
        options: {
          name: "images/[hash]-[name].[ext]",
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
    fallback: {
      "assert": require.resolve("assert/"),
      "buffer": require.resolve("buffer/"),
      "crypto": require.resolve("crypto-browserify"),
      "fs": false,
      "fsevents": false,
      "os": require.resolve("os-browserify/browser"),
      "path": require.resolve("path-browserify"),
      "stream": require.resolve("stream-browserify"),
      "url": require.resolve("url/"),
      "util": require.resolve("util/"),
    },
    modules: [
      path.resolve("./node_modules"),
      path.resolve("./src"),
    ],
  },
  target: ["web", "es5"],
}

// ソースマップ必要な時
// module.exports.devtool = "inline-source-map";
