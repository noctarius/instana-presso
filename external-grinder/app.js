require('instana-nodejs-sensor')({
    reportUncaughtException: true
});

const morgan = require('morgan');
const express = require('express');
const app = express();

app.use(morgan('combined'));

app.post('/api/v1/grind', (req, res) => {
    setTimeout(() => {
        res.end('true');
    }, 1500);
});

app.listen(3000, "0.0.0.0", (err) => {
    if (err) throw err;
    console.log(`Listening on port 3000.`);
});
