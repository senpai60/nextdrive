const jwt = require('jsonwebtoken');

function authCheck(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    res.locals.authenticated = false;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    res.locals.authenticated = true;
  } catch (err) {
    res.locals.authenticated = false;
  }
  next();
}

module.exports = authCheck;
