import ThongKeRepository from "../repositories/thongke-baocao";
import dayjs from "dayjs";

const DATE_FORMAT = "YYYY-MM-DD";

interface RawDoanhThuData {
  ngay: string;
  tong_doanh_thu: string;
}

interface RawLoiNhuanData extends RawDoanhThuData {
  tong_chi_phi_nguyen_lieu: string;
  loi_nhuan_so_bo: string;
}

interface RawHieuSuatSanPhamData {
  ten_san_pham: string;
  ten_loai: string;
  tong_so_luong_ban: string;
  tong_doanh_thu_san_pham: string;
}

export interface FormattedDoanhThuData {
  ngay: string;
  tong_doanh_thu: number;
}

export interface FormattedLoiNhuanData extends FormattedDoanhThuData {
  tong_chi_phi_nguyen_lieu: number;
  loi_nhuan_so_bo: number;
}

export interface FormattedHieuSuatSanPhamData {
  ten_san_pham: string;
  ten_loai: string;
  tong_so_luong_ban: number;
  tong_doanh_thu_san_pham: number;
}
export interface SoDonHangResponse {
  tong_so_don_hang: number;
}

export interface TonKhoNguyenLieuResponse {
  ten_nguyen_lieu: string;
  so_luong_ton: number;
  don_vi_tinh: string;
}

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

  private generateDateRange(startDate: string, endDate: string): string[] {
    const dates: string[] = [];
    let currentDate = dayjs(startDate);
    const lastDate = dayjs(endDate);

    while (currentDate.isBefore(lastDate) || currentDate.isSame(lastDate)) {
      dates.push(currentDate.format("YYYY-MM-DD"));
      currentDate = currentDate.add(1, "day");
    }
    return dates;
  }

  async getDoanhThu(
    startDate: string,
    endDate: string
  ): Promise<FormattedDoanhThuData[]> {
    this.validateDates(startDate, endDate);

    const rawData: RawDoanhThuData[] =
      await this.thongkeRepository.getDoanhThuByDateRange(startDate, endDate);

    return rawData.map((item) => ({
      ngay: dayjs(item.ngay).format(DATE_FORMAT),
      tong_doanh_thu: parseFloat(item.tong_doanh_thu),
    }));
  }

  async getLoiNhuanSoBo(
    startDate: string,
    endDate: string
  ): Promise<FormattedLoiNhuanData[]> {
    this.validateDates(startDate, endDate);

    // Lấy dữ liệu thô và chuẩn hóa
    const rawData: RawLoiNhuanData[] =
      await this.thongkeRepository.getLoiNhuanSoBo(startDate, endDate);
    const formattedData: FormattedLoiNhuanData[] = rawData.map((item) => ({
      ngay: dayjs(item.ngay).format(DATE_FORMAT),
      tong_doanh_thu: parseFloat(item.tong_doanh_thu),
      tong_chi_phi_nguyen_lieu: parseFloat(item.tong_chi_phi_nguyen_lieu),
      loi_nhuan_so_bo: parseFloat(item.loi_nhuan_so_bo),
    }));

    const dataMap = new Map<string, FormattedLoiNhuanData>();
    formattedData.forEach((item) => {
      dataMap.set(item.ngay, item);
    });
    const fullDateRange = this.generateDateRange(startDate, endDate);
    const finalData: FormattedLoiNhuanData[] = fullDateRange.map((date) => {
      if (dataMap.has(date)) {
        return dataMap.get(date)!;
      } else {
        // Ngày không bán hàng -> điền 0
        return {
          ngay: date,
          tong_doanh_thu: 0,
          tong_chi_phi_nguyen_lieu: 0,
          loi_nhuan_so_bo: 0,
        };
      }
    });

    return finalData;
  }

  async getHieuSuatSanPham(
    startDate: string,
    endDate: string,
    topN: number = 10
  ): Promise<FormattedHieuSuatSanPhamData[]> {
    this.validateDates(startDate, endDate);

    if (topN < 1) {
      topN = 10;
    }

    const rawData: RawHieuSuatSanPhamData[] =
      await this.thongkeRepository.getHieuSuatSanPham(startDate, endDate, topN);

    return rawData.map((item) => ({
      ten_san_pham: item.ten_san_pham,
      ten_loai: item.ten_loai,
      tong_so_luong_ban: parseInt(item.tong_so_luong_ban),
      tong_doanh_thu_san_pham: parseFloat(item.tong_doanh_thu_san_pham),
    }));
  }
  async getSoDonHang(
    startDate: string,
    endDate: string
  ): Promise<SoDonHangResponse> {
    this.validateDates(startDate, endDate); 

    const result = await this.thongkeRepository.getSoDonHang(
      startDate,
      endDate
    );
    return result; 
  }

  async getTonKhoNguyenLieu(
    ten_nguyen_lieu: string
  ): Promise<TonKhoNguyenLieuResponse | null> {
    const result = await this.thongkeRepository.getTonKhoNguyenLieu(
      ten_nguyen_lieu
    );
    return result || null;
  }
}

export default ThongKeModal;
