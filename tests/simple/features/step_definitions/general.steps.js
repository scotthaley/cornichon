/**
 * Created by Scott Haley on 3/17/2017.
 */

const {defineSupportCode} = require('cucumber');

defineSupportCode(function ({Given, When, Then}) {
  Given('I\'m running a simple test', function () { /* {cornichon: fcfbd561-7576-7aa7-5c7b-5e6b28c28235} */
    let moreCode = 4;

    moreCode += 2;
    return console.log(`Running a simple test ${moreCode}`);
  });

  When('I pass a parameter like {stringInDoubleQuotes}', function (param) { /* {cornichon: 98f0b7a9-4753-4bc4-9dd4-15be54fb53d0} */
    return console.log(`Passed param: ${param}`);
  });

  When('I pass multiple parameters like {stringInDoubleQuotes} and {stringInDoubleQuotes}', function (param1, param2) { /* {cornichon: 1ee8249a-aac9-05bd-9a45-8d8fcc2a571e} */
    return console.log(`Passed params: ${param1}, ${param2}`);
  });


  Then('I should see some results', function () { /* {cornichon: b06e1722-ee5a-c3d9-28f5-6512aa8df87e} */
    return console.log('Did you see stuff?');
  });
});
