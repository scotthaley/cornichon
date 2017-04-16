/**
 * Created by Scott Haley on 3/17/2017.
 */

const {defineSupportCode} = require('cucumber');

defineSupportCode(function ({Given, When, Then}) {
  Given('I\'m running a simple tests', function () { /* {cornichon: 1490418241081} */
    let moreCode = 4;

    moreCode += 2;
    return console.log(`Running a simple test ${moreCode}`);
  });

  When('I pass a parameter like {stringInDoubleQuotes}', function (param) { /* {cornichon: 1490472816253} */
    return console.log(`Passed param: ${param}`);
  });

  When('I pass multiple parameters like {stringInDoubleQuotes} and {stringInDoubleQuotes}', function (param1, param2) { /* {cornichon: 1492181081384} */
    return console.log(`Passed params: ${param1}, ${param2}`);
  });


  Then('I should see some results', function () { /* {cornichon: 1490418241119} */
    return console.log('Did you see stuff?');
  });
});
