let splitter = require("./splitter");

let nominations = [
    "you've been nominated!",
    "it's your turn!",
    "you've been empowered with this review!",
    "congratulations it's yours!",
    "it's your lucky day!",
    "go smash it!",
    "review time!",
    "the power is in your hands!"
];

function random(array) {
    let rand = Math.floor(Math.random() * array.length);
    return array[rand];
}

let lastUser = {};

function selectNewReviewer(channel_id, reviewers) {
    let selectedUser;
    do {
        selectedUser = random(reviewers);
    }
    while (selectedUser === lastUser[channel_id]);
    lastUser[channel_id] = selectedUser;
    return selectedUser;
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
            // Select a different user to last time
            let selectedUser = selectNewReviewer(payload.channel_id, reviewers);

            let output = selectedUser + " " + random(nominations);
            if(info !== undefined) {
                output += " (" + info + ")"
            }
            callback(null, {
                response_type: "in_channel",
                text:  output,
                selection: reviewers,
                selected: selectedUser,
                channel_id: payload.channel_id,
                user_id: payload.user_id
            });
        }
    }
}

module.exports = handler;