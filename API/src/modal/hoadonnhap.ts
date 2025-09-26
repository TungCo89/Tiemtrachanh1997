import HDNhapRepository from "../repositories/hoadonnhap";
export class HDNhapModal {
  private hdnhapRepository: HDNhapRepository;

  constructor(hdnhapRepository: HDNhapRepository) {
    this.hdnhapRepository = hdnhapRepository;
  }

  async getAll(): Promise<any> {
    await this.hdnhapRepository.getAll();
  }

  async getByID(id: number): Promise<any> {
    await this.hdnhapRepository.getByID(id);
  }

  async createHDNhap(
    id_ncc: number,
    ghi_chu: string,
    chi_tiet: any[]
  ): Promise<void> {
    if (!id_ncc || !chi_tiet || chi_tiet.length === 0) {
      throw new Error(
        "Dữ liệu hóa đơn nhập (Nhà cung cấp và Chi tiết) không hợp lệ."
      );
    }

    await this.hdnhapRepository.createHDNhap(id_ncc, ghi_chu, chi_tiet);
  }

  // async updateHDNhap(
  //   id: number,
  //   ten_san_pham: string,
  //   gia_ban: number,
  //   mo_ta: string,
  //   id_loai: number,
  //   cong_thuc: any[]
  // ): Promise<void> {
  //   if (
  //     !id ||
  //     !ten_san_pham ||
  //     gia_ban === undefined ||
  //     !id_loai ||
  //     !cong_thuc
  //   ) {
  //     throw new Error("Dữ liệu cập nhật không hợp lệ.");
  //   }

  //   await this.hdnhapRepository.updateHDNhap(
  //     id,
  //     ten_san_pham,
  //     gia_ban,
  //     mo_ta,
  //     id_loai,
  //     cong_thuc
  //   );
  // }

  async deleteHDNhap(id: number): Promise<void> {
    await this.hdnhapRepository.deleteHDNhap(id);
  }

  // async searchHDNhapByName(name: string): Promise<any[]> {
  //   const results = await this.hdnhapRepository.searchHDNhapByName(name);
  //   return this.processHDNhapData(results);
  // }
}

export default HDNhapModal;
