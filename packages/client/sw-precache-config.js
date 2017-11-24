module.exports = {
  navigateFallback: '/index.html',
  stripPrefix: 'dist',
  root: 'dist/',
  staticFileGlobs: [
    'dist/index.html',
    'dist/**.js',
    'dist/**.css',
    'dist/favicon.ico'
  ],
  runtimeCaching: [{
    urlPattern: /\/v1\//,
    handler: 'fastest'
  }]
};