var secret = require("./secret");
module.exports = {
    repos: {
        repo1: {
            key: "key1",
            secret: secret,
            path: "./../repos/repo1",
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