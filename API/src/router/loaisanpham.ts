import express, { Router } from 'express';
import LoaiSanPhamController from '../controller/loaisanpham';
import LoaiSanPhamModal from '../modal/loaisanpham';
import LoaiSanPhamRepository from '../repositories/loaisanpham';

const loaisanphamRouter: Router = express.Router();

const loaisanphamRepository = new LoaiSanPhamRepository();
const loaisanphamModal = new LoaiSanPhamModal(loaisanphamRepository);
const loaisanphamController = new LoaiSanPhamController(loaisanphamModal);

loaisanphamRouter.get('/get-all', loaisanphamController.getAll.bind(loaisanphamController));
loaisanphamRouter.get('/get-by-ID', loaisanphamController.getByID.bind(loaisanphamController));
loaisanphamRouter.post('/create', loaisanphamController.createLoaiSanPham.bind(loaisanphamController));
loaisanphamRouter.put('/update', loaisanphamController.updateLoaiSanPham.bind(loaisanphamController));
loaisanphamRouter.delete('/delete', loaisanphamController.deleteLoaiSanPham.bind(loaisanphamController));
loaisanphamRouter.get('/search-by-name', loaisanphamController.searchLoaiSanPhamByName.bind(loaisanphamController));


export default loaisanphamRouter;
