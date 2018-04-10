const index = require("../src/index-lambda");
const expect = require("chai").expect;

describe("Index-Lambda", function () {
    it("Should delegate to handler", function () {
        index.handler({
            text: "user1, user2"
        }, null, function (error, body) {
            expect(error).to.equal(null);
            expect(body.response_type).to.equal("in_channel");
        })
    })
});