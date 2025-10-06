import HDBanRepository from "../repositories/hoadonban";
export class HDBanModal {
  private hdbanRepository: HDBanRepository;

  constructor(hdbanRepository: HDBanRepository) {
    this.hdbanRepository = hdbanRepository;
  }

  async getAll(): Promise<any> {
    return await this.hdbanRepository.getAll();
  }

  async getByID(id: number): Promise<any> {
    return await this.hdbanRepository.getByID(id);
  }

  async createHDBan(chi_tiet: any[]): Promise<void> {
    if (!chi_tiet || chi_tiet.length === 0) {
      throw new Error(
        "Dữ liệu hóa đơn nhập (Nhà cung cấp và Chi tiết) không hợp lệ."
      );
    }
    await this.hdbanRepository.createHDBan(chi_tiet);
  }

  async updateHDBan(id: number, chi_tiet: any[]): Promise<void> {
    if (!id || !chi_tiet) {
      throw new Error("Dữ liệu cập nhật không hợp lệ.");
    }

    await this.hdbanRepository.updateHDBan(id, chi_tiet);
  }

  async deleteHDBan(id: number): Promise<void> {
    await this.hdbanRepository.deleteHDBan(id);
  }

  // async searchHDBanByName(name: string): Promise<any[]> {
  //   const results = await this.hdbanRepository.searchHDBanByName(name);
  //   return this.processHDBanData(results);
  // }
}

export default HDBanModal;
