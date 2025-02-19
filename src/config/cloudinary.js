const cloudinary = require('cloudinary').v2;

function connectCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_secret: process.env.API_SECRET,
    api_key: process.env.API_KEY
  });
}

module.exports = {
  connectCloudinary
};
