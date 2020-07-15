const config = require('./config')

module.exports = {
  devServer: {
    open: process.platform === 'darwin',
    host: config.host,
    port: config.port,
    https: false,
    hotOnly: false,
    proxy: config.proxy
  }
}