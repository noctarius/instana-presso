'use strict';

require('instana-nodejs-sensor')({
    reportUncaughtException: true
});

const fs = require("fs");
const {request, notifyUI, app} = require("./support.js");

const coordinatorService = "http://coordinatorservice.espresso-machine.svc.cluster.local";

app.get("/machine", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/espresso", (req, res) => {
    let clientId = req.query.clientId;
    let brewerId = req.query.brewerId;

    notifyUI(brewerId, true);

    request(`${coordinatorService}/makecoffee?clientId=${clientId}&brewerId=${brewerId}`)
        .then(r => res.status(r.statusCode)
            .send(r.body), err => res.status(500).send(err))
});

app.get("/espresso.jpg", (req, res) => {
    res.sendFile(__dirname + "/public/espresso.jpg");
});

app.get("/machine.jpg", (req, res) => {
    res.sendFile(__dirname + "/public/machine.jpg");
});

app.listen(3000, "0.0.0.0", (err) => {
    if (err) throw err;
    console.log(`Listening on port 3000.`);
});
