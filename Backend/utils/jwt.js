const expressJwt = require('express-jwt');

function authJwt() {
    const secret = process.env.SECRET_KEY;
    const api = process.env.API_URL;
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        // isRevoked: isRevoked
    })
}

async function isRevoked(req, payload, done) {
    if (!payload.isAdmin) {
        done(null, true);
    }

    done();
}

module.exports = authJwt;
