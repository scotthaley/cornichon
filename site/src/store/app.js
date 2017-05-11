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

  function post (what, data, tester) {
    return new Promise((resolve) => {
      registerListener(what, resolve, tester)
      socket.emit(what, data)
    })
  }

  function registerListener (what, cb, tester) {
    socket.once(what, (json) => {
      if (!tester || tester(json)) {
        cb(json)
      } else {
        if (tester(json)) {
          cb(json)
        } else {
          registerListener(what, cb, tester)
        }
      }
    })
  }

  var api = {
    fetch,
    post,
    socket
  }

  return api
})()

export { app }
