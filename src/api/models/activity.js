const moongose = require('mongoose');

const activitySchema = new moongose.Schema(
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

    requirements: { type: [String], required: true },
    images: [{ type: String }],
    capacity: { type: Number, required: true },
    includes: { type: [String], required: true },
    schedule: { type: String, required: true },
    startTime: { type: String, required: true },
    idAuthor: { type: String, required: true }
  },
  {
    timeseries: true,
    timestamps: true,
    collection: 'Activities'
  }
);

const Activity = moongose.model('Activities', activitySchema, 'Activities');
module.exports = Activity;
