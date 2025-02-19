const cloudinary = require('cloudinary').v2;

function deleteFile(url) {
  if (url) {
    const urlSplited = url.split('/');
    const folderName = urlSplited.at(-2);
    const fileName = urlSplited.at(-1).split('.')[0];
    cloudinary.uploader.destroy(`${folderName}/${fileName}`, () => {
      console.log('Imagen eliminada correctamente');
    });
  }
}
module.exports = { deleteFile };
