var fs = require('fs');
var express = require('express');
var pull = require('./pull');
var app = express();
var tmpPath = process.env.TMP || "/tmp";
var configPath = process.env.CONFIG || "/var/easy-ci/config.js"

app.post("/github/:repo", (req, res) => {
    //
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
                command: ()=>{}
            }
        */
        if (repoConf.key) {
            return writeKeyToTemp(repoConf.key)
        }
        return null;
    }).then((keyPath) => {
        if (repoConf.path) {
            var repoPath = repoConf.path;
            return pull(repoPath, keyPath)
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