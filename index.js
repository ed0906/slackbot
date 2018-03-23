const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post('/random-reviewer', function (request, response) {
    if(!request.body.text) {
        response.status(200);
        response.send({
            text: "You didn't specify any names! Try: '/random-reviewer Bob, Paul'"
        })
    } else {
        response.status(200);

        let text = request.body.text;
        if(text.startsWith("[") && text.endsWith("]")) {
            text = text.substring(1, text.length-1);
        }

        let components = text.split(",");
        if(components.length === 0) {
            response.send({
                text: "You didn't specify any names!"
            });
        } else if(components.length === 1){
            response.send({
                response_type: "in_channel",
                text: components[0].trim() + " you've been nominated!"
            })
        } else {
            let rand = Math.floor(Math.random() * components.length);
            response.send({
                response_type: "in_channel",
                text: components[rand].trim() + " you've been nominated!"
            });
        }
    }

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