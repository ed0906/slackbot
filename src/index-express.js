const express = require('express');
const bodyParser = require('body-parser');
const handler = require('./handler');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post('/random-reviewer', function (request, response) {
    handler(request.body, function(error, body) {
        response.status(200);
        response.send(error == null ? body : error);
    });
});

app.use(express.static("public"));
app.get('/', function (req, res) {
    res.send("Try POST '/random-reviewer' {'text':'Bob,Paul'}");
});

// Health Check
app.get('/health', function (req, res) {
    res.send('The app is up and running');
});

// Run Server
let port = process.env.PORT || 8306;
let server = app.listen(port, function () {
    let host = server.address().address || 'localhost';
    console.log('Example app listening at http://%s:%s', host, port);
});