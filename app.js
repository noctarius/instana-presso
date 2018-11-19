require('instana-nodejs-sensor')({
    reportUncaughtException: true
});

const morgan = require('morgan');
const express = require('express');
const r = require('request');

const app = express();

app.use(morgan('combined'));

app.get("/espresso", (req, res) => {
    request(`http://coordinatorservice.espresso-machine.svc.cluster.local/makecoffee`)
        .then(r => res.status(r.statusCode).send(r.body), err => res.status(500).send(err))
});

app.get("/espresso.jpg", (req, res) => {
    res.sendfile(__dirname + "/public/espresso.jpg");
});

app.listen(3000, "0.0.0.0", (err) => {
    if (err) throw err;
    console.log(`Listening on port 3000.`);
});

const request = (uri, options) => new Promise((resolve, reject) => {
    r(uri, options, (err, res) => {
        if (err) return reject(err);
        resolve(res);
    });
});
