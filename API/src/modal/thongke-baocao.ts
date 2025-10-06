import ThongKeRepository from "../repositories/thongke-baocao";
export class ThongKeModal {
  private thongkeRepository: ThongKeRepository;

  constructor(thongkeRepository: ThongKeRepository) {
    this.thongkeRepository = thongkeRepository;
  }

  private validateDates(startDate: string, endDate: string): void {
    if (!startDate || !endDate) {
      throw new Error("Ngày bắt đầu và ngày kết thúc không được để trống.");
    }
    if (new Date(startDate) > new Date(endDate)) {
      throw new Error("Ngày bắt đầu không thể lớn hơn ngày kết thúc.");
    }
  }

  async getDoanhThu(startDate: string, endDate: string): Promise<any> {
    this.validateDates(startDate, endDate);
    return await this.thongkeRepository.getDoanhThuByDateRange(
      startDate,
      endDate
    );
  }

  async getLoiNhuanSoBo(startDate: string, endDate: string): Promise<any> {
    this.validateDates(startDate, endDate);
    return await this.thongkeRepository.getLoiNhuanSoBo(startDate, endDate);
  }

  async getHieuSuatThongKe(
    startDate: string,
    endDate: string,
    topN: number = 10
  ): Promise<any> {
    this.validateDates(startDate, endDate);
    if (topN < 1) {
      topN = 10;
    }
    return await this.thongkeRepository.getHieuSuatThongKe(
      startDate,
      endDate,
      topN
    );
  }
}

export default ThongKeModal;
