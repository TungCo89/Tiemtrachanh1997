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