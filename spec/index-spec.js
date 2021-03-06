var path = require("path");
var fetch = require('node-fetch');
var mock = require('mock-require');

var payload = require("./fixtures/payload");
var sign = require("./fixtures/sign");
var reposConfig = require('./fixtures/config.js');

describe("Easy CI", () => {
    it("push", (done) => {
        process.env.PORT = 7345
        process.env.CONFIG = path.resolve(__dirname + "/fixtures/config.js")
        mock('./../pull', (repoPath, keyPath) => {
            expect(repoPath).toBe(reposConfig.repos.repo1.path)
            expect(keyPath).toBe(reposConfig.repos.repo1.key)
        })
        require("./../index")
        fetch("http://127.0.0.1:" + process.env.PORT + "/github/repo1", {
            method: "POST",
            body: payload,
            headers: {
                "Content-type": "application/json",
                "X-Hub-Signature": sign
            }
        }).then((body) => {
            return body.json()
        }).then((answer) => {
            expect(answer).toEqual({ status: "ok", result: "hello" }, JSON.stringify(answer));
            done();
        }).catch((err) => {
            fail(err);
            done()
        })
    })
});