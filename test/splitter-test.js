let expect = require("chai").expect;
let splitter = require("../src/splitter");

describe("Splitter", function () {
    it("Should Split by comma", function () {
        // When
        let response = splitter("A,B");
        // Then
        expect(response).to.have.members(["A", "B"]);
    });

    it("Should Split by space", function () {
        // When
        let response = splitter("A B");
        // Then
        expect(response).to.have.members(["A", "B"]);
    });

    it("Should Split by <>", function () {
        // When
        let response = splitter("<A><B>");
        // Then
        expect(response).to.have.members(["<A>", "<B>"]);
    });

    it("Should Split by multiple types", function () {
        // When
        let response = splitter("A B,C, D,E<F><G>H");
        // Then
        expect(response).to.have.members(["A", "B", "C", "D", "E", "<F>", "<G>", "H"]);
    });
});