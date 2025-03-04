const mongoose = require('mongoose');

const accommodationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: [
        'Cabaña',
        'Camping',
        'Casa de arbol',
        'Albergues',
        'Resorts',
        'Refugios'
      ]
    },
    services: [
      {
        type: String,
        required: true,
        enum: [
          'Gestión eficiente de recursos',
          'Alimentación Responsable',
          'Manejo de Residuos',
          'Alojamiento y decoración ecológica',
          'Actividades ecológicas',
          'Movilidad verde',
          'Educación y sostenibilidad',
          'Bienestar y conexión con la naturaleza',
          'Tecnología verde',
          'Responsabilidad Social'
        ]
      }
    ],
    description: { type: String, required: true },
    capacity: { type: Number, required: true },
    rules: { type: [String], required: true },
    ubi: { type: String, required: true },
    price: { type: Number, required: true },
    paymentType: {
      type: String,
      required: true,
      enum: ['Visa', 'PayPal', 'Transeferencía', 'Efectivo']
    },
    contactDetails: {
      email: {
        type: String,
        required: true,
        lowercase: true,
        match: [
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          'Por favor ingrese un correo electrónico válido'
        ]
      },
      phone: {
        type: String,
        required: true,
        match: [/^\d+$/, 'El teléfono solo puede contener números']
      }
    },
    images: [{ type: String }],
    idAuthor: { type: String, required: true },
   
  },
  {
    timeseries: true,
    timestamps: true,
    collection: 'Accommodations'
  }
);

const Accommodation = mongoose.model(
  'Accommodations',
  accommodationSchema,
  'Accommodations'
);
module.exports = Accommodation;
