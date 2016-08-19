var express = require('express');
var exec = require('./exec');
var app = express();
app.post("/github/:repo", (req, res) => {
    var repoPath = "/var/easy-ci/" + req.params['repo'];
    var execOpts = {
        cwd: repoPath,
        shell: true,
        stdio: "inherit"
    }
    exec("ssh-add", [repoPath + "/id_rsa"], execOpts).then(() => {
        return exec("git", ["pull"], execOpts);
    }).then(() => {
        return exec("start", [], execOpts);
    }).then(() => {
        res.send({ status: "ok" })
    }).catch((err) => {
        res.send({ status: "error", "error": err });
    })
});