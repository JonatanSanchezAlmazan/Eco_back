const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const cloudinary = require('cloudinary').v2;

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: (req) => {
      return req.baseUrl.split('/').at(-1);
    },
    allowedFormats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
    transformation: [{ fetch_format: 'webp', quality: 'auto:good' }]
  }
});

const upload = multer({ storage });
module.exports = upload;
