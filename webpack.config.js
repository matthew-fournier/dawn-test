const WebpackWatchedGlobEntries = require('webpack-watched-glob-entries-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')
const term = require('terminal-kit').terminal

const assetsPath = path.resolve(__dirname, 'assets')

const removeFoldersFromPath = (path) => path.replace(/^.*[\\\/]/, '') // eslint-disable-line

module.exports = (env, argv) => ({
  devtool: false,
  stats: 'errors-only',
  mode: 'production',
  target: 'web',
  entry: WebpackWatchedGlobEntries.getEntries(
    [
      path.resolve(__dirname, 'scripts/theme/theme.js'),
      path.resolve(__dirname, 'scripts/sections/*.js')
    ]
  ),
  output: {
    filename: (pathData) => {
      return removeFoldersFromPath(pathData.chunk.name) + '.min.js'
    },
    path: assetsPath
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: (pathData) => {
        return removeFoldersFromPath(pathData.chunk.name) + '.min.css'
      }
    }),
    function () {
      this.hooks.watchRun.tap('WatchRun', (comp) => {
        const changedTimes = comp.watchFileSystem.watcher.mtimes
        const changedFiles = Object.keys(changedTimes)
          .map(file => `\n  ${file}`)
          .join('')
        if (changedFiles.length) {
          console.clear()
          term.green('\nWatching for changes...\n')
        }
      })
    },
    function () {
      let isFirstCompile = true
      let isFirstDone = true
      let isWatching = false

      this.hooks.watchRun.tapAsync('watchRun', (stats, callback) => {
        isWatching = true
        callback()
      })

      this.hooks.beforeCompile.tapAsync('beforeCompile', (stats, callback) => {
        if (isFirstCompile) {
          term.green('\nBuilding theme... \n')
          isFirstCompile = false
        }
        callback()
      })

      this.hooks.done.tapAsync('done', (stats, callback) => {
        if (isFirstDone) {
          if (stats.compilation.errors.length > 0) {
            console.log(stats.compilation.errors)
            process.exit(1)
          }

          const outputCommand = (command, description) => {
            term.cyan(`\n\`${command}\`: `)
            term.white(description)
          }

          if (isWatching) {
            term.cyan('\n==================================================')
            outputCommand('yarn serve', 'Launch dev theme preview')
            outputCommand('yarn push', 'Build and push to pre-exisiting theme')
            outputCommand('yarn push-new', 'Build and push to new theme')
            outputCommand('yarn pull', 'Pull down settings from a theme')
            outputCommand('shopify login', 'Authenticates you with Shopify CLI')
            outputCommand('shopify switch', 'Switch between stores without logging in/out')
            outputCommand('yarn new-section', 'Create a new section from an availiable template')
            outputCommand('yarn clone-section', 'Clone an existing section')
            term.cyan('\n==================================================')

            term.green('\n\nTheme built successfully! Ensure you are logged into the correct store above. \nThen run')
            term.cyan(' yarn serve ')
            term.green('from a new terminal')
            term.green('\n\nWatching for changes...')
          }

          isFirstDone = false
        }
        callback()
      })
    }
  ],
  resolve: {
    alias: {
      '@cart': path.resolve(__dirname, 'scripts/theme/cart'),
      '@components': path.resolve(__dirname, 'scripts/theme/components'),
      '@core': path.resolve(__dirname, 'scripts/theme/core'),
      '@storefront': path.resolve(__dirname, 'scripts/theme/storefront'),
      '@sections': path.resolve(__dirname, 'scripts/sections'),
      '@snippets': path.resolve(__dirname, 'scripts/snippets'),
      '@styles': path.resolve(__dirname, 'styles')
    },
    extensions: ['.ts', '.tsx', '.js']
  },
  watchOptions: {
    poll: true,
    ignored: ['**/assets', '**/node_modules']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/env']
        }
      },
      {
        test: /\.(sc|sa|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
              sourceMap: true
            }
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  }
})
