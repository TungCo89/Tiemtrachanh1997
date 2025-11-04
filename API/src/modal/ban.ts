import BanRepository from "../repositories/ban";
export class BanModal {
  private banRepository: BanRepository;

  constructor(banRepository: BanRepository) {
    this.banRepository = banRepository;
  }

  async getAll(): Promise<any> {
    return await this.banRepository.getAll();
  }

  async getByID(id: number): Promise<any> {
    return await this.banRepository.getByID(id);
  }

  async getBanByIDKhuVuc(id: number): Promise<any> {
    return await this.banRepository.getBanByIDKhuVuc(id);
  }

  async createBan(ten_ban: string, id_khu_vuc: number): Promise<void> {
    if (!ten_ban || !id_khu_vuc) {
      throw new Error("Dữ liệu không hợp lệ.");
    }
    await this.banRepository.createBan(ten_ban, id_khu_vuc);
  }

  async updateBan(
    id: number,
    ten_ban: string,
    trang_thai: string,
    id_khu_vuc: number
  ): Promise<void> {
    if (!id || !ten_ban) {
      throw new Error("Dữ liệu cập nhật không hợp lệ.");
    }

    await this.banRepository.updateBan(id, ten_ban, trang_thai, id_khu_vuc);
  }

  async deleteBan(id: number): Promise<void> {
    await this.banRepository.deleteBan(id);
  }

  // async searchBanByName(name: string): Promise<any> {
  //   return await this.banRepository.searchBanByName(name);
  // }
  async donBan(id: number): Promise<any> {
    return await this.banRepository.donBan(id);
  }
  async thanhToan(id: number): Promise<any> {
    return await this.banRepository.thanhToan(id);
  }
}

export default BanModal;
