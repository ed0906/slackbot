const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post('/random-reviewer', function (request, response) {
    if(!request.body.text) {
        response.status(400);
        response.send("Please specify at least one name e.g. '/random-reviewer Bob,Paul'")
    } else {
        response.status(200);

        let components = request.body.text.split(",");
        if(components.length === 0) {
            response.send("You didn't specify any names!");
        } else if(components.length === 1){
            response.send("Picking: " + components[0].trim() + ". Although they didn't have much choice!")
        } else {
            let rand = Math.floor(Math.random() * components.length);
            response.send("Picking: " + components[rand].trim());
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