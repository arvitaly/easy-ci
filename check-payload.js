var crypto = require('crypto');
function eq(a, b) {
    if (a.length !== b.length) {
        return false;
    }

    var c = 0;
    for (var i = 0; i < a.length; i++) {
        c |= a[i] ^ b[i];
    }
    return c === 0;
}

module.exports = function (body, signature, key) {
    var p = signature.split('=');
    if (p.length !== 2) {
        return false;
    }
    try {
        var hash = crypto.createHmac(p[0], key);
    } catch (e) {
        return false;
    }
    var source = new Buffer(hash.update(body, 'utf8').digest('hex'));

    return eq(source, new Buffer(p[1]));
};