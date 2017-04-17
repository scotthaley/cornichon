/**
 * Created by Scott Haley on 3/17/2017.
 */

const {defineSupportCode} = require('cucumber');

defineSupportCode(function ({Given, When, Then}) {
  Given('I\'m running a simple test', function (callback) { /* {cornichon: 98ef571d-7fc6-2d9e-a2e6-562c16bad415} */ /* {cornichon: 1492446436371} */ /* {cornichon: 1492446436390} */ /* {cornichon: 1492446436411} */
    let moreCode = 6;

    moreCode += 2;
    setTimeout(function () {
      console.log(`Running a simple test ${moreCode}`);
      callback()
    }, 2000)
  });

  When('I pass a parameter like {stringInDoubleQuotes}', function (param) { /* {cornichon: d69d6202-e292-528b-83ec-8d728e11d6f3} */ /* {cornichon: 1492446436375} */ /* {cornichon: 1492446436393} */ /* {cornichon: 1492446436414} */
  });

  When('I pass multiple parameters like {stringInDoubleQuotes} and {stringInDoubleQuotes}', function (param1, param2) { /* {cornichon: 098b3174-8654-d46f-b4d0-07432ccd49ff} */ /* {cornichon: 1492446436377} */ /* {cornichon: 1492446436395} */ /* {cornichon: 1492446436416} */
  });


  Then('I should see some results', function () { /* {cornichon: 55061547-54f1-2716-b530-662092d55227} */ /* {cornichon: 1492446436381} */ /* {cornichon: 1492446436398} */ /* {cornichon: 1492446436419} */
    return console.log('Did you see stuff?');
  });
});
