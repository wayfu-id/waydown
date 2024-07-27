const path = require("path");
const webpack = require("webpack");
const fs = require("fs");
const TerserPlugin = require("terser-webpack-plugin");

let { name, version, author } = JSON.parse(fs.readFileSync("package.json", "utf8"));

module.exports = {
    entry: {
        waydown: path.resolve(__dirname, "index.ts"),
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: [/node_modules/],
                loader: "ts-loader",
            },
        ],
    },
    resolve: { extensions: [".ts", ".js"] },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index.min.js",
        library: {
            name: "Waydown",
            type: "umd",
            export: "default",
            umdNamedDefine: true,
        },
        clean: true,
    },
    devtool: "source-map",
    plugins: [
        new webpack.DefinePlugin({
            __VERSION__: JSON.stringify(`${version}`),
        }),
        new webpack.BannerPlugin({
            banner: `${name} v${version} - (c) ${author}, ISC License`,
        }),
    ],
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        keep_classnames: false,
                        keep_fnames: true,
                    },
                },
                extractComments: false,
            }),
        ],
    },
    externals: {
        "@wayfu/wayfu-dom": "DOM",
    },
};
