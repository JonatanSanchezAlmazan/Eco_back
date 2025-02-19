async function isSelf(req, res, next) {
  try {
    const { id } = req.params;
    const user = req.user;

    if (id !== user._id.toString()) {
      return res.status(401).json({
        message: 'No estás autorizado'
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'No estás autorizado'
    });
  }
}

module.exports = { isSelf };
