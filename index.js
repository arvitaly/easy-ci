var express = require('express');
var exec = require('./exec').exec;
var app = express();
app.post("/github/:repo", (req, res) => {
    var sPath = "/var/easy-ci/" + req.params['repo'];
    var keyPath = require('path').resolve(sPath + "/id_rsa")
    var repoPath = sPath + "/repo";
    var execOpts = {
        shell: true,
        stdio: ["inherit", "inherit", "inherit"]
    }
    execOpts.cwd = repoPath;
    exec("eval $(ssh-agent) && ssh-add " + keyPath + " && git pull", execOpts).then(() => {

    }).then(() => {
        var configModule = require.resolve(sPath + "/config.js");
        console.log(configModule);
        delete require.cache[configModule];
        return Promise.resolve(require(configModule)());
    }).then(() => {
        res.send({ status: "ok" })
    }).catch((err) => {
        res.send({ status: "error", "error": err });
    })
});
app.listen(process.env.PORT || 7654);