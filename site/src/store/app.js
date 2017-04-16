// const $ = require('jquery')

var app = (function () {
  var url = 'http://localhost:8088/'
  let socket = io.connect(url)

  function fetch (what) {
    return new Promise((resolve) => {
      socket.once(what, (json) => {
        resolve(json)
      })
      socket.emit(what)
    })
  }

  var api = {
    fetch,
    socket
  }

  return api
})()

export { app }
