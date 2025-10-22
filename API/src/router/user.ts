import express, { Router } from 'express';
import UserController from '../controller/user';
import UserModal from '../modal/user';
import UserRepository from '../repositories/user';

const userRouter: Router = express.Router();
const userRepository = new UserRepository();
const userModal = new UserModal(userRepository);
const userController = new UserController(userModal);

userRouter.get('/get-all', userController.getAll.bind(userController));
userRouter.get('/get-by-id', userController.getByID.bind(userController));
userRouter.get('/get-by-email', userController.getUserByUserEmail.bind(userController));
userRouter.get('/roles', userController.getRoles.bind(userController));
userRouter.post('/signup', userController.signup.bind(userController));
userRouter.post('/login', userController.login.bind(userController));
userRouter.put('/update', userController.update.bind(userController));
userRouter.post('/delete', userController.delete.bind(userController));
userRouter.get('/search-by-keyword', userController.delete.bind(userController));

export default userRouter;
