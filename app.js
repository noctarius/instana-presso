/*require('instana-nodejs-sensor')({
    reportUncaughtException: true
});*/

const morgan = require('morgan');
const express = require('express');
const app = express();

app.use(morgan('combined'));

app.get('/api/v2/', (req, res) => {
    setTimeout(() => {
        res.end('true');
    }, 400);
});

app.listen(3000, "0.0.0.0", (err) => {
    if (err) throw err;
    console.log(`Listening on port 3000.`);
});
