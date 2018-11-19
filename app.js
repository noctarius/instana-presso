require('instana-nodejs-sensor')({
    reportUncaughtException: true
});

const morgan = require('morgan');
const express = require('express');
const app = express();
const r = require('request');

app.use(morgan('combined'));

const waterHandling = (res) => {
    let timeout = 5000;
    let message = "water's flowing down the river, brewing now\n";
    if (res.body === "true") {
        timeout = 3000;
        message = "the flood's coming, let's get some popcorn and I brew the espresso\n";
    }
    return delay(timeout).then(() => message);
};

app.get('/brew', (req, res) => {
    delay(500)
        .then(() => request("http://waterservice.espresso-machine.svc.cluster.local/dispense"))
        .then(res => waterHandling(res), err => {
            res.status(500).send(`water is not available: ${err}\n`);
        })
        .then(message => res.send(message));
});

app.listen(3000, "0.0.0.0", (err) => {
    if (err) throw err;
    console.log(`Listening on port 3000.`);
});

const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));
const request = (uri, options) => new Promise((resolve, reject) => {
    r(uri, options, (err, res) => {
        if (err) return reject(err);
        resolve(res);
    });
});