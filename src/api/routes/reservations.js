const { isAuth } = require('../../middlewares/isAuth');
const { newReservation, deleteReservation } = require('../controllers/reservation');

const reservationsRouter = require('express').Router();

reservationsRouter.post('/newReservation', isAuth, newReservation);
reservationsRouter.delete('/deleteReservation/:id', isAuth, deleteReservation);

module.exports = reservationsRouter;
