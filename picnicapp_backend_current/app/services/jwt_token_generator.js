const jwt = require('jsonwebtoken');
const jwtconf = require('../../app/release/v1/config/globals/keyfile')


module.exports = (payload) => {
    console.log('payload',payload);
    
    return jwt.sign(
        payload,
        jwtconf.secret.d,
        {
            expiresIn: "12h"
        }
    )
}