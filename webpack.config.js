const path              = require("path")
const webpack           = require('webpack')
const BundleTracker     = require('webpack-bundle-tracker')
const combineLoaders    = require('webpack-combine-loaders');
const autoprefixer      = require('autoprefixer');

module.exports = {
    context: path.resolve('./assets-src'),

    entry: './js/index',

    output: {
        path: path.resolve('./assets-build/js/'),
        filename: "[name]-[hash].js",
    },

    plugins: [
        new BundleTracker({filename: './webpack-stats.json'})
    ],

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
                loader: combineLoaders([
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader?-autoprefixer&localIdentName=[name]__[local]-[sha1:hash:hex:8]',
                    },
                    {
                        loader: 'postcss-loader',
                    },
                    {
                        loader: 'sass-loader',
                    },
                ])
            },
        ],
    },

    resolve: {
        root: [path.resolve('./assets-src/js')],
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js', '.jsx','.scss'],
    },
}