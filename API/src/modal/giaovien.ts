import GiaoVienRepository from "../repositories/giaovien";
export class GiaoVienModal {
  private giaovienRepository: GiaoVienRepository;

  constructor(giaovienRepository: GiaoVienRepository) {
    this.giaovienRepository = giaovienRepository;
  }

  async getAll(): Promise<any> {
    return await this.giaovienRepository.getAll();
  }
}

export default GiaoVienModal;
