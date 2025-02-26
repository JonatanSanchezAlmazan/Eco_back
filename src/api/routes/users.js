const { isAuth } = require('../../middlewares/isAuth');
const { isOwner } = require('../../middlewares/isOwner');
const { isSelf } = require('../../middlewares/isSelf');
const upload = require('../../utils/cloudinary/file');
const { register, getUsers, updateUser, login, getUser, deleteUser, logout, verifyToken } = require('../controllers/user');

const userRouter = require('express').Router();
userRouter.get('/verifyToken', verifyToken);
userRouter.get('/', getUsers);
userRouter.get('/:id', getUser);
userRouter.post('/register', upload.single('image'), register);
userRouter.post('/login', login);
userRouter.post('/logout', logout);
userRouter.put('/updateUser/:id', isAuth, isSelf, upload.single('image'), updateUser);
userRouter.delete('/deleteUser/:id', isAuth, isSelf, deleteUser);
module.exports = userRouter;
