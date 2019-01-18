const r = require('request');
const express = require('express');
const app = express();
const appws = require("express-ws")(app);
const amqp = require('amqplib/callback_api');
const morgan = require('morgan');

const request = (uri, options) => new Promise((resolve, reject) => {
    r(uri, options, (err, res) => {
        if (err) return reject(err);
        resolve(res);
    });
});

const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));

app.use(morgan('combined'));

let publisher;
amqp.connect("amqp://rabbitmq.espresso-machine.svc.cluster.local", (err, conn) => {
    console.log("AMQP: Connected.");
    conn.createChannel((err, channel) => {
        channel.assertExchange("events", "topic", {durable: false});
        console.log("AMQP: Exchange created");

        publisher = (message) => {
            console.log(`AMQP: Sending message: ${message}`);
            channel.publish("events", "events.updates", new Buffer(message))
        };
    })
});

module.exports = {
    "request": request,
    "delay": delay,
    "pushMessage": (clientId, message) => {
        let value = JSON.stringify({"clientId": clientId, "message": message});
        if (publisher) publisher(value);
    },
    "pushAction": (clientId, action, brewerId) => {
        let value = JSON.stringify({"clientId": clientId, "action": action, "brewerId": brewerId});
        if (publisher) publisher(value);
    },
    "app": app
};
