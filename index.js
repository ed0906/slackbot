const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post('/random-reviewer', function (request, response) {
    response.status(200);
    response.send({
        "body": request.body
    });
});

app.use(express.static("public"));
app.get('/', function (req, res) {
    try {
        res.sendFile('../public/index.html', {root: __dirname});
    } catch (err) {
        res.status(400);
        res.send({
            "error": "Could not access resource"
        });
    }
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