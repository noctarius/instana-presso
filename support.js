const r = require('request');
const express = require('express');
const app = express();
const appws = require("express-ws")(app);
const amqp = require('amqplib/callback_api');
const morgan = require('morgan');

const connectedClients = {};
const brewers = [];

const request = (uri, options) => new Promise((resolve, reject) => {
    r(uri, options, (err, res) => {
        if (err) return reject(err);
        resolve(res);
    });
});

app.use(morgan('combined'));

app.ws("/events", (ws, req) => {
    let clientId = req.query.clientId;
    connectedClients[clientId] = ws;

    ws.onclose = () => {
        delete connectedClients[clientId];
    };

    brewers.forEach((blocked, index) => {
        let value = JSON.stringify({"brewerId": index, "blocked": blocked});
        ws.send(value);
    });
});

app.get("/blocked", (req, res) => {

});

app.get("/unblock", (req, res) => {
    if (publisher) {
        publisher(req.query.brewerId, false);
    }
    res.status(200).send("");
});

let publisher;

amqp.connect("amqp://rabbitmq.espresso-machine.svc.cluster.local", (err, conn) => {
    console.log("AMQP: Connected.");
    conn.createChannel((err, channel) => {
        channel.assertExchange("events", "topic", {durable: false});
        console.log("AMQP: Exchange created");

        publisher = (brewerId, blocked) => {
            let value = JSON.stringify({"brewerId": brewerId, "blocked": blocked});
            brewers[brewerId] = blocked;
            console.log(`AMQP: Sending message: ${value}`);
            channel.publish("events", "events.updates", new Buffer(value))
        };

        channel.assertQueue("", {exclusive: true, messageTtl: 10000}, (err, queue) => {
            channel.bindQueue(queue.queue, "events", "events.updates");
            channel.consume(queue.queue, msg => {
                console.log(`AMQP: message received: ${msg}`);
                let content = JSON.parse(msg.content);

                if (!content.clientId && content.brewerId) {
                    Object.keys(connectedClients).forEach(key => {
                        console.log(`AMQP: forwarding brewery information: ${key}`);
                        connectedClients[key].send(JSON.stringify(content));
                    })

                } else {
                    let client = connectedClients[content.clientId];
                    if (client) {
                        client.send(JSON.stringify(content));
                    }
                }
            }, {noAck: true});
        });
    })
});

module.exports = {
    "request": request,
    "notifyUI": (brewerId, blocked) => {
        if (publisher) publisher(brewerId, blocked);
    },
    "app": app
};

