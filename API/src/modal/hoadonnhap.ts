import HDNhapRepository from "../repositories/hoadonnhap";
import dayjs from "dayjs";
export class HDNhapModal {
  private hdnhapRepository: HDNhapRepository;

  constructor(hdnhapRepository: HDNhapRepository) {
    this.hdnhapRepository = hdnhapRepository;
  }
  private processHoaDonData(data: any[]): any[] {
    if (!data || data.length === 0) {
      return [];
    }
    const hoadonMap = new Map();
    const DATE_FORMAT = "DD/MM/YYYY HH:mm:ss";
    data.forEach((item) => {
      const hoadonId = item.id_hoa_don_nhap;

      if (!hoadonMap.has(hoadonId)) {
        const formattedNgayNhap = dayjs(item.ngay_nhap).format(DATE_FORMAT);
        hoadonMap.set(hoadonId, {
          id: item.id_hoa_don_nhap,
          id_ncc: item.id_ncc,
          ten_ncc: item.ten_ncc,
          ngay_nhap: formattedNgayNhap,
          ghi_chu: item.ghi_chu,
          tong_tien: parseFloat(item.tong_tien),
          chi_tiet: [],
        });
      }

      if (item.id_cthdn !== null) {
        hoadonMap.get(hoadonId).chi_tiet.push({
          id_cthdn: item.id_cthdn,
          id_nguyen_lieu: item.id_nguyen_lieu,
          ten_nguyen_lieu: item.ten_nguyen_lieu,
          so_luong: parseFloat(item.so_luong),
          don_gia: parseFloat(item.don_gia),
          thanh_tien: parseFloat(item.thanh_tien),
        });
      }
    });

    // Chuyển Map values thành Array và trả về
    return Array.from(hoadonMap.values());
  }
  async getAll(): Promise<any> {
    const results = await this.hdnhapRepository.getAll();
    return this.processHoaDonData(results);
  }

  async getByID(id: number): Promise<any> {
    const results = await this.hdnhapRepository.getByID(id);
    const processed = this.processHoaDonData(results[0]);
    return processed.length > 0 ? processed[0] : null;
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
    id:number,
    id_ncc: number,
    ghi_chu: string,
    chiTietHoanChinh: any[]
  ): Promise<void> {
    if (!id_ncc || !chiTietHoanChinh || chiTietHoanChinh.length === 0) {
      throw new Error(
        "Dữ liệu hóa đơn nhập (Nhà cung cấp và Chi tiết) không hợp lệ."
      );
    }
    const chiTietJson = JSON.stringify(chiTietHoanChinh);
    await this.hdnhapRepository.updateHDNhap(id,id_ncc, ghi_chu, chiTietJson);
  }

  async deleteHDNhap(id: number): Promise<void> {
    await this.hdnhapRepository.deleteHDNhap(id);
  }

  async searchByKeyword(keyword: string): Promise<any[]> {
    const results = await this.hdnhapRepository.searchByKeyword(keyword);
    return this.processHoaDonData(results);
  }
}

export default HDNhapModal;
