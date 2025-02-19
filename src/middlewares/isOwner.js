function isOwner(model) {
  return async (req, res, next) => {
    try {
      const { user } = req;
      const { id } = req.params;

      const resource = await model.findById(id);

      if (user.isOwner === true && (!resource || user._id.toString() === resource.idAuthor)) {
        return next();
      }

      return res.status(401).json({
        message: 'No estás autorizado'
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Internal Server Error'
      });
    }
  };
}
module.exports = { isOwner };
