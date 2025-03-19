const { sendEmail } = require('../../utils/email/sendEmail');
const Reservation = require('../models/reservation');
const User = require('../models/user');

async function getReservations(req, res) {
  try {
    const { id } = req.params;

    const reservations = await Reservation.find().populate({ path: 'activityId', select: 'idAuthor name -_id' }).populate({ path: 'accommodationId', select: 'idAuthor name -_id' }).populate({ path: 'userId', select: 'name -_id' }).select('entryDate exitDate hour -_id');

    const filteredReservations = reservations.filter((r) => (r.activityId && r.activityId.idAuthor.toString() === id) || (r.accommodationId && r.accommodationId.idAuthor.toString() === id));

    return res.status(200).json({
      reservations: filteredReservations
    });
  } catch (error) {
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

    const reservation = await Reservation.findByIdAndDelete(id, { new: true });
    await User.findByIdAndUpdate(
      _id,
      {
        $pull: { reservations: id }
      },
      { new: true }
    );
    const { user } = req;
    // sendEmail(user, reservation, 'Cancelar');
    return res.status(200).json({
      message: 'Reserva eliminada correctamente, te hemos enviado un mensaje con la reserva cancleada',
      reservation
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
}

module.exports = { getReservations, newReservation, deleteReservation };
