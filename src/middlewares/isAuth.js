const User = require('../api/models/user');
const { verifyToken } = require('../utils/jwt/jwt');

async function isAuth(req, res, next) {
  try {
    const token = req.headers.authorization.replace('Bearer', '').trim();
    const { id } = verifyToken(token);
    const user = await User.findById(id).select(
      'name email image reservations isOwner'
    );

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: 'No estás autorizado'
    });
  }
}

module.exports = { isAuth };
