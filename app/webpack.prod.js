const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack           = require('webpack')
const baseConfig 		= require('./webpack.config.js');

let config = Object.assign({}, baseConfig);

config.output.filename = "[name]-[hash].js"
config.plugins[0] = new ExtractTextPlugin(
    '[name]-[hash].css',
    {allChunks: true}
)
const uglifyConfig = {
  compress: {
    booleans: true,
    conditionals: true,
    dead_code: true,
    drop_console: true,
    evaluate: true,
    if_return: true,
    join_vars: true,
    loops: true,
    sequences: true,
    unused: true,
    warnings: false
  },
  sourceMap: false,
  mangle: true
}
const uglifyPlugins = [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(uglifyConfig)
]
config.plugins = config.plugins.concat(uglifyPlugins)

module.exports = config
