require('instana-nodejs-sensor')({
    reportUncaughtException: true
});

const morgan = require('morgan');
const express = require('express');
const app = express();

app.use(morgan('combined'));

app.get('/dispense', (req, res) => {
    setTimeout(() => {
        if (Math.random() <= 0.3) {
            return res.end('false');
        }
        res.end('true');
    }, 400);
});

app.listen(3000, "0.0.0.0", (err) => {
    if (err) throw err;
    console.log(`Listening on port 3000.`);
});
