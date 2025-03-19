const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Por favor ingrese un correo electrónico válido']
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
      validate: {
        validator: function (v) {
          return /[a-z]/.test(v) && /[A-Z]/.test(v) && /[0-9]/.test(v) && /[!@#$%^&*(),.?":{}|<>]/.test(v);
        },
        message: 'La contraseña debe tener al menos una letra mayúscula, una minúscula, un número y un carácter especial'
      }
    },
    rol: {
      type: String,
      required: true,
      enum: ['user', 'owner'],
      default: 'user'
    },
    image: { type: String, default: './assets/user.png' },
    reservations: [{ type: mongoose.Types.ObjectId, ref: 'Reservations' }],
    isOwner: { type: Boolean, default: 'false' }
  },
  {
    timestamps: true,
    timeseries: true,
    collection: 'Users'
  }
);

userSchema.pre('save', function () {
  this.password = bcrypt.hashSync(this.password, 10);
});

const User = mongoose.model('Users', userSchema, 'Users');
module.exports = User;
