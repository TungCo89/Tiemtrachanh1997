import express, { Router } from 'express';
import HDBanController from '../controller/hoadonban';
import HDBanModal from '../modal/hoadonban';
import HDBanRepository from '../repositories/hoadonban';

const hdbanRouter: Router = express.Router();

const hdbanRepository = new HDBanRepository();
const hdbanModal = new HDBanModal(hdbanRepository);
const hdbanController = new HDBanController(hdbanModal);
// CreateHoaDonBan UpdateHoaDonBan DeleteHoaDonBan GetAllHoaDonBan GetHoaDonBanByID

hdbanRouter.get('/get-all', hdbanController.getAll.bind(hdbanController));
hdbanRouter.get('/get-by-ID', hdbanController.getByID.bind(hdbanController));
hdbanRouter.post('/create', hdbanController.createHDBan.bind(hdbanController));
hdbanRouter.put('/update', hdbanController.updateHDBan.bind(hdbanController));
hdbanRouter.delete('/delete', hdbanController.deleteHDBan.bind(hdbanController));
// hdbanRouter.get('/search-by-name', hdbanController.searchHDBanByName.bind(hdbanController));


export default hdbanRouter;
