import express, { Router } from 'express';
import SanPhamController from '../controller/sanpham';
import SanPhamModal from '../modal/sanpham';
import SanPhamRepository from '../repositories/sanpham';

const sanphamRouter: Router = express.Router();

const sanphamRepository = new SanPhamRepository();
const sanphamModal = new SanPhamModal(sanphamRepository);
const sanphamController = new SanPhamController(sanphamModal);

sanphamRouter.get('/get-all', sanphamController.getAll.bind(sanphamController));
sanphamRouter.get('/get-by-ID', sanphamController.getByID.bind(sanphamController));
sanphamRouter.post('/create', sanphamController.createSanPham.bind(sanphamController));
sanphamRouter.put('/update', sanphamController.updateSanPham.bind(sanphamController));
sanphamRouter.delete('/delete', sanphamController.deleteSanPham.bind(sanphamController));
sanphamRouter.get('/search-by-name', sanphamController.searchSanPhamByName.bind(sanphamController));


export default sanphamRouter;
