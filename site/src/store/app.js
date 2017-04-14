var app = (function () {
  function test () {
    console.log('hi')
  }

  var api = {
    test: test
  }

  return api
})()

export { app }
