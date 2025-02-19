const accommodationsRouter = require('./accommodations');
const activitiesRouter = require('./activities');
const reservationsRouter = require('./reservations');
const userRouter = require('./users');

const mainRouter = require('express').Router();

mainRouter.use('/users', userRouter);
mainRouter.use('/activities', activitiesRouter);
mainRouter.use('/accommodations', accommodationsRouter);
mainRouter.use('/reservations', reservationsRouter);

module.exports = mainRouter;
