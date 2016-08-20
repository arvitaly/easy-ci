var fs = require('fs');
var express = require('express');
var exec = require('./exec').exec;
var app = express();

app.post("/github/:repo", (req, res) => {
    //
    var confPath = require.resolve("/var/easy-ci/config.js");
    var repoConf;
    fexists(confPath).then((isExists) => {
        if (!isExists) {
            res.send({ "status": "error", "error": "not found easy-ci config" });
            return;
        }
        delete require.cache[confPath];
        var conf = require(confPath);
        repoConf = conf.repos[req.params['repo']]
        if (!repoConf) {
            res.send({ "status": "error", "error": "not found repo " + req.params.repo });
            return;
        }
        /*
            {
                key: "",
                path: "",
                command: 
            }
        */
        if (repoConf.key) {
            return writeKeyToTemp(repoConf.key)
        }
        return null;
    }).then((keyPath) => {
        var repoPath = repoConf.path;
        var execOpts = {
            shell: true,
            stdio: ["inherit", "inherit", "inherit"]
        }
        execOpts.cwd = repoPath;
        if (keyPath) {
            return exec("eval $(ssh-agent) && ssh-add " + keyPath + " && git pull", execOpts);
        } else {
            return exec("git pull", execOpts);
        }
    }).then(() => {
        return Promise.resolve(repoConf.command());
    }).then(() => {
        res.send({ status: "ok" })
    }).catch((err) => {
        res.send({ status: "error", "error": err });
    })
});
app.listen(process.env.PORT || 7654);

function writeKeyToTemp(key) {
    var tmpFile = "/tmp/" + (+new Date) + parseInt((Math.random() * 1000000));
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