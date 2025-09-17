import express, { Router } from 'express';
import GiaoVienController from '../controller/giaovien';
import GiaoVienModal from '../modal/giaovien';
import GiaoVienRepository from '../repositories/giaovien';

const giaovienRouter: Router = express.Router();


const giaovienRepository = new GiaoVienRepository();
const giaovienModal = new GiaoVienModal(giaovienRepository);
const giaovienController = new GiaoVienController(giaovienModal);

giaovienRouter.get('/get-all', giaovienController.getAll.bind(giaovienController));

export default giaovienRouter;
