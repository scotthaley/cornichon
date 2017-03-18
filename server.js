/**
 * Created by Scott Haley on 3/17/2017.
 */

const express = require('express');
const Cli = require('cucumber').Cli;
const co = require('co');

module.exports = () => {
    let app = express();

    app.get('/', (req, res) => {
        co(function* () {
            const cli = new Cli({
                argv: process.argv,
                cwd: process.cwd(),
                stdout: process.stdout
            });
            const configuration = yield cli.getConfiguration();
            res.send(cli.getSupportCodeLibrary(configuration.supportCodePaths));
        }).catch(e => {
            console.log(e);
        });
    });

    app.listen(8080, () => {
        console.log('http://localhost:8080');
        require('open')('http://localhost:8080', 'chrome');
    });
}
