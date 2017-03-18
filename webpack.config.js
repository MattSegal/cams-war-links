const path              = require("path")
const webpack           = require('webpack')
const BundleTracker     = require('webpack-bundle-tracker')
const combineLoaders    = require('webpack-combine-loaders');
const autoprefixer      = require('autoprefixer');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// Settings
const IS_PROD =  process.env.DEPLOY_STATUS === 'PROD'
const IS_TEST = process.env.DEPLOY_STATUS === 'TEST'
console.log('Webpack running with PROD settings: '+IS_PROD)
console.log('Webpack running with TEST settings '+IS_TEST)

// Dev config
let config = {
    context: path.resolve('./assets-src'),

    entry: './index',

    output: {
        path: path.resolve('./assets/'),
        filename: "[name]-[hash].js",
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
        new ExtractTextPlugin('[name]-[hash].css', {allChunks: true}),
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
    console.log('======= APPLYING PROD WEBPACK SETTINGS =======')
}


module.exports = config