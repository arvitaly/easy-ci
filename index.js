var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');

var pull = require('./pull');
var check = require('./check-payload');

//Load env variables
var tmpPath = process.env.TMP || "/tmp";
var configPath = process.env.CONFIG || "/etc/easy-ci/config.js"

//Express server
var app = express();
app.post("/github/:repo", bodyParser.raw({ type: "application/json" }), (req, res) => {
    var confPath = require.resolve(configPath);
    var repoConf;

    fexists(confPath).then((isExists) => {
        if (!isExists) {
            res.send({ "status": "error", "error": "not found easy-ci config" });
            return;
        }

        delete require.cache[confPath];
        var conf = require(confPath);
        if (!conf.repos) {
            res.send({ "status": "error", "error": "not found repos in config" });
            return;
        }
        repoConf = conf.repos[req.params['repo']]
        if (!repoConf) {
            res.send({ "status": "error", "error": "not found repo " + req.params.repo });
            return;
        }
        /* REPO CONFIG INTERFACE
            {
                key: "",
                path: "",
                secret: "",
                command: ()=>{}                
            }
        */
        if (!req.headers['x-hub-signature']) {
            res.send({ "status": "error", "error": "Not found signature for repo " + req.params.repo });
            return;
        }
        if (!req.body) {
            res.send({ "status": "error", "error": "Empty body for repo " + req.params.repo });
            return;
        }
        if (!check(req.body, req.headers['x-hub-signature'], repoConf.secret)) {
            res.send({ "status": "error", "error": "Invalid signature for repo " + req.params.repo });
            return;
        }
        if (repoConf.key) {
            return writeKeyToTemp(repoConf.key)
        }
        return null;
    }).then((keyPath) => {
        if (repoConf.path) {
            return pull(repoConf.path, keyPath)
        }
    }).then(() => {
        if (repoConf.command) {
            return Promise.resolve(repoConf.command());
        }
    }).then((result) => {
        res.send({ status: "ok", "result": result })
    }).catch((err) => {
        res.send({ status: "error", "error": err });
    })
});
app.listen(process.env.PORT || 7654);

function writeKeyToTemp(key) {
    var tmpFile = tmpPath + "/" + (+new Date) + parseInt((Math.random() * 1000000));
    return new Promise((resolve, reject) => {
        fs.writeFile(tmpFile, key, (err) => {
            if (err) {
                reject(err);
                return
            }
            resolve(tmpFile);
        })
    })
}
function fexists(f) {
    return new Promise((resolve) => {
        fs.access(f, fs.F_OK, function (err) {
            if (!err) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    })
}