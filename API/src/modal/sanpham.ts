import SanPhamRepository from "../repositories/sanpham";
export class SanPhamModal {
  private sanphamRepository: SanPhamRepository;

  constructor(sanphamRepository: SanPhamRepository) {
    this.sanphamRepository = sanphamRepository;
  }

  private processSanPhamData(data: any[]): any[] {
    if (!data || data.length === 0) {
      return [];
    }

    const sanphamMap = new Map();
    data.forEach((row) => {
      const sanphamId = row.id;
      if (!sanphamMap.has(sanphamId)) {
        sanphamMap.set(sanphamId, {
          id: row.id,
          ten_san_pham: row.ten_san_pham,
          gia_ban: row.gia_ban,
          mo_ta: row.mo_ta,
          ten_loai: row.ten_loai,
          cong_thuc: [],
        });
      }

      if (row.id_nguyen_lieu !== null) {
        sanphamMap.get(sanphamId).cong_thuc.push({
          id_nguyen_lieu: row.id_nguyen_lieu,
          ten_nguyen_lieu: row.ten_nguyen_lieu,
          don_vi: row.don_vi,
          so_luong: row.so_luong,
        });
      }
    });

    return Array.from(sanphamMap.values());
  }

  async getAll(): Promise<any[]> {
    const results = await this.sanphamRepository.getAll();
    return this.processSanPhamData(results[0]);
  }

  async getByID(id: number): Promise<any> {
    const results = await this.sanphamRepository.getByID(id);
    const processed = this.processSanPhamData(results[0]);
    return processed.length > 0 ? processed[0] : null;
  }

  async createSanPham(
    ten_san_pham: string,
    gia_ban: number,
    mo_ta: string,
    id_loai: number,
    cong_thuc: any[]
  ): Promise<void> {
    if (
      !ten_san_pham ||
      gia_ban === undefined ||
      !id_loai ||
      !cong_thuc ||
      cong_thuc.length === 0
    ) {
      throw new Error("Dữ liệu sản phẩm và công thức không hợp lệ.");
    }
    await this.sanphamRepository.createSanPham(
      ten_san_pham,
      gia_ban,
      mo_ta,
      id_loai,
      cong_thuc
    );
  }

  async updateSanPham(
    id: number,
    ten_san_pham: string,
    gia_ban: number,
    mo_ta: string,
    id_loai: number,
    cong_thuc: any[]
  ): Promise<void> {
    if (
      !id ||
      !ten_san_pham ||
      gia_ban === undefined ||
      !id_loai ||
      !cong_thuc
    ) {
      throw new Error("Dữ liệu cập nhật không hợp lệ.");
    }

    await this.sanphamRepository.updateSanPham(
      id,
      ten_san_pham,
      gia_ban,
      mo_ta,
      id_loai,
      cong_thuc
    );
  }

  async deleteSanPham(id: number): Promise<void> {
    await this.sanphamRepository.deleteSanPham(id);
  }

  async searchSanPhamByName(name: string): Promise<any[]> {
    const results = await this.sanphamRepository.searchSanPhamByName(name);
    return this.processSanPhamData(results);
  }
}

export default SanPhamModal;
