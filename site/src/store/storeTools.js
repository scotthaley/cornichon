/**
 * Created by scotthaley on 7/15/17.
 */

const config = require('../../../config')

const storeTools = (function () {
  let url = `http://localhost:${config.port}`
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

export { storeTools }
