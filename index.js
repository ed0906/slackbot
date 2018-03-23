const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post('/random-reviewer', function (request, response) {
    if(!request.body.text) {
        response.status(200);
        response.send({
            response_type: "ephemeral",
            text: "You didn't specify any names! Try: '/random-reviewer Bob, Paul'"
        })
    } else {
        response.status(200);

        let text = request.body.text;
        if(text.startsWith("[") && text.endsWith("]")) {
            text = text.substring(1, text.length-1);
        }

        let components = text.split(",").map(c => c.trim());
        console.log(components);
        let reviewers = Array.from(new Set(components));

        if(components.length !== reviewers.length) {
            response.send({
                response_type: "ephemeral",
                text: "Nice try, you cant nominate someone twice that's unfair..."
            });
        } else if(reviewers.length === 0) {
            response.send({
                response_type: "ephemeral",
                text: "You didn't specify any names!"
            });
        } else if(reviewers.length === 1){
            response.send({
                response_type: "in_channel",
                text: reviewers[0] + " you've been nominated!"
            })
        } else {
            let rand = Math.floor(Math.random() * reviewers.length);
            response.send({
                response_type: "in_channel",
                text: reviewers[rand] + " you've been nominated!"
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