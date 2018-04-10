let splitter = require("./splitter");

function random(array) {
    let rand = Math.floor(Math.random() * array.length);
    return array[rand];
}

function handler(payload, callback) {
    if(!payload.text) {
        callback(null, {
            response_type: "ephemeral",
            text: "You didn't specify any names! Try: '/random-reviewer Bob, Paul'"
        });
    } else {
        let text = payload.text;
        if(text.startsWith("[") && text.endsWith("]")) {
            text = text.substring(1, text.length-1);
        }
        if(text === "help") {
            callback(null, {
                response_type: "ephemeral",
                text: "Try: '/random-reviewer Bob, Paul' It picks a name at random and for various complicated legal reasons they HAVE to do the review."
            });
            return;
        }

        let components = splitter(text);
        console.log(components);
        let reviewers = Array.from(new Set(components));

        if(components.length !== reviewers.length) {
            callback(null, {
                response_type: "ephemeral",
                text: "Nice try, you cant nominate someone twice that's unfair..."
            });
        } else if(reviewers.length === 0) {
            callback(null, {
                response_type: "ephemeral",
                text: "You didn't specify any names!"
            });
        } else if(reviewers.length === 1){
            callback(null, {
                response_type: "ephemeral",
                text: "That's not very democratic of you, give someone else a chance!"
            })
        } else {
            let nominations = [
                "you've been nominated!",
                "it's your turn!",
                "you've been empowered with this review!",
                "congratulations it's yours!"
            ];

            callback(null, {
                response_type: "in_channel",
                text: random(reviewers) + " " + random(nominations),
                selection: reviewers
            });
        }
    }
}

module.exports = handler;