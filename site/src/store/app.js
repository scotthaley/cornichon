const $ = require('jquery')

var app = (function () {
  var url = 'http://localhost:8088/'

  function fetch (what) {
    var promise = $.ajax({
      type: 'GET',
      url: url + what,
      dataType: 'json'
    })
    return promise
  }

  var api = {
    fetch: fetch
  }

  return api
})()

export { app }
