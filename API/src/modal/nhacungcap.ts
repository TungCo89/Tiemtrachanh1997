import NCCRepository from "../repositories/nhacungcap";
export class NCCModal {
  private nccRepository: NCCRepository;

  constructor(nccRepository: NCCRepository) {
    this.nccRepository = nccRepository;
  }

  async getAll(): Promise<any> {
    return await this.nccRepository.getAll();
  }

  async getByID(id: number): Promise<any> {
    return await this.nccRepository.getByID(id);
  }

  async createNCC(
    ten_ncc: string,
    dia_chi: string,
    so_dien_thoai: number
  ): Promise<void> {
    if (!ten_ncc || !dia_chi || !so_dien_thoai) {
      throw new Error("Dữ liệu không hợp lệ.");
    }
    await this.nccRepository.createNCC(ten_ncc, dia_chi, so_dien_thoai);
  }

  async updateNCC(
    id: number,
    ten_ncc: string,
    dia_chi: string,
    so_dien_thoai: number
  ): Promise<void> {
    if (!id || !ten_ncc || !dia_chi || !so_dien_thoai) {
      throw new Error("Dữ liệu cập nhật không hợp lệ.");
    }

    await this.nccRepository.updateNCC(id, ten_ncc, dia_chi, so_dien_thoai);
  }

  async deleteNCC(id: number): Promise<void> {
    await this.nccRepository.deleteNCC(id);
  }

  async searchNCCByKeyword(keyword: string): Promise<any> {
    return await this.nccRepository.searchNCCByKeyword(keyword);
  }
}

export default NCCModal;
