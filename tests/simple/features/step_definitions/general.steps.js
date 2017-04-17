/**
 * Created by Scott Haley on 3/17/2017.
 */

const {defineSupportCode} = require('cucumber');

defineSupportCode(function ({Given, When, Then}) {
  Given('I\'m running a simple test', function (callback) { /* {cornichon: 0c63ca6b-6e66-2472-f521-547444334ff7} */
    let moreCode = 6;

    moreCode += 2;
    setTimeout(function () {
      console.log(`Running a simple test ${moreCode}`);
      callback()
    }, 2000)
  });

  When('I pass a parameter like {stringInDoubleQuotes}', function (param) { /* {cornichon: 074eb486-34d1-d57d-1ad2-0218e5d91a91} */
    return console.log(`Passed param: ${param}`);
  });

  When('I pass multiple parameters like {stringInDoubleQuotes} and {stringInDoubleQuotes}', function (param1, param2) {  /* {cornichon: 3b5b5ba1-1d23-e106-1dc6-192aeafbba8f} */
    return console.log(`Passed params: ${param1}, ${param2}`);
  });

  When('I make a test fail', function () { /* {cornichon: 3c67b4ba-a4a1-776e-44f7-3babe85f9b99} */
    return undefinedVariable
  })

  Then('I should see some results', function () { /* {cornichon: 98d44ebc-ca0a-9073-cbb3-7c007ce47c92} */
    return console.log('Did you see stuff?');
  });
});
