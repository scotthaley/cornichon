/**
 * Created by Scott Haley on 3/17/2017.
 */

const {defineSupportCode} = require('cucumber');

defineSupportCode(function({Before, After}) {
    Before(function() {
        console.log('This is my before');
    });

    After(function() {
        console.log('This is my after');
    });
});