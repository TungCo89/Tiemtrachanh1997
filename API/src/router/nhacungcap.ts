import express, { Router } from 'express';
import NCCController from '../controller/nhacungcap';
import NCCModal from '../modal/nhacungcap';
import NCCRepository from '../repositories/nhacungcap';

const nccRouter: Router = express.Router();

const nccRepository = new NCCRepository();
const nccModal = new NCCModal(nccRepository);
const nccController = new NCCController(nccModal);
// CreateNCC UpdateNCC DeleteNCC GetAllNCC GetNCCByID SearchNCC GetNguyenLieuByNCCID GetAllNguyenLieuByNCC

nccRouter.get('/get-all', nccController.getAll.bind(nccController));
nccRouter.get('/get-by-ID', nccController.getByID.bind(nccController));
nccRouter.get('/get-NguyenLieu-by-NCCID', nccController.getNguyenLieubyNCCID.bind(nccController));
nccRouter.post('/create', nccController.createNCC.bind(nccController));
nccRouter.put('/update', nccController.updateNCC.bind(nccController));
nccRouter.delete('/delete', nccController.deleteNCC.bind(nccController));
nccRouter.get('/search-by-keyword', nccController.searchNCCByKeyword.bind(nccController));

export default nccRouter;
