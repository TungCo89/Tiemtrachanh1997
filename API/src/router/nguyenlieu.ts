import express, { Router } from 'express';
import NguyenLieuController from '../controller/nguyenlieu';
import NguyenLieuModal from '../modal/nguyenlieu';
import NguyenLieuRepository from '../repositories/nguyenlieu';

const nguyenlieuRouter: Router = express.Router();

const nguyenlieuRepository = new NguyenLieuRepository();
const nguyenlieuModal = new NguyenLieuModal(nguyenlieuRepository);
const nguyenlieuController = new NguyenLieuController(nguyenlieuModal);

nguyenlieuRouter.get('/get-all', nguyenlieuController.getAll.bind(nguyenlieuController));
nguyenlieuRouter.get('/get-by-ID', nguyenlieuController.getByID.bind(nguyenlieuController));
nguyenlieuRouter.get('/get-by-IDNCC', nguyenlieuController.getByIDNCC.bind(nguyenlieuController));
nguyenlieuRouter.post('/create', nguyenlieuController.createNguyenLieu.bind(nguyenlieuController));
nguyenlieuRouter.put('/update', nguyenlieuController.updateNguyenLieu.bind(nguyenlieuController));
nguyenlieuRouter.delete('/delete', nguyenlieuController.deleteNguyenLieu.bind(nguyenlieuController));
nguyenlieuRouter.get('/search-by-name', nguyenlieuController.searchNguyenLieuByName.bind(nguyenlieuController));


export default nguyenlieuRouter;
