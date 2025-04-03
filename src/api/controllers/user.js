const { deleteFile } = require('../../utils/cloudinary/deleteFile');
const { generateSign } = require('../../utils/jwt/jwt');
const User = require('../models/user');
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcryptjs');
const emailRegex = require('../../utils/Variables/emailRegex');
const jwt = require('jsonwebtoken');
const Accommodation = require('../models/accommodation');
const Activity = require('../models/activity');

async function register(req, res) {
  try {
    const user = new User(req.body);

    if (user.rol === 'owner') {
      user.isOwner = true;
    }

    const { email } = req.body;
    const userDuplicated = await User.findOne({ email });

    if (userDuplicated) {
      if (req.file) {
        deleteFile(req.file.path);
      }
      return res.status(400).json({
        message: 'Usuario ya existente, pruebe con otras credenciales'
      });
    }

    if (req.file) {
      user.image = req.file.path;
    } else {
      const result = await cloudinary.uploader.upload('https://res.cloudinary.com/dusg4mmis/image/upload/v1742721442/users/sj6bpdw5di9hoxwi4pkk.png', { folder: 'users' });
      user.image = (await result).secure_url;
    }

    const userSaved = await user.save();

    return res.status(201).json({
      message: 'Usuario creado correctamente',
      userSaved
    });
  } catch (error) {
    return res.status(500).json({
      error: error,
      message: 'Internal Server Error'
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select(' email password isOwner image');

    if (!user) {
      return res.status(400).json({
        message: 'Email o contraseña incorrectos'
      });
    }

    if (bcrypt.compareSync(password, user.password)) {
      const token = generateSign(user._id);
      user.password = undefined;
      user.rol = undefined;
      user.email = undefined;

      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        maxAge: 3600000,
        path: '/'
      });

      // res.cookie('auth_token', token, {
      //   httpOnly: true,
      //   secure: true,
      //   sameSite: 'None',
      //   maxAge: 3600000,
      //   domain: '.eco-back-ebon.vercel.app',
      //   path: '/'
      // });

      return res.status(200).json({
        message: 'Login realizado correctamente',
        user
      });
    } else {
      return res.status(400).json({
        message: 'Email o contraseña incorrectos'
      });
    }
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
}

async function getUsers({ res }) {
  try {
    const users = await User.find().select('name email reservations');

    return res.status(200).json({
      message: 'Listado de usuarios',
      users
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
}
async function getUser(req, res) {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select('name email image isOwner reservations')
      .populate({
        path: 'reservations',
        populate: [
          {
            path: 'activityId',
            select: 'name'
          },
          {
            path: 'accommodationId',
            select: 'name'
          }
        ]
      })
      .exec();
    return res.status(200).json({
      message: 'Usuario',
      user
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { email } = req.body;

    if (email && !emailRegex.test(email)) {
      return res.status(400).json({
        message: 'Por favor ingrese un correo electrónico válido'
      });
    }

    const oldUser = await User.findById(id);

    if (req.file) {
      deleteFile(oldUser.image);
      req.body.image = req.file.path;
    }

    const user = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          image: req.body.image
        }
      },
      {
        new: true
      }
    )
      .select('name email image isOwner reservations')
      .populate({
        path: 'reservations',
        populate: [
          {
            path: 'activityId',
            select: 'name'
          },
          {
            path: 'accommodationId',
            select: 'name'
          }
        ]
      })
      .exec();
    return res.status(200).json({
      message: 'Usuario actualizado correctamente',
      user
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const oldUser = await User.findById(id);
    const accommodations = await Accommodation.find({ idAuthor: id });
    console.log(accommodations);

    const activities = await Activity.find({ idAuthor: id });

    if (accommodations.length > 0) {
      return res.status(400).json({
        message: 'No puedes eliminar la cuenta con alojamientos creados'
      });
    }

    if (activities.length > 0) {
      return res.status(400).json({
        message: 'No puedes eliminar la cuenta con actividades creadas'
      });
    }

    if (oldUser.reservations.length > 0) {
      return res.status(400).json({
        message: 'No puedes eliminar la cuenta con reservas pendientes'
      });
    }
    const user = await User.findByIdAndDelete(id, { new: true });
    deleteFile(oldUser.image);
    return res.status(200).json({
      message: 'Usuario eliminado correctamente',
      user
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
}

async function logout({ res }) {
  try {
    res.clearCookie('auth_token', { httpOnly: true, secure: true, sameSite: 'None', domain: '.eco-back-ebon.vercel.app', path: '/' });
    return res.status(200).json({
      message: '¡Hasta pronto, explorador!'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }
}

module.exports = { register, login, getUsers, getUser, updateUser, deleteUser, logout };
