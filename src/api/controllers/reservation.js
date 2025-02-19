const { sendEmail } = require('../../utils/email/sendEmail');
const Reservation = require('../models/reservation');
const User = require('../models/user');

async function newReservation(req, res) {
  try {
    const reservation = new Reservation(req.body);

    const { _id } = req.user;
    const user = await User.findByIdAndUpdate(
      _id,
      {
        $push: {
          reservations: reservation._id
        }
      },
      { new: true }
    );

    const reservationSaved = await reservation.save();
    sendEmail(user, reservation, reservation.typeReservation);

    return res.status(201).json({
      message: 'Reserva realizada correctamente',
      user,
      reservationSaved
    });
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

module.exports = { newReservation, deleteReservation };
