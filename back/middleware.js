/**** middleware.js ****/

require('dotenv').config();
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

const withAuth = function(req, res, next) {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers['x-access-token'] ||
    req.cookies.token;
  if (!token) {
    res.status(401).send('Unauthorized: No token provided');
  } else {
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        res.status(401).send('Unauthorized: Invalid token');
      } else {
        req.userName = decoded.userName;
        next()
      }
    });
  }
}
module.exports = withAuth;