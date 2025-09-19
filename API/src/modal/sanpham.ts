import SanPhamRepository from "../repositories/sanpham";
export class SanPhamModal {
  private sanphamRepository: SanPhamRepository;

  constructor(sanphamRepository: SanPhamRepository) {
    this.sanphamRepository = sanphamRepository;
  }

  async getAll(): Promise<any> {
    return await this.sanphamRepository.getAll();
  }

  async getByID(id: number): Promise<any> {
    return await this.sanphamRepository.getByID(id);
  }

  async createSanPham(
    ten_san_pham: string,
    gia_ban: number,
    mo_ta: string,
    id_loai: number,
    cong_thuc: any[] 
  ): Promise<void> {
    if (
      !ten_san_pham ||
      gia_ban === undefined ||
      !id_loai ||
      !cong_thuc ||
      cong_thuc.length === 0
    ) {
      throw new Error("Dữ liệu sản phẩm và công thức không hợp lệ.");
    }
    await this.sanphamRepository.createSanPham(
      ten_san_pham,
      gia_ban,
      mo_ta,
      id_loai,
      cong_thuc
    );
  }

  async updateSanPham(
    id: number,
    ten_san_pham: string,
    gia_ban: number,
    mo_ta: string,
    id_loai: number,
    cong_thuc: any[]
  ): Promise<void> {
    if (
      !id ||
      !ten_san_pham ||
      gia_ban === undefined ||
      !id_loai ||
      !cong_thuc
    ) {
      throw new Error("Dữ liệu cập nhật không hợp lệ.");
    }

    await this.sanphamRepository.updateSanPham(
      id,
      ten_san_pham,
      gia_ban,
      mo_ta,
      id_loai,
      cong_thuc
    );
  }

  async deleteSanPham(id: number): Promise<void> {
    await this.sanphamRepository.deleteSanPham(id);
  }

  async searchSanPhamByName(name: string): Promise<any> {
    return await this.sanphamRepository.searchSanPhamByName(name);
  }
}

export default SanPhamModal;
