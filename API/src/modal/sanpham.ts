import SanPhamRepository from "../repositories/sanpham";
export class SanPhamModal {
  private sanphamRepository: SanPhamRepository;

  constructor(sanphamRepository: SanPhamRepository) {
    this.sanphamRepository = sanphamRepository;
  }

  async getAll(): Promise<any> {
    return await this.sanphamRepository.getAll();
  }
}

export default SanPhamModal;
