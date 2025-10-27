import HDBanRepository from "../repositories/hoadonban";
import dayjs from "dayjs";
export class HDBanModal {
  private hdbanRepository: HDBanRepository;

  constructor(hdbanRepository: HDBanRepository) {
    this.hdbanRepository = hdbanRepository;
  }
  private processHoaDonData(data: any[]): any[] {
    if (!data || data.length === 0) {
      return [];
    }
    const hoadonMap = new Map();
    const DATE_FORMAT = "DD/MM/YYYY HH:mm:ss";
    data.forEach((item) => {
      const hoadonId = item.id;

      if (!hoadonMap.has(hoadonId)) {
        const formattedNgayLap = dayjs(item.ngay_lap).format(DATE_FORMAT);
        hoadonMap.set(hoadonId, {
          id: item.id,
          id_ban: item.id_ban,
          ten_ban: item.ten_ban,
          ngay_lap: formattedNgayLap,
          tong_tien: parseFloat(item.tong_tien),
          chi_tiet: [],
        });
      }

      if (item.id_cthdn !== null) {
        hoadonMap.get(hoadonId).chi_tiet.push({
          id_cthdb: item.id_cthdb,
          id_san_pham: item.id_san_pham,
          ten_san_pham: item.ten_san_pham,
          so_luong: parseFloat(item.so_luong),
          don_gia: parseFloat(item.don_gia),
        });
      }
    });

    // Chuyển Map values thành Array và trả về
    return Array.from(hoadonMap.values());
  }
  async getAll(): Promise<any> {
    const results = await this.hdbanRepository.getAll();
    return this.processHoaDonData(results);
  }

  async getByID(id: number): Promise<any> {
    const results = await this.hdbanRepository.getByID(id);
    const processed = this.processHoaDonData(results[0]);
    return processed.length > 0 ? processed[0] : null;
  }

  async createHDBan(id_ban: number, chiTietHoanChinh: any[]): Promise<void> {
    if (!id_ban || !chiTietHoanChinh || chiTietHoanChinh.length === 0) {
      throw new Error("Dữ liệu tạo hóa đơn bán không hợp lệ.");
    }
    const chiTietJson = JSON.stringify(chiTietHoanChinh);
    await this.hdbanRepository.createHDBan(id_ban, chiTietJson);
  }

  async updateHDBan(id: number, chiTietHoanChinh: any[]): Promise<void> {
    if (!id || !chiTietHoanChinh) {
      throw new Error("Dữ liệu cập nhật không hợp lệ.");
    }
    const chiTietJson = JSON.stringify(chiTietHoanChinh);
    await this.hdbanRepository.updateHDBan(id, chiTietJson);
  }

  async deleteHDBan(id: number): Promise<void> {
    await this.hdbanRepository.deleteHDBan(id);
  }

  async searchByKeyword(keyword: string): Promise<any[]> {
    const results = await this.hdbanRepository.searchByKeyword(keyword);
    return this.processHoaDonData(results);
  }
}

export default HDBanModal;
