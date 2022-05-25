const webpackMerge = require('webpack-merge');
const commonConfig = require('./build/webpack.common.config');
const { cleanBrowser} = require("./build/clean")
const configs = {
  dev: require('./build/webpack.dev.config'),
  pro: require('./build/webpack.pro.config'),
  debug: require('./build/webpack.debug.config'),
};



const config = (env) => {

  cleanBrowser(env)

  process.env.NODE_ENV = "development";
  process.env.BABEL_ENV = "development";
  if (env.config == "dev") {
    process.env.TAILWIND_MODE = "watch";
  }

  if (env.config) {
    return webpackMerge.merge(commonConfig(env), configs[env.config]);
  }

  return commonConfig(env);
};

module.exports = config;
