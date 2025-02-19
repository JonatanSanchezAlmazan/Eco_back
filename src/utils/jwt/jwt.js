const jwt = require('jsonwebtoken');

function generateSign(id) {
  return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: '1d' });
}

function verifyToken(token) {
  return jwt.verify(token, process.env.SECRET_KEY);
}

module.exports = { generateSign, verifyToken };
