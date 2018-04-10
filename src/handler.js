let splitter = require("./splitter");

let nominations = [
    "you've been nominated!",
    "it's your turn!",
    "you've been empowered with this review!",
    "congratulations it's yours!",
    "it's your lucky day!",
    "go smash it!",
    "review time!"
];

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

        let info = null;
        if(text.indexOf(" for ")){
            let parts = text.split(" for ").map(c => c.trim());
            info = parts[1];
            if(info && info.length>1 && !info.startsWith("http")  && !info.startsWith("www")) {
                info = info.charAt(0).toUpperCase() + info.slice(1)
            }
            text = parts[0];
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
            let output = random(reviewers) + " " + random(nominations);
            if(info !== undefined) {
                output += " (" + info + ")"
            }
            callback(null, {
                response_type: "in_channel",
                text:  output,
                selection: reviewers
            });
        }
    }
}

module.exports = handler;