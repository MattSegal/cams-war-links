
const path              = require("path")
const webpack           = require('webpack')
const BundleTracker     = require('webpack-bundle-tracker')
const combineLoaders    = require('webpack-combine-loaders');
const autoprefixer      = require('autoprefixer');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// Settings
const IS_PROD =  process.env.ENVIRONMENT_TYPE === 'PROD'
const IS_TEST = process.env.ENVIRONMENT_TYPE === 'TEST'

// Dev config
let config = {
    context: path.resolve('./assets-src'),

    entry: './index',

    output: {
        path: path.resolve('./assets/'),
        filename: "[name].js",
    },
    
    postcss: [
        autoprefixer({
          browsers: ['last 3 versions', 'safari >= 8', 'ie > 8'],
          flexbox: 'no-2009',
          remove: false
        })
    ],

    module: {
        loaders: [
            { 
                test: /\.jsx?$/, 
                exclude: /node_modules/, 
                loader: 'babel-loader', 
                query: { presets:['react','es2015','stage-2'] }
                // stage 2 so we can use JS spread operator 
            }, 
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract("style-loader", combineLoaders([
                        {
                            loader: 'css-loader?-autoprefixer&localIdentName=[name]__[local]',
                        },
                        {
                            loader: 'postcss-loader',
                        },
                        {
                            loader: 'sass-loader',
                        }
                    ])
                )
            }
        ],
    },
    plugins: [
        new ExtractTextPlugin('[name].css', {allChunks: true}),
        new BundleTracker({filename: './webpack-stats.json'})
    ],
    resolve: {
        root: [
            path.resolve('./assets-src'),
        ],
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js', '.jsx','.scss'],
    },
}


if (IS_TEST || IS_PROD)
{
    console.log('Webpack - applying TEST settings')
    config.output.filename = "[name]-[hash].js"
    config.plugins[0] = new ExtractTextPlugin(
        '[name]-[hash].css',
        {allChunks: true}
    )
}


if (IS_PROD)
{
    console.log('Webpack - applying PROD settings')
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
}


module.exports = config