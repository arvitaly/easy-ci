var exec = require('./exec').exec;
module.exports = (repoPath, keyPath) => {
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
}