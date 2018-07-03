let expect = require('chai').expect;
let handler = require('../src/handler.js');

describe("Handler", function () {

    it("Should handle bad input", function () {
        // When
        handler("", function(err, body) {
            expect(err).to.equal(null);
            expect(body.response_type).to.equal("ephemeral");
            expect(body.text).to.contain("You didn't specify any names!");
        })
    });

    it("Should handle bad object input", function () {
        // When
        handler({}, function(err, body) {
            expect(err).to.equal(null);
            expect(body.response_type).to.equal("ephemeral");
            expect(body.text).to.contain("You didn't specify any names!");
        })
    });

    it("Should handle 'help'", function () {
        // When
        handler({text: "help"}, function(err, body) {
            expect(err).to.equal(null);
            expect(body.response_type).to.equal("ephemeral");
            expect(body.text).to.equal("Try: '/random-reviewer Bob, Paul' It picks a name at random and for various complicated legal reasons they HAVE to do the review.");
        })
    });

    it("Should handle 'help'", function () {
        // When
        handler({text: "help"}, function(err, body) {
            expect(err).to.equal(null);
            expect(body.response_type).to.equal("ephemeral");
            expect(body.text).to.equal("Try: '/random-reviewer Bob, Paul' It picks a name at random and for various complicated legal reasons they HAVE to do the review.");
        })
    });

    it("Should Handle empty entry", function () {
        // When
        handler({text: ""}, function(err, body) {
            expect(err).to.equal(null);
            expect(body.response_type).to.equal("ephemeral");
            expect(body.text).to.contain("You didn't specify any names!");
        })
    });

    it("Should Handle duplicate entry", function () {
        // When
        handler({text: "User, User"}, function(err, body) {
            expect(err).to.equal(null);
            expect(body.response_type).to.equal("ephemeral");
            expect(body.text).to.equal("Nice try, you cant nominate someone twice that's unfair...");
        })
    });

    it("Should Handle comma separated users", function () {
        // When
        handler({text: "User1,User2"}, function(err, body) {
            expect(err).to.equal(null);
            expect(body.response_type).to.equal("in_channel");
            expect(body.selection).to.have.members(["User1","User2"]);
        })
    });

    it("Should Handle space separated users", function () {
        // When
        handler({text: "User1 User2"}, function(err, body) {
            expect(err).to.equal(null);
            expect(body.response_type).to.equal("in_channel");
            expect(body.selection).to.have.members(["User1","User2"]);
        })
    });

    it("Should Handle comma & space separated users", function () {
        // When
        handler({text: "User1, User2"}, function(err, body) {
            expect(err).to.equal(null);
            expect(body.response_type).to.equal("in_channel");
            expect(body.selection).to.have.members(["User1","User2"]);
        })
    });

    it("Should Handle slack users", function () {
        // When
        handler({text: "<@U1><@U2>"}, function(err, body) {
            expect(err).to.equal(null);
            expect(body.response_type).to.equal("in_channel");
            expect(body.selection).to.have.members(["<@U1>","<@U2>"]);
        })
    });

    it("Should Handle self nomination", function () {
        // When
        handler({text: "<@U1><@2U2>", user_id: 'U1'}, function(err, body) {
            expect(err).to.equal(null);
            expect(body.response_type).to.equal("ephemeral");
            expect(body.text).to.contain("You can't nominate yourself!");
        })
    });

    it("Should Handle mixture of split types", function () {
        // When
        handler({text: "User1, User2,User3 User4<@U5>"}, function(err, body) {
            expect(err).to.equal(null);
            expect(body.response_type).to.equal("in_channel");
            expect(body.selection).to.have.members(["User1", "User2", "User3", "User4","<@U5>"]);
        })
    });

    it("Should Handle user with name containing 'for'", function () {
        // When
        handler({text: "User forest"}, function(err, body) {
            expect(err).to.equal(null);
            expect(body.response_type).to.equal("in_channel");
            expect(body.selection).to.have.members(["User", "forest"]);
        })
    });

    it("Should Handle no 'for' extension", function () {
        // When
        handler({text: "User1, User2"}, function(err, body) {
            expect(err).to.equal(null);
            expect(body.response_type).to.equal("in_channel");
            expect(body.text).not.to.contain("(");
            expect(body.text).not.to.contain(")");
        })
    });

    it("Should Handle empty 'for' extension", function () {
        // When
        handler({text: "User1, User2 for"}, function(err, body) {
            expect(err).to.equal(null);
            expect(body.response_type).to.equal("in_channel");
        })
    });

    it("Should Handle 'for' extension", function () {
        // When
        handler({text: "User1, User2 for review 1"}, function(err, body) {
            expect(err).to.equal(null);
            expect(body.response_type).to.equal("in_channel");
            expect(body.text).to.contain(" (Review 1)");
        })
    });

    it("Should Handle 'for' link extension", function () {
        // When
        handler({text: "User1, User2 for http://link.com"}, function(err, body) {
            expect(err).to.equal(null);
            expect(body.response_type).to.equal("in_channel");
            expect(body.text).to.contain(" (http://link.com");
        });
        handler({text: "User1, User2 for www.link.com"}, function(err, body) {
            expect(err).to.equal(null);
            expect(body.response_type).to.equal("in_channel");
            expect(body.text).to.contain(" (www.link.com");
        });
    });

    it("Should pick a new reviewer each time with null channel_id", function () {
        // Given
        let payload = {text: "User1, User2 for http://link.com"};

        // When
        handler(payload, function(err, body) {
            let selected1 = body.selected;
            handler(payload, function (err, body) {
                let selected2 = body.selected;
                expect(selected1).not.to.equal(selected2);
            })
        });
    });

    it("Should pick a new reviewer each time with populated channel_id", function () {
        // Given
        let payload = {
            text: "User1, User2 for http://link.com",
            channel_id: "C123"
        };

        // When
        handler(payload, function(err, body) {
            let selected1 = body.selected;
            handler(payload, function (err, body) {
                let selected2 = body.selected;
                expect(selected1).not.to.equal(selected2);
            })
        });
    });
});