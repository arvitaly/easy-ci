var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
module.exports = {
    spawn: function (command, args, opts) {
        var pr = spawn(command, args, opts)
        return new Promise((resolve, reject) => {
            pr.on('error', (err) => {
                reject(err)
            })
            pr.on('close', (code) => {
                if (code == 0) {
                    resolve()
                    return
                }
                reject(code)
            });
        })
    },
    exec: function (command, opts) {
        return new Promise((resolve, reject) => {
            exec(command, opts, (error, stdout, stderr) => {
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
                if (error) {
                    error.console = stderr;
                    reject(error);
                    return
                }
                resolve();
            })
        })
    }
}