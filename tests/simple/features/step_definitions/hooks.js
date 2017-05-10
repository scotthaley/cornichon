/**
 * Created by Scott Haley on 3/17/2017.
 */

const {defineSupportCode} = require('cucumber')
let test = process.env.test

defineSupportCode(function ({Before, After}) {
  Before(function () {
    console.log(`This is my before ${test}`)
  })

  After(function () {
    console.log('This is my after')
  })
})
