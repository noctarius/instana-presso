require('instana-nodejs-sensor')({
    reportUncaughtException: true
});

const morgan = require('morgan');
const express = require('express');
const r = require('request');

const WebSocket = require('ws');

const app = express();
const expressWs = require('express-ws')(app);

app.use(morgan('combined'));

const clientMapping = {};

app.ws("/ws", (ws, req) => {
    let clientId = req.query.clientId;
    clientMapping[clientId] = ws;

    ws.onclose = () => {
        delete clientMapping[clientId];
    }
});

const wss = new WebSocket('http://coordinatorservice.espresso-machine.svc.cluster.local/ws');
wss.onmessage = (event) => {
    let ev = event.data;
    let clientId = ev.clientId;
    let msg = ev.msg;

    let ws = clientMapping[clientId];
    if (ws) {
        ws.send(msg);
    }
};

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/espresso", (req, res) => {
    let clientId = req.query.clientId;
    request(`http://coordinatorservice.espresso-machine.svc.cluster.local/makecoffee?clientId=${clientId}`)
        .then(r => res.status(r.statusCode).send(r.body), err => res.status(500).send(err));

    let ws = clientMapping[clientId];
    if (ws) {
        ws.close();
    }
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
