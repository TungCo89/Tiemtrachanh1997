import BanRepository from "../repositories/ban";
export class BanModal {
  private banRepository: BanRepository;

  constructor(banRepository: BanRepository) {
    this.banRepository = banRepository;
  }

  async getAll(): Promise<any> {
    await this.banRepository.getAll();
  }

  async getByID(id: number): Promise<any> {
    await this.banRepository.getAll();
  }

  async createBan(ten_ban: string): Promise<void> {
    if (!ten_ban) {
      throw new Error("Dữ liệu không hợp lệ.");
    }
    await this.banRepository.createBan(ten_ban);
  }

  async updateBan(id: number, ten_ban: string, trang_thai: string): Promise<void> {
    if (!id || !ten_ban) {
      throw new Error("Dữ liệu cập nhật không hợp lệ.");
    }

    await this.banRepository.updateBan(id, ten_ban, trang_thai);
  }

  async deleteBan(id: number): Promise<void> {
    await this.banRepository.deleteBan(id);
  }

  // async searchBanByName(name: string): Promise<any> {
  //   await this.banRepository.searchBanByName(name);
  // }
}

export default BanModal;
