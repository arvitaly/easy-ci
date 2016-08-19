var spawn = require('child_process').spawn;
function exec(command, args, opts) {
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
}