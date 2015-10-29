var minimist = require('minimist');
var defaultOptions = {
  boolean: ['minify', 'debug'],
  default: { minify: false, debug: false }
};
var options = minimist(process.argv.slice(2), defaultOptions);


var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
var OccurrenceOrderPlugin = require('webpack/lib/optimize/OccurrenceOrderPlugin');
var UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
var WebpackNotifierPlugin = require('webpack-notifier');

var path = require('path');
var buildDir = './build';
var bundle_output_name = 'bundle.js';
var mini_bundle_output_name = 'bundle.min.js';
var chunkNamePattern = "[id].lib.js";
var mini_chunkNamePattern = "[id].lib.min.js";
var lib_output_name = 'lib.bundle.js';
var mini_lib_output_nmae = 'lib.bundle.min.js';

function getWebPackModules(options) {
  var ret = [
    new OccurrenceOrderPlugin(),
    new CommonsChunkPlugin({
      name: 'lib',
      filename: options.minify ? mini_lib_output_nmae : lib_output_name,
    })
  ];

  if (options.minify) {
    ret.push(new UglifyJsPlugin({
      exclude: [],
      compress: {
        warnings: false,
      },
      comments: false,
      sourceMap: options.debug ? true : false,
      mangle: {
        except: ['$', 'exports', 'require']
      }
    }));
  }

  return ret;
}

function getWebPackConfig(options) {
  var config = {
    //for gulp access
    bundle_output_name: options.minify ? mini_bundle_output_name : bundle_output_name,
    lib_output_name: options.minify ? mini_lib_output_nmae : lib_output_name,
    //web pack config
    context: path.join(__dirname, 'src'),
    entry: {
      app: ['./ts/app.ts'],
      lib: ['hash-change', 'angular']
    },
    output: {
      publicPath: "assets/",
      path: path.join(path.resolve(buildDir), 'assets'),
      filename: options.minify ? mini_bundle_output_name : bundle_output_name,
      chunkFilename: options.minify ? mini_chunkNamePattern : chunkNamePattern
    },
    module: {
      loaders: [
        { test: /\.tsx?$/, loader: 'ts-loader' },
        { test: /\.css$/, exlcude: /\.useable\.css$/, loader: "style!css" },
        { test: /\.png$/, loader: "url-loader?limit=100000" },
        { test: /\.jpg$/, loader: "file-loader" }
      ]
    },
    plugins: getWebPackModules(options),
    resolve: {
      moduleDirectories: ['node_modules', 'bower_components', 'web_modules'],
      extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    target: "web"
  }

  if (options.debug) {
    config.devtool = 'source-map';
  }

  return config;
}

module.exports = getWebPackConfig(options);