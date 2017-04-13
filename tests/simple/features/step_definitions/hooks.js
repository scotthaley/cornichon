/**
 * Created by Scott Haley on 3/17/2017.
 */

const {defineSupportCode} = require('cucumber')
const fileStart = 'include'
const basePath = `../../${fileStart}`
const includedText = require(basePath + 'This')

defineSupportCode(function ({Before, After}) {
  Before(function () {
    console.log(`This is my before (${includedText}`)
  })

  After(function () {
    console.log('This is my after')
  })
})
