const JWT = require('jsonwebtoken')

function createTokenForUser(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        avatar: user.avatar, 
    };
    const token = JWT.sign(payload, process.env.JWT_SECRET);
    return token;
}


function validateToken(token) {
    const payload = JWT.verify(token, process.env.JWT_SECRET);
    return payload;
}


module.exports = {
    createTokenForUser,
    validateToken,
}