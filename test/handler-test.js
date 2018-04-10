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
        handler({text: "<@1|user1><@2|user2>"}, function(err, body) {
            expect(err).to.equal(null);
            expect(body.response_type).to.equal("in_channel");
            expect(body.selection).to.have.members(["<@1|user1>","<@2|user2>"]);
        })
    });

    it("Should Handle mixture of split types", function () {
        // When
        handler({text: "User1, User2,User3 User4<@123|user>"}, function(err, body) {
            expect(err).to.equal(null);
            expect(body.response_type).to.equal("in_channel");
            expect(body.selection).to.have.members(["User1", "User2", "User3", "User4","<@123|user>"]);
        })
    });
});