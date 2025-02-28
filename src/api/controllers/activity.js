const { deleteFile } = require('../../utils/cloudinary/deleteFile');
const Activity = require('../models/activity');
const Reservation = require('../models/reservation');
const User = require('../models/user');

async function createActivity(req, res) {
  try {
    const newActivity = new Activity(req.body);

    newActivity.idAuthor = req.user._id.toString();
    if (req.files && req.files.images) {
      const imagePaths = req.files.images.map((file) => file.path);
      newActivity.images.push(...imagePaths);
    }
    const activity = await newActivity.save();
    return res.status(201).json({
      message: 'Actividad creada correctamente',
      activity
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error'
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
    console.log(error);

    return res.status(500).json({
      message: 'Internal Server Error'
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
    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
}

async function updateActivity(req, res) {
  try {
    const { id } = req.params;

    const { requirements, includes, ...allProperties } = req.body;
    const oldActivity = await Activity.findById(id);

    if (!oldActivity) {
      req.files.images.forEach((image) => deleteFile(image.path));
      return res.status(400).json({
        message: 'Actividad no encontrada'
      });
    }

    if (req.files && req.files.images) {
      oldActivity.images.forEach((image) => deleteFile(image));
      req.body.images = req.files.images.map((file) => file.path);
    }

    const activity = await Activity.findByIdAndUpdate(
      id,
      {
        $set: { ...allProperties, images: req.body.images || oldActivity.images },
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
      activity
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
}

async function deleteActivity(req, res) {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findOne({ activityId: id });

    if (!reservation) {
      const activity = await Activity.findByIdAndDelete(id, { new: true });
      activity.images.forEach((image) => deleteFile(image));
      return res.status(200).json({
        message: 'Actividad eliminada correctamente',
        activity
      });
    } else {
      return res.status(400).json({
        message: 'No puedes eliminar la actividad con reservas pendientes'
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error'
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
