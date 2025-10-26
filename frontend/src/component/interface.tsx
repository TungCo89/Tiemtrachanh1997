export interface CongThucChiTiet {
    id_nguyen_lieu: number;
    ten_nguyen_lieu: string;
    don_vi: string;
    so_luong: string;
}

export interface SanPham {
    id: number;
    ten_loai: string;
    ten_san_pham: string;
    gia_ban: string;
    mo_ta: string;
    cong_thuc: CongThucChiTiet[];
    id_loai: number;
}

export interface UpdateSanPhamProps {
    id: number;
    initialData: SanPham | null;
    onClose: () => void;
    onSuccess: () => void;
}

export interface CongThucPayload {
    id_nguyen_lieu: number;
    so_luong: number;
}

interface SanPhamUpdateValues {
    id_loai: number;
    ten_san_pham: string;
    gia_ban: number;
    mo_ta?: string;
    cong_thuc: CongThucPayload[];
}

export interface User {
    id: number;
    ten_dang_nhap: string;
    mat_khau: string;
    email: string;
    ho_ten: string;
    so_dien_thoai: string;
    ten_vai_tro: string;
}

interface UserUpdateValues {
    ten_dang_nhap: string;
    mat_khau: string;
    email: string;
    ho_ten: string;
    so_dien_thoai: string;
    ten_vai_tro: string;
}

export interface LoaiSanPham {
    id: number;
    ten_loai: string;
    mo_ta: string;
}

export interface NguyenLieu {
    id: number;
    ten_nguyen_lieu: string;
    don_vi: string;
}
export interface CongThuc {
    id: number;
    id_san_pham: string;
    id_nguyen_lieu: string;
    so_luong: string;
}

export interface NhaCungCap {
    id: number;
    ten_ncc: string;
    dia_chi: string;
    so_dien_thoai: number;
}
export interface ChiTietNhap {
    id_cthdn: number;
    id_nguyen_lieu: number;
    ten_nguyen_lieu: string;
    so_luong: number;
    don_gia: number;
}
export interface HoaDonNhap {
    id: number;
    id_ncc: number;
    ten_ncc: string;
    ngay_nhap: string;
    tong_tien: number;
    ghi_chu: string;
    chi_tiet: ChiTietNhap[];
}
export interface ChiTietBan {
    id_cthdb: number;
    id_san_pham: number;
    ten_san_pham: string;
    so_luong: number;
    don_gia: number;
}
export interface HoaDonBan {
    id: number;
    id_ban: number;
    ten_ban: string;
    ngay_lap: string;
    tong_tien: number;
    ghi_chu: string;
    chi_tiet: ChiTietBan[];
}