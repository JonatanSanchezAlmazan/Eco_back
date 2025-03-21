const { isAuth } = require('../../middlewares/isAuth');
const { isOwner } = require('../../middlewares/isOwner');
const upload = require('../../utils/cloudinary/file');
const { getAccommodations, getAccommodation, createAccommodations, updateAccommodations, deleteAccommodations, getRandomAccommodations } = require('../controllers/accommodation');
const Accommodation = require('../models/accommodation');

const accommodationsRouter = require('express').Router();

accommodationsRouter.get('/', getAccommodations);
accommodationsRouter.get('/:id', getAccommodation);
accommodationsRouter.get('/random/accommodations', getRandomAccommodations);
accommodationsRouter.post('/createAccommodation', isAuth, isOwner(Accommodation), upload.fields([{ name: 'images', maxCount: 3 }]), createAccommodations);
accommodationsRouter.put('/updateAccommodation/:id', isAuth, isOwner(Accommodation), upload.fields([{ name: 'images', maxCount: 3 }]), updateAccommodations);
accommodationsRouter.delete('/deleteAccommodation/:id', isAuth, isOwner(Accommodation), deleteAccommodations);
module.exports = accommodationsRouter;
