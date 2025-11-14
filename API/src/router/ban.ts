import express, { Router } from 'express';
import BanController from '../controller/ban';
import BanModal from '../modal/ban';
import BanRepository from '../repositories/ban';

const banRouter: Router = express.Router();

const banRepository = new BanRepository();
const banModal = new BanModal(banRepository);
const banController = new BanController(banModal);

banRouter.get('/get-all', banController.getAll.bind(banController));
banRouter.get('/get-by-ID', banController.getByID.bind(banController));
banRouter.get('/get-ban-by-IDKhuVuc', banController.getByID.bind(banController));
banRouter.post('/create', banController.createBan.bind(banController));
banRouter.put('/update', banController.updateBan.bind(banController));
banRouter.delete('/delete', banController.deleteBan.bind(banController));
banRouter.post('/don-ban', banController.donBan.bind(banController));
banRouter.post('/thanh-toan-by-IDBan', banController.thanhToan.bind(banController));


export default banRouter;
