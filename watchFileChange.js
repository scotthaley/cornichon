const watchFileChange = (function(){
  const cucumber = require('./cucumber')
  var chokidar = require('chokidar')
    var watcher = chokidar.watch('.', {
      ignored: /[\/\\]\./,
      persistent: true
    })

    watcher
      .on('change', path => cucumber.init())

})()

module.exports = watchFileChange
