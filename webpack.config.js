var path = require("path");
var webpack = require("webpack");
var fs = require('fs');
var fetchUrl = require('fetch').fetchUrl;

module.exports = function (env) {
    return {
        // these are loaded in order to build the app
        entry: {
            "main": env && env.entry || "./prodrun.ts"
        },

        externals: function(context, request, callback) {
            if ( request.indexOf('http') === 0 ) {
                fetchUrl(request, function(error, meta, body){
                    if (error) {
                        throw error;
                    }
                    callback(null, body.toString());
                });
                return;
            }
            switch (request) {
                case 'FlashEEPROM':
                case 'PCD8544':
                case 'MPU6050':
                case 'MPU6050_DMP':
                case 'SH1106':
                case 'Flash':
                    return callback(null, 'require("'+request+'")');
            }
            // default
            callback();
        },

        /*
         * The combination of path and filename tells Webpack what name to give to
         * the final bundled JavaScript file and where to store this file.
         */
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "bundle.js",
            library: "Lameboy",
            libraryTarget: "var"
        },

        /*
         * resolve lets Webpack know in advance what file extensions you plan on
         * "require"ing into the web application, and allows you to drop them
         * in your code.
         */
        resolve: {
            extensions: [".ts", ".tsx", ".js"/*, ".jsx"*/],
        },

        module: {
            /*
             * Each loader needs an associated Regex test that goes through each
             * of the files you've included (or in this case, all files but the
             * ones in the excluded directories) and finds all files that pass
             * the test. Then it will apply the loader to that file. I haven't
             * installed ts-loader yet, but will do that shortly.
             */
            loaders: [
                {
                    test: /^http\:/,
                    loader: "http-loader"
                },
                {
                    exclude: /.js/,
                    loader: "ts-loader"
                }
            ],
        }
        ,
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                compress: false,
                mangle: { keep_fnames: true },
                comments: false,
                sourceMap: false
            }),
            function () {
                this.plugin("done", function (stats) {
                    console.log("Webpack done!", stats.compilation.errors);
                    if (stats.compilation.errors.length) {
                        fs.createReadStream('failed_build.js').pipe(fs.createWriteStream('dist/bundle.js'));
                    }
                });
            }
        ]
    }
}
