const { validateToken } = require("../services/auth");

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    let token = null;

    if (req.cookies && req.cookies[cookieName]) {
      token = req.cookies[cookieName];
    }

    else if(req.headers.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next();
    }

    try {
      const user = validateToken(token); // this returns userPayload
      req.user = user;
    } catch (error) {
      console.log(error);
    }
    return next();
  };
}

module.exports = {
  checkForAuthenticationCookie,
};
