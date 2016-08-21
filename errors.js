module.exports = {
    notFoundConfig: (path) => {
        return {
            message: "not found easy-ci config at path " + path,
            path: path
        }
    },
    notFoundReposInConf: (conf) => {
        return {
            message: "not found repos in config",
            config: conf
        }
    },
    notFoundRepoInConf: (conf, repoName) => {
        return {
            message: "not found repo " + repoName,
            config: conf
        }
    },
    notFoundSecretInRepoConf: (conf, repoName) => {
        return {
            message: "not found secret field in repo conf",
            config: conf,
            repo: repoName
        }
    },
    notFoundSign: (repoName, headers) => {
        return {
            message: "Not found signature",
            repo: repoName,
            headers: headers
        }
    },
    invalidSign: (repoName, headers, body, repoConf) => {
        return {
            message: "Invalid signature",
            repo: repoName,
            headers: headers,
            body: body,
            conf: repoConf
        }
    },
    notFoundRepoPath: (repoName, repoConf, path) => {
        return {
            message: "Not found repository path " + path,
            repo: repoName,
            repoConfig: repoConf
        }
    },
    notFoundKeyPath: (repoName, repoConf, path) => {
        return {
            message: "Not found key path " + path,
            repo: repoName,
            repoConfig: repoConf
        }
    },
    unknownError: (err) => {
        return {
            message: "unknown error",
            rawError: err
        }
    }
}