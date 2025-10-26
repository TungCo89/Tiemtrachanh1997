import express, { Router } from 'express';
import HDNhapController from '../controller/hoadonnhap';
import HDNhapModal from '../modal/hoadonnhap';
import HDNhapRepository from '../repositories/hoadonnhap';

const hdnhapRouter: Router = express.Router();

const hdnhapRepository = new HDNhapRepository();
const hdnhapModal = new HDNhapModal(hdnhapRepository);
const hdnhapController = new HDNhapController(hdnhapModal);
// CreateHoaDonNhap DeleteHoaDonNhap GetAllHoaDonNhap GetHoaDonNhapByID

hdnhapRouter.get('/get-all', hdnhapController.getAll.bind(hdnhapController));
hdnhapRouter.get('/get-by-ID', hdnhapController.getByID.bind(hdnhapController));
hdnhapRouter.post('/create', hdnhapController.createHDNhap.bind(hdnhapController));
// hdnhapRouter.put('/update', hdnhapController.updateHDNhap.bind(hdnhapController));
hdnhapRouter.delete('/delete', hdnhapController.deleteHDNhap.bind(hdnhapController));
hdnhapRouter.get('/search-by-keyword', hdnhapController.searchByKeyword.bind(hdnhapController));


export default hdnhapRouter;
