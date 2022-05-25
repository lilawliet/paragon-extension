const path = require('path');
const fs = require('fs');
const getPublicUrlOrPath = require('react-dev-utils/getPublicUrlOrPath');
// const publicUrlOrPath = getPublicUrlOrPath(
//   process.env.NODE_ENV === 'development',
//   require(resolveApp('package.json')).homepage,
//   process.env.PUBLIC_URL
// );
const appRoot = fs.realpathSync(process.cwd());

const rootResolve = path.resolve.bind(path, appRoot);

// const appDirectory = fs.realpathSync(process.cwd());
// const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const buildPath = 'dist';

const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
];

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find(extension =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};
// module.exports = {
//   root: appRoot,
//   src: rootResolve('src'),
//   popupHtml: rootResolve('src/ui/popup.html'),
//   notificationHtml: rootResolve('src/ui/notification.html'),
//   indexHtml: rootResolve('src/ui/index.html'),
//   backgroundHtml: rootResolve('src/background/background.html'),
//   dist: rootResolve('dist'),

//   rootResolve,
// }


function getBrowserPaths(browser) {
  let ret = {
    root: appRoot,
    src: rootResolve('src'),
    indexHtml: rootResolve('_raw/index.html'),
    backgroundHtml: rootResolve('src/background/background.html'),
    dist: rootResolve('dist/'+browser),
    rootResolve,
    dotenv: rootResolve('.env'),
    appPath: rootResolve('.'),
    appBuild: rootResolve(buildPath),
    appPublic: rootResolve('public'),
    appHtml: rootResolve('public/index.html'),
    appPackageJson: rootResolve('package.json'),
    appSrc: rootResolve('src'),
    appTsConfig: rootResolve('tsconfig.json'),
    appJsConfig: rootResolve('jsconfig.json'),
    yarnLockFile: rootResolve('yarn.lock'),
    proxySetup: rootResolve('src/setupProxy.js'),
    appNodeModules: rootResolve('node_modules'),
    appWebpackCache: rootResolve('node_modules/.cache'),
    appTsBuildInfoFile: rootResolve('node_modules/.cache/tsconfig.tsbuildinfo'),
    // publicUrlOrPath,
  };
  return ret;
}

module.exports = {
  getBrowserPaths
}
