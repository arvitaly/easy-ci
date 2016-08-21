var path = require('path');
var secret = require("./secret");
module.exports = {
    repos: {
        repo1: {
            key: path.resolve(__dirname + "/./key1"),
            secret: secret,
            path: path.resolve(__dirname + "/../repos/repo1"),
            command: () => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve("hello");
                    }, 10);
                });
            }
        }
    }
}