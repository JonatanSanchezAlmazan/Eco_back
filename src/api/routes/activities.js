const { isAuth } = require('../../middlewares/isAuth');
const { isOwner } = require('../../middlewares/isOwner');
const upload = require('../../utils/cloudinary/file');
const { getActivities, getActivity, createActivity, updateActivity, deleteActivity, getRandomActivities } = require('../controllers/activity');
const Activity = require('../models/activity');

const activitiesRouter = require('express').Router();

activitiesRouter.get('/', getActivities);
activitiesRouter.get('/:id', getActivity);
activitiesRouter.get('/random/activities', getRandomActivities);
activitiesRouter.post('/createActivity', isAuth, isOwner(Activity), upload.fields([{ name: 'images', maxCount: 3 }]), createActivity);
activitiesRouter.put('/updateActivity/:id', isAuth, isOwner(Activity), upload.fields([{ name: 'images', maxCount: 3 }]), updateActivity);
activitiesRouter.delete('/deleteActivity/:id', isAuth, isOwner(Activity), deleteActivity);

module.exports = activitiesRouter;
