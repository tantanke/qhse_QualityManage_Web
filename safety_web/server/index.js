const compression = require('compression')
const express = require('express')
const proxyMiddleware = require('http-proxy-middleware')

const config = require('../config')
const port = config.port
const proxyTable = config.proxy;

const app = express()

app.use(require('connect-history-api-fallback')())
app.use(compression())

Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(context, options))
})

app.use('/', express.static('./build', {
  cacheControl: false,
  etag: false,
  lastModified: false
}))

if (process.env.NODE_ENV === 'production') {
  process.on('uncaughtException', function (err) {
    console.log(err)
  })
}

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})
