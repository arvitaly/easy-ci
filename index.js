var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
//Internal modules
var pull = require('./pull');
var check = require('./check-payload');
var errors = require('./errors');
//Load env variables
var configPath = process.env.CONFIG || "/etc/easy-ci/config.js"
//Express server with support only github webhook
var app = express();
app.post("/github/:repo", bodyParser.raw({ type: "application/json" }), (req, res) => {
    var repoConf;
    var repoName = req.params['repo'];
    //create error func by binding response
    var error = (err) => {
        return Promise.reject(err)
    }
    //resolve config path
    var confPath = require.resolve(configPath);
    //check if config file existing
    fexists(confPath).then((isExists) => {
        if (!isExists) {
            return error(errors.notFoundConfig(confPath));
        }
        //Remove cache for require new config file
        delete require.cache[confPath];
        var conf = require(confPath);
        //Check repository config for errors
        var configError = getRepoConfigErrors(conf, repoName);
        if (configError) {
            return error(configError)
        }
        repoConf = conf.repos[repoName];
        //Check signature
        if (!req.headers['x-hub-signature']) {
            return error(errors.notFoundSign(repoName, req.headers))
        }
        if (!check(req.body, req.headers['x-hub-signature'], repoConf.secret)) {
            return error(errors.invalidSign(repoName, req.headers, req.body, repoConf))
        }
        return repoConf.key;
    }).then((keyPath) => {
        if (repoConf.path) {
            //Check repository path exists
            return fexists(repoConf.path).then((isExists) => {
                if (!isExists) {
                    return error(errors.notFoundRepoPath(repoName, repoConf, repoConf.path));
                }
                if (keyPath) {
                    return fexists(keyPath).then((isExists) => {
                        if (!isExists) {
                            return error(errors.notFoundKeyPath(repoName, repoConf, keyPath));
                        }
                    })
                }
            }).then(() => {
                return pull(repoConf.path, keyPath)
            })
        }
    }).then(() => {
        if (repoConf.command) {
            return Promise.resolve(repoConf.command());
        }
    }).then((result) => {
        res.send({ status: "ok", "result": result })
    }).catch((err) => {
        console.error(err);
        if (!err.message) {
            err = error(errors.unknownError(err))
        }
        sendError(res, err);
    })
});
app.listen(process.env.PORT || 7654);

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
function sendError(res, err) {
    res.status(500).send({ status: "error", error: err })
}

/* REPO CONFIG INTERFACE
    {
        key: "",
        path: "",
        secret: "",
        command: ()=>{}                
    }
*/
function getRepoConfigErrors(conf, repoName) {
    if (!conf.repos) {
        return errors.notFoundReposInConf(conf);
    }
    if (!conf.repos[repoName]) {
        return errors.notFoundRepoInConf(conf, repoName);
    }
    if (!conf.repos[repoName].secret) {
        return errors.notFoundSecretInRepoConf(conf, repoName);
    }
}