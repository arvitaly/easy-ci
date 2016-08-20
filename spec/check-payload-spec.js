var payload = require("./fixtures/payload");
var secret = require("./fixtures/secret");
var sign = require("./fixtures/sign");

var check = require("./../check-payload")
describe("Check payload", () => {
    it("simple", () => {
        expect(check(payload, sign, secret)).toBeTruthy();
    })
})