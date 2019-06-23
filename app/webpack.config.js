const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const JavaScriptObfuscator = require('webpack-obfuscator');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');

const settings = {
    distPath: path.join(__dirname, "build"),
    srcPath: path.join(__dirname, "src")
};

module.exports = (env, options) => {
    const isDevMode = options.mode === "development";
    const envs = dotenv.config().parsed;
    console.log('Запуск в ' + (isDevMode ? 'Dev' : 'Prod') + '-режиме');
    console.log("Используемые переменные окружения:");
    console.log(envs);
    // reduce it to a nice object, the same as before
    const envKeys = Object.keys(envs).reduce((prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(envs[next]);
        return prev;
    }, {});
    const includeFolders = /(src|node_modules\/@vkontakte)/;
    const groupsOptions = {chunks: "all", minSize: 0, minChunks: 1, reuseExistingChunk: true, enforce: true};

    return {
        devtool: isDevMode ? "inline-source-map" : false,
        output: {
            filename: isDevMode
                ? "[name].js"
                : "[name].min.js",
            path: __dirname + '/build'
        },
        module: {
            rules: [
                /*{
                    test: /\.tsx?$/,
                    use: ["babel-loader", "ts-loader", "tslint-loader"]
                },*/
                {
                    test: /\.js$/,
                    exclude: /(build)/,
                    include: includeFolders,
                    loader: 'babel-loader',
                    options: {
                        compact: true
                    }
                },
                {
                    test: /\.(le|sc|c)ss$/,
                    use: [
                        "style-loader",
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: isDevMode
                            }
                        },
                        {
                            loader: "postcss-loader",
                            options: {
                                plugins: [
                                    require("autoprefixer")()
                                ],
                                sourceMap: isDevMode
                            }
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: isDevMode
                            }
                        }
                    ]
                },
                /*{
                    test: /\.(ttf|eot|woff|woff2)$/,
                    use: {
                        loader: "file-loader",
                        options: {
                            name: "fonts/[name].[ext]",
                        },
                    },
                },*/
                {
                    test: /\.(jpe?g|png|gif|svg|ico)$/i,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                outputPath: "assets/"
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin(envKeys),
            new CleanWebpackPlugin([settings.distPath], {
                verbose: true
            }),
            new HtmlWebpackPlugin({
                template: path.join(__dirname, "public/index.html")
            }),
            // new JavaScriptObfuscator({
            //     rotateUnicodeArray: false
            // })
        ],
        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    parallel: true,
                })
            ],
            splitChunks: {
                cacheGroups: {
                    homePage: {test: /[\\/]src\/Pages\/Home[\\/]/, name: "homePage", ...groupsOptions},
                    vendors: {test: /[\\/]node_modules[\\/]/, name: 'vendors', ...groupsOptions}
                },
            },
        },
    };
};