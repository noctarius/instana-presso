require('instana-nodejs-sensor')({
    reportUncaughtException: true
});

const {request, delay, pushMessage, pushAction, app} = require("./support.js");

const grinderService = "http://grinder.external.svc.cluster.local";
const tamperService = "http://tamper.external.svc.cluster.local";
const brewerService = "http://brewservice.espresso-machine.svc.cluster.local";

app.get('/makecoffee', (req, res) => {
    let clientId = req.query.clientId;
    let brewerId = req.query.brewerId;

    let sendMessage = (msg) => pushMessage(clientId, msg);
    let sendAction = (action) => pushAction(clientId, action, brewerId);

    sendMessage("Making your espresso now...");

    delay(500)
        .then(() => request(`${grinderService}/api/v1/grind`, {method: "POST"}))
        .catch(err => res.status(500).send(`error while working on the grinder service: ${err}`))
        .then(() => sendMessage("Espresso beans ground, send powder to external tamper service"))
        .then(() => delay(300))
        .then(() => request(`${tamperService}/api/v2/`))
        .then(() => sendMessage("Espresso powder prepared, kicking of brewing process..."))
        .then(() => request(`${brewerService}/brew`))
        .catch(err => res.status(500).send(`error while asking to brewery: ${err}`))
        .then(res => sendMessage(`Got response from brewing service: ${res.body}`))
        .then(() => sendMessage("I present your espresso!"))
        .then(() => sendAction("espresso"))
        .then(() => res.send(`<html><body>ok</body></html>`))
});

app.listen(3000, "0.0.0.0", (err) => {
    if (err) throw err;
    console.log(`Listening on port 3000.`);
});
