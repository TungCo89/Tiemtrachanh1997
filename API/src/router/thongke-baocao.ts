import express, { Router } from 'express';
import ThongKeController from '../controller/thongke-baocao';
import ThongKeModal from '../modal/thongke-baocao';
import ThongKeRepository from '../repositories/thongke-baocao';

const thongkeRouter: Router = express.Router();
const thongkeRepository = new ThongKeRepository();
const thongkeModal = new ThongKeModal(thongkeRepository);
const thongkeController = new ThongKeController(thongkeModal);

thongkeRouter.get('/doanh-thu', thongkeController.getDoanhThu.bind(thongkeController));
thongkeRouter.get('/loi-nhuan-so-bo', thongkeController.getLoiNhuanSoBo.bind(thongkeController));
thongkeRouter.get('/hieu-suat-san-pham', thongkeController.getHieuSuatSanPham.bind(thongkeController));
thongkeRouter.get('/so-don-hang', thongkeController.getSoDonHang.bind(thongkeController));
thongkeRouter.get('/ton-kho-nguyen-lieu', thongkeController.getTonKhoNguyenLieu.bind(thongkeController));

export default thongkeRouter;
