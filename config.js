module.exports = {
  port: 6001,
  host: '0.0.0.0',
  proxy: {
    '/api': {
      // target: 'http://39.98.173.131:7000',
      target: 'http://39.98.173.131:7000',
      pathRewrite: {'^/api' : '/wlhse/api/v3'},
      changeOrigin: true
    }
  }
}