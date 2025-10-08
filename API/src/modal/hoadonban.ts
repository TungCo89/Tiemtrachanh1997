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

  async createHDBan(id_ban: number, chi_tiet: any[]): Promise<void> {
    if (!id_ban || !chi_tiet || chi_tiet.length === 0) {
      throw new Error("Dữ liệu tạo hóa đơn bán không hợp lệ.");
    }
    const chiTietJson = JSON.stringify(chi_tiet);
    await this.hdbanRepository.createHDBan(id_ban, chiTietJson);
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
