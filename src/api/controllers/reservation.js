const { sendEmail } = require('../../utils/email/sendEmail');
const Reservation = require('../models/reservation');
const User = require('../models/user');

async function getReservations(req, res) {
  try {
    const { authorId } = req.params;
    const reservations = await Reservation.find({
      'activityId.idAuthor': authorId
    }).populate('activityId');

    // Si no se encuentran reservas, enviar mensaje adecuado
    if (!reservations.length) {
      return res.status(404).json({
        message: 'No se encontraron reservas para este propietario de actividad.'
      });
    }
    return res.status(200).json({
      reservations
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
}

async function newReservation(req, res) {
  try {
    const newreservation = new Reservation(req.body);

    const { _id } = req.user;

    const findUser = await User.findById(_id).populate('reservations');
    const newReservationDate = newreservation.entryDate;

    const reservationUser = findUser.reservations;
    let alreadyReservedActivity = false;
    let alreadyReservedAccommodation = false;

    if (newreservation.typeReservation === 'Alojamiento') {
      const reservationAccomodation = newreservation.accommodationId.toString();
      const findReservations = reservationUser.filter((reservation) => reservation.accommodationId);
      alreadyReservedAccommodation = findReservations.some((reservation) => {
        const reservationDate = reservation.entryDate;
        return reservation.accommodationId.toString() === reservationAccomodation && reservationDate === newReservationDate;
      });
    } else {
      const reservationActivity = newreservation.activityId.toString();
      const findReservations = reservationUser.filter((reservation) => reservation.activityId);
      alreadyReservedActivity = findReservations.some((reservation) => {
        const reservationDate = reservation.entryDate;
        return reservation.activityId.toString() === reservationActivity && reservationDate === newReservationDate;
      });
    }

    if (alreadyReservedActivity) {
      return res.status(400).json({
        message: 'Ya tienes una reserva de esa actividad para ese mismo día'
      });
    } else if (alreadyReservedAccommodation) {
      return res.status(400).json({
        message: 'Ya tienes una reserva de ese alojamiento para ese mismo día'
      });
    } else {
      await User.findByIdAndUpdate(
        _id,
        {
          $push: {
            reservations: newreservation._id
          }
        },
        { new: true }
      );

      const reservation = await newreservation.save();
      // sendEmail(user, newreservation, newreservation.typeReservation);

      return res.status(201).json({
        message: 'Reserva realizada correctamente, revisa tu correo para poder verla.',
        reservation
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
}
async function deleteReservation(req, res) {
  try {
    const { id } = req.params;
    const { _id } = req.user;
    const reservation = await Reservation.findById(id);

    if (_id.toString() !== reservation.userId.toString()) {
      return res.status(401).json({
        message: 'No estas autorizado para realizar esta acción'
      });
    }

    const reservationDeleted = await Reservation.findByIdAndDelete(id, { new: true });
    const userSaved = await User.findByIdAndUpdate(
      _id,
      {
        $pull: { reservations: id }
      },
      { new: true }
    );
    const { user } = req;
    sendEmail(user, reservation, 'Cancelar');
    return res.status(200).json({
      message: 'Reserva eliminada correctamente',
      userSaved,
      reservationDeleted
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
}

module.exports = { getReservations, newReservation, deleteReservation };
