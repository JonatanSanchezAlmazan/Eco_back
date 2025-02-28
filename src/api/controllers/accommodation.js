const { deleteFile } = require('../../utils/cloudinary/deleteFile');
const emailRegex = require('../../utils/Variables/emailRegex');
const phoneRegex = require('../../utils/Variables/phoneRegex');
const Accommodation = require('../models/accommodation');
const Reservation = require('../models/reservation');

async function getAccommodations(req, res) {
  try {
    const parsedCapacity = Number(req.query.capacity);
    const { ubi = '', idAuthor = '' } = req.query;

    const query = {
      idAuthor: { $regex: idAuthor, $options: 'i' },
      ubi: { $regex: ubi, $options: 'i' },
      capacity: { $gte: parsedCapacity }
    };

    const accommodations = await Accommodation.find(query);
    return res.status(200).json({
      message: 'Lista de alojamientos',
      accommodations
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
}
async function getAccommodation(req, res) {
  try {
    const { id } = req.params;
    const accommodation = await Accommodation.findById(id);
    return res.status(200).json({
      message: 'Alojamiento',
      accommodation
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
}
async function createAccommodations(req, res) {
  try {
    const newAccommodation = new Accommodation(req.body);
    newAccommodation.idAuthor = req.user._id.toString();
    if (req.files && req.files.images) {
      const imagePaths = req.files.images.map((file) => file.path);
      newAccommodation.images.push(...imagePaths);
    }
    const accommodation = await newAccommodation.save();
    return res.status(200).json({
      message: 'Alojamiento creado correctamente',
      accommodation
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
}
async function updateAccommodations(req, res) {
  try {
    const { id } = req.params;
    const { services, rules, contactDetails, ...allProperties } = req.body;

    if (contactDetails?.email && !emailRegex.test(email)) {
      return res.status(400).json({
        message: 'Introduce un email válido'
      });
    }
    if (contactDetails?.phone && !phoneRegex.test(phone)) {
      return res.status(400).json({
        message: 'Introduce un número de teléfono válido'
      });
    }

    const oldAccommodation = await Accommodation.findById(id);
    if (!oldAccommodation) {
      req.files.images.forEach((image) => deleteFile(image.path));
      return res.status(400).json({
        message: 'Alojamiento no encontrada'
      });
    }

    if (req.files && req.files.images) {
      oldAccommodation.images.forEach((image) => deleteFile(image));
      req.body.images = req.files.images.map((file) => file.path);
    }
    const accommodation = await Accommodation.findByIdAndUpdate(
      id,
      {
        $set: { ...allProperties, images: req.body.images || oldAccommodation.images, contactDetails: contactDetails || oldAccommodation.contactDetails },
        $addToSet: {
          services: services || oldAccommodation.services,
          rules: rules || oldAccommodation.rules
        }
      },
      { new: true }
    );
    return res.status(200).json({
      message: 'Alojamiento actualizado correctamente',
      accommodation
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
}
async function deleteAccommodations(req, res) {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findOne({ accommodationId: id });

    if (!reservation) {
      const accommodation = await Accommodation.findByIdAndDelete(id, { new: true });
      accommodation.images.forEach((file) => deleteFile(file));
      return res.status(200).json({
        message: 'Alojamiento eliminado correctamente',
        accommodation
      });
    } else {
      return res.status(400).json({
        message: 'No puedes eliminar el alojamiento con reservas pendientes'
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
}

module.exports = {
  getAccommodation,
  getAccommodations,
  createAccommodations,
  updateAccommodations,
  deleteAccommodations
};
