import express, { Router } from 'express';
import SanPhamController from '../controller/sanpham';
import SanPhamModal from '../modal/sanpham';
import SanPhamRepository from '../repositories/sanpham';

const sanphamRouter: Router = express.Router();

const sanphamRepository = new SanPhamRepository();
const sanphamModal = new SanPhamModal(sanphamRepository);
const sanphamController = new SanPhamController(sanphamModal);

sanphamRouter.get('/get-all', sanphamController.getAll.bind(sanphamController));

export default sanphamRouter;
