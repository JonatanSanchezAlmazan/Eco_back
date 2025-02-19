const { deleteFile } = require('../../utils/cloudinary/deleteFile');
const Activity = require('../models/activity');

async function createActivity(req, res) {
  try {
    const newActivity = new Activity(req.body);

    newActivity.idAuthor = req.user._id.toString();
    if (req.files && req.files.images) {
      const imagePaths = req.files.images.map((file) => file.path);
      newActivity.images.push(...imagePaths);
    }
    const activitySaved = await newActivity.save();
    return res.status(201).json({
      message: 'Actividad creada correctamente',
      activitySaved
    });
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      message: 'Error'
    });
  }
}

async function getActivities(req, res) {
  try {
    const parsedCapacity = Number(req.query.capacity);
    const { ubi = '', idAuthor = '' } = req.query;

    const query = {
      idAuthor: { $regex: idAuthor, $options: 'i' },
      ubi: { $regex: ubi, $options: 'i' },
      capacity: { $gte: parsedCapacity }
    };

    const activities = await Activity.find(query);
    return res.status(200).json({
      message: 'Actividades',
      activities
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Error'
    });
  }
}

async function getActivity(req, res) {
  try {
    const { id } = req.params;
    const activity = await Activity.findById(id);
    return res.status(200).json({
      message: 'Detalle actividad',
      activity
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Error'
    });
  }
}

async function updateActivity(req, res) {
  try {
    const { id } = req.params;

    const { requirements, includes, ...allProperties } = req.body;
    const oldActivity = await Activity.findById(id);
    console.log(allProperties);

    if (!oldActivity) {
      req.files.images.forEach((image) => deleteFile(image.path));
      return res.status(400).json({
        message: 'Actividad no encontrada'
      });
    }

    if (req.files && req.files.images) {
      oldActivity.images.forEach((image) => deleteFile(image));
      const newImages = req.files.images.map((file) => file.path);
      updates.images = newImages;
    }

    const activityUpdated = await Activity.findByIdAndUpdate(
      id,
      {
        $set: { ...allProperties },
        $addToSet: {
          requirements: requirements || oldActivity.requirements,
          includes: includes || oldActivity.includes
        }
      },
      {
        new: true
      }
    );
    return res.status(200).json({
      message: 'Actividad actualizada correctamente',
      activityUpdated
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Error'
    });
  }
}

async function deleteActivity(req, res) {
  try {
    const { id } = req.params;
    const activityDeleted = await Activity.findByIdAndDelete(id, { new: true });
    activityDeleted.images.forEach((image) => deleteFile(image));
    return res.status(200).json({
      message: 'Actividad eliminada correctamente',
      activityDeleted
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Error'
    });
  }
}

module.exports = {
  createActivity,
  getActivities,
  getActivity,
  updateActivity,
  deleteActivity
};
