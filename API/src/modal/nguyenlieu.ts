import NguyenLieuRepository from "../repositories/nguyenlieu";
export class NguyenLieuModal {
  private nguyenlieuRepository: NguyenLieuRepository;

  constructor(nguyenlieuRepository: NguyenLieuRepository) {
    this.nguyenlieuRepository = nguyenlieuRepository;
  }

  async getAll(): Promise<any> {
    return await this.nguyenlieuRepository.getAll();
  }

  async getByID(id: number): Promise<any> {
    return await this.nguyenlieuRepository.getByID(id);
  }

  async getByIDNCC(id: number): Promise<any> {
    return await this.nguyenlieuRepository.getByIDNCC(id);
  }

  async createNguyenLieu(
    ten_nguyen_lieu: string,
    don_vi: number
  ): Promise<void> {
    await this.nguyenlieuRepository.createNguyenLieu(ten_nguyen_lieu, don_vi);
  }

  async updateNguyenLieu(
    id: number,
    ten_nguyen_lieu: string,
    don_vi: number
  ): Promise<void> {
    if (!id || !ten_nguyen_lieu || !don_vi) {
      throw new Error("Dữ liệu cập nhật không hợp lệ.");
    }

    await this.nguyenlieuRepository.updateNguyenLieu(
      id,
      ten_nguyen_lieu,
      don_vi
    );
  }

  async deleteNguyenLieu(id: number): Promise<void> {
    await this.nguyenlieuRepository.deleteNguyenLieu(id);
  }

  async searchNguyenLieuByName(name: string): Promise<any> {
    return await this.nguyenlieuRepository.searchNguyenLieuByName(name);
  }
}

export default NguyenLieuModal;
