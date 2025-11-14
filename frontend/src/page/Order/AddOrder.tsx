/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form, Card, Space, message, DatePicker, Select, InputNumber } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { SanPham } from '../../component/interface';
import dayjs from 'dayjs';
import axios from 'axios';

const { Option } = Select;

interface AddOrderProps {
  id_ban: number; 
  onClose: () => void;
  onSuccess: () => void;
}

const API_BASE_URL = 'http://localhost:7000/api';

const AddOrder: React.FC<AddOrderProps> = ({ id_ban, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [sanPhams, setSanPhams] = useState<SanPham[]>([]);
  const [isLoadingSP, setIsLoadingSP] = useState(false);

  // Fetch sản phẩm
  const fetchSanPhams = useCallback(async () => {
    setIsLoadingSP(true);
    try {
      const response = await axios.get<{ success: boolean; data: any }>(
        `${API_BASE_URL}/sanpham/get-all`
      );
      if (response.data.success && response.data.data) {
        const apiData = response.data.data;
        let resultData: SanPham[] = [];

        if (Array.isArray(apiData) && Array.isArray(apiData[0])) {
          resultData = apiData[0];
        } else if (Array.isArray(apiData)) {
          resultData = apiData;
        }

        setSanPhams(
          resultData
            .filter((item) => item && item.id && item.ten_san_pham)
            .map((sp) => ({
              ...sp,
              id: Number(sp.id),
              gia_ban: Number(sp.gia_ban),
            }))
        );
      } else {
        message.error('Lỗi khi tải danh sách Sản phẩm.');
      }
    } catch (error) {
      console.error('Lỗi API Sản phẩm:', error);
      message.error('Không thể kết nối để tải Sản phẩm.');
    } finally {
      setIsLoadingSP(false);
    }
  }, []);

  useEffect(() => {
    fetchSanPhams();
  }, [fetchSanPhams]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        id_ban: id_ban, 
        ngay_lap: values.ngay_lap,
        chi_tiet: values.chi_tiet,
      };

      const response = await axios.post(`${API_BASE_URL}/hoadonban/create`, payload);

      if (response.data.success) {
        message.success('Đã tạo hóa đơn thành công.');
        form.resetFields();
        onSuccess();
      } else {
        message.error(response.data.message || 'Lỗi khi tạo hóa đơn.');
      }
    } catch (error) {
      console.error('Lỗi API Create:', error);
      message.error('Lỗi kết nối máy chủ hoặc dữ liệu không hợp lệ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={
        <h2 style={{ textAlign: 'center', margin: 0 }}>
          Tạo hóa đơn cho Bàn {id_ban}
        </h2>
      }
    >
      <Form
        form={form}
        name="addOrderForm"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{
          ngay_lap: dayjs(),
          chi_tiet: [{}],
        }}
      >
        {/* Ngày lập */}
        <Form.Item
          label="Ngày lập"
          name="ngay_lap"
          rules={[{ required: true, message: 'Vui lòng chọn ngày lập!' }]}
        >
          <DatePicker format="YYYY/MM/DD" style={{ width: '100%' }} />
        </Form.Item>

        {/* Chi tiết sản phẩm */}
        <h3 style={{ marginTop: 20 }}>Chi tiết Sản phẩm</h3>
        <Form.List name="chi_tiet">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: 'flex', marginBottom: 8 }}
                  align="baseline"
                >
                  {/* Sản phẩm */}
                  <Form.Item
                    {...restField}
                    name={[name, 'id_san_pham']}
                    rules={[{ required: true, message: 'Chọn SP' }]}
                    style={{ width: 150 }}
                  >
                    <Select
                      placeholder="Sản phẩm"
                      loading={isLoadingSP}
                      disabled={isLoadingSP || sanPhams.length === 0}
                      onChange={(idSanPham: number) => {
                        const sp = sanPhams.find((p) => p.id === idSanPham);
                        if (sp) {
                          form.setFields([
                            {
                              name: ['chi_tiet', name, 'don_gia'],
                              value: sp.gia_ban,
                            },
                          ]);
                        }
                      }}
                    >
                      {sanPhams.map((sp) => (
                        <Option key={sp.id} value={sp.id}>
                          {sp.ten_san_pham}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  {/* Số lượng */}
                  <Form.Item
                    {...restField}
                    name={[name, 'so_luong']}
                    rules={[{ required: true, message: 'SL' }]}
                    style={{ width: 80 }}
                  >
                    <InputNumber min={1} placeholder="SL" />
                  </Form.Item>

                  {/* Đơn giá */}
                  <Form.Item
                    {...restField}
                    name={[name, 'don_gia']}
                    rules={[{ required: true, message: 'ĐG' }]}
                    style={{ width: 120 }}
                  >
                    <InputNumber
                      min={1000}
                      step={1000}
                      placeholder="Đơn giá"
                    />
                  </Form.Item>

                  {fields.length > 0 && (
                    <MinusCircleOutlined
                      onClick={() => remove(name)}
                      style={{ color: 'red', marginLeft: 8 }}
                    />
                  )}
                </Space>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add({})}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm Sản phẩm
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        {/* Nút hành động */}
        <Form.Item style={{ textAlign: 'center', marginTop: 30 }}>
          <Space>
            <Button onClick={onClose}>Hủy</Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<PlusOutlined />}
              loading={loading}
              style={{ width: 160 }}
            >
              Tạo Hóa Đơn
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddOrder;