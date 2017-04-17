const watchFileChange = function(cb){
  const cucumber = require('./cucumber')
  var chokidar = require('chokidar')
  var watcher = chokidar.watch('.', {
    ignored: /[\/\\]\./,
    persistent: true
  })

  watcher
    .on('change', async function() {
      await cucumber.init()
      cb();
    })
    .on('error', function(error) {console.error('Error happened', error)})

}

module.exports = watchFileChange
