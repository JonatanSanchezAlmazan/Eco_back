const User = require('../api/models/user');
const { verifyToken } = require('../utils/jwt/jwt');

async function isAuth(req, res, next) {
  try {
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({
        message: 'No estas autorizado!!!!!'
      });
    }

    const { id } = verifyToken(token);
    const user = await User.findById(id).select('name email image reservations isOwner');

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: 'No estas autorizado'
    });
  }
}

module.exports = { isAuth };
