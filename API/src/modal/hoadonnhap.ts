import HDNhapRepository from "../repositories/hoadonnhap";
export class HDNhapModal {
  private hdnhapRepository: HDNhapRepository;

  constructor(hdnhapRepository: HDNhapRepository) {
    this.hdnhapRepository = hdnhapRepository;
  }

  async getAll(): Promise<any> {
    return await this.hdnhapRepository.getAll();
  }

  async getByID(id: number): Promise<any> {
    return await this.hdnhapRepository.getByID(id);
  }

  async createHDNhap(
    id_ncc: number,
    ghi_chu: string,
    chiTiet: any[]
  ): Promise<void> {
    if (!id_ncc || !chiTiet || chiTiet.length === 0) {
      throw new Error(
        "Dữ liệu hóa đơn nhập (Nhà cung cấp và Chi tiết) không hợp lệ."
      );
    }
    const chiTietJson = JSON.stringify(chiTiet);
    await this.hdnhapRepository.createHDNhap(id_ncc, ghi_chu, chiTietJson);
  }

  async updateHDNhap(
    id_ncc: number,
    ghi_chu: string,
    chiTiet: any[]
  ): Promise<void> {
    if (!id_ncc || !chiTiet || chiTiet.length === 0) {
      throw new Error(
        "Dữ liệu hóa đơn nhập (Nhà cung cấp và Chi tiết) không hợp lệ."
      );
    }
    const chiTietJson = JSON.stringify(chiTiet);
    await this.hdnhapRepository.updateHDNhap(id_ncc, ghi_chu, chiTietJson);
  }

  async deleteHDNhap(id: number): Promise<void> {
    await this.hdnhapRepository.deleteHDNhap(id);
  }

  // async searchHDNhapByName(name: string): Promise<any[]> {
  //   const results = await this.hdnhapRepository.searchHDNhapByName(name);
  //   return this.processHDNhapData(results);
  // }
}

export default HDNhapModal;
