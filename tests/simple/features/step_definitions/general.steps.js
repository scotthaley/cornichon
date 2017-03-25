/**
 * Created by Scott Haley on 3/17/2017.
 */

const {defineSupportCode} = require('cucumber');

defineSupportCode(function ({Given, When, Then}) {
  Given('I\'m running a simple test', function () { /* {cornichon: 1490418241081} */
    let moreCode = 4;

    moreCode += 2;
    return console.log(`Running a simple test ${moreCode}`);
  });

  When('I pass a parameter like {stringInDoubleQuotes}', function (param) { /* {cornichon: 1490418306512} */
    return console.log(`Passed param: ${param}`);
  });

  Then('I should see some results', function () { /* {cornichon: 1490418241119} */
    return console.log('Did you see stuff?');
  });
});
