import LoaiSanPhamRepository from "../repositories/loaisanpham";
export class LoaiSanPhamModal {
  private loaisanphamRepository: LoaiSanPhamRepository;

  constructor(loaisanphamRepository: LoaiSanPhamRepository) {
    this.loaisanphamRepository = loaisanphamRepository;
  }

  async getAll(): Promise<any> {
    return await this.loaisanphamRepository.getAll();
  }

  async getByID(id: number): Promise<any> {
    return await this.loaisanphamRepository.getByID(id);
  }

  async createLoaiSanPham(ten_loai: string, mo_ta: string): Promise<void> {
    if (!ten_loai || !mo_ta) {
      throw new Error("Dữ liệu không hợp lệ.");
    }
    await this.loaisanphamRepository.createLoaiSanPham(ten_loai, mo_ta);
  }

  async updateLoaiSanPham(
    id: number,
    ten_loai: string,
    mo_ta: string
  ): Promise<void> {
    if (!id || !ten_loai || !mo_ta) {
      throw new Error("Dữ liệu cập nhật không hợp lệ.");
    }

    await this.loaisanphamRepository.updateLoaiSanPham(id, ten_loai, mo_ta);
  }

  async deleteLoaiSanPham(id: number): Promise<void> {
    await this.loaisanphamRepository.deleteLoaiSanPham(id);
  }

  async searchLoaiSanPhamByName(name: string): Promise<any> {
    return await this.loaisanphamRepository.searchLoaiSanPhamByName(name);
  }
}

export default LoaiSanPhamModal;
