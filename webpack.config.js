const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const WebpackWatchedGlobEntries = require('webpack-watched-glob-entries-plugin')
const path = require('path')
const term = require('terminal-kit').terminal

const assetsPath = path.resolve(__dirname, 'assets')

const removeFoldersFromPath = (path) => path.replace(/^.*[\\\/]/, '') // eslint-disable-line

module.exports = (env, argv) => ({
  devtool: argv.mode === 'development' ? 'eval-cheap-source-map' : 'none',
  stats: argv.mode === 'development' ? 'errors-only' : { children: false },
  entry: WebpackWatchedGlobEntries.getEntries(
    [
      path.resolve(__dirname, 'scripts/theme/theme.js')
    ]
  ),
  output: {
    filename: (pathData) => {
      return '/' + removeFoldersFromPath(pathData.chunk.name) + '.js'
    },
    path: assetsPath
  },
  plugins: [
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
            outputCommand('yarn sync', 'Pull down settings from a theme')
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
      '@scripts': path.resolve(__dirname, 'scripts')
    },
    extensions: ['.ts', '.tsx', '.js']
  },
  watchOptions: {
    poll: true,
    ignored: ['**/node_modules']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['@babel/env']
        }
      }
    ]
  }
})
