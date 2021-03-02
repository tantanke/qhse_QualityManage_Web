const fs = require('fs')
const fse = require('fs-extra')
if (fs.existsSync('./build')) {
  fse.removeSync('./build')
}
fse.copySync('./dist', './build')
if (fs.existsSync('./dist')) {
  fse.removeSync('./dist')
}