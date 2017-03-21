/**
 * Created by Scott Haley on 3/17/2017.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const util = require('util');
const cycle = require('cycle');

const cucumber = require('./cucumber');
cucumber.init();

module.exports = () => {
    let app = express();
    app.use(cors());

    app.use('/static', express.static(path.join(__dirname, './node_modules/superplaceholder/dist/')))

    app.get('/', (req, res) => {
      res.send(util.inspect(cucumber.features[0].scenarios[0]));
    });

    app.get('/features', (req, res) => {
      res.send(cycle.decycle(cucumber.features));
    });

    app.get('/supportcode', (req, res) => {
      res.send(cucumber.supportCode);
    });

    app.listen(8088, () => {
        console.log('http://localhost:8088');
        require('open')('http://localhost:8088', 'chrome');
    });
}
