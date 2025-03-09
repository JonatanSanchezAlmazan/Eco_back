const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ['Senderismo', 'Ciclismo', 'Kayak', 'Otro', 'Excursión', 'Taller']
    },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    ubi: { type: String, required: true },
    duration: { type: String, required: true },
    difficulty: {
      type: String,
      required: true,
      enum: ['Fácil', 'Moderada', 'Desafiante', 'Experto']
    },
    contactDetails: {
      email: {
        type: String,
        required: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Por favor ingrese un correo electrónico válido']
      },
      phone: {
        type: String,
        required: true,
        match: [/^\d+$/, 'El teléfono solo puede contener números']
      }
    },

    requirements: { type: [String], required: true },
    images: [{ type: String }],
    capacity: { type: Number, required: true },
    includes: { type: [String], required: true },
    schedule: { type: String, required: true },
    startTime: { type: String, required: true },
    idAuthor: { type: mongoose.Types.ObjectId, ref: 'Users', required: true }
  },
  {
    timeseries: true,
    timestamps: true,
    collection: 'Activities'
  }
);

const Activity = mongoose.model('Activities', activitySchema, 'Activities');
module.exports = Activity;
