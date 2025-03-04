const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: 'Users', required: true },
    activityId: {
      type: mongoose.Types.ObjectId,
      ref: 'Activities',
      required: function () {
        return this.typeReservation === 'Actividad';
      }
    },
    accommodationId: {
      type: mongoose.Types.ObjectId,
      ref: 'Accommodations',
      required: function () {
        return this.typeReservation === 'Alojamiento';
      }
    },
    entryDate: {
      type: String,
      required: true
    },
    exitDate: {
      type: String,
      required: function () {
        return this.typeReservation === 'Alojamiento';
      }
    },
    hour: {
      type: String,
      required: function () {
        return this.typeReservation === 'Actividad';
      }
    },
   
    typeReservation: {
      type: String,
      required: true,
      enum: ['Actividad', 'Alojamiento']
    }
  },
  {
    timeseries: true,
    timestamps: true,
    collection: 'Reservations'
  }
);

const Reservation = mongoose.model('Reservations', reservationSchema, 'Reservations');

module.exports = Reservation;
