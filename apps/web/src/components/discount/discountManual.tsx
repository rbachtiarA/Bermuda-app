import React, { useState } from 'react';
import {
  Input,
  Button,
  Select,
  Card,
  Spacer,
  SelectItem,
} from '@nextui-org/react';
import axios from 'axios';

const CreateManualDiscount: React.FC = () => {
  const [formData, setFormData] = useState({
    productId: '',
    value: '',
    discountType: 'PERCENTAGE',
    storeId: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(
        'http://localhost:3000/api/discounts/manual',
        formData,
      );
      setMessage('Diskon manual berhasil dibuat.');
      setFormData({
        productId: '',
        value: '',
        discountType: 'PERCENTAGE',
        storeId: '',
      });
    } catch (error) {
      console.error(error);
      setMessage('Gagal membuat diskon manual. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
      <h3>Buat Diskon Manual</h3>
      <Spacer y={1} />
      <form onSubmit={handleSubmit}>
        <Input
          name="productId"
          label="ID Produk"
          placeholder="Masukkan ID produk"
          value={formData.productId}
          onChange={handleChange}
          fullWidth
          required
        />
        <Spacer y={1} />
        <Input
          name="value"
          type="number"
          label="Nilai Diskon"
          placeholder="Masukkan nilai diskon"
          value={formData.value}
          onChange={handleChange}
          fullWidth
          required
        />
        <Spacer y={1} />
        <Select
          label="Tipe Diskon"
          value={formData.discountType}
          onChange={(e) =>
            setFormData({ ...formData, discountType: e.target.value })
          }
          fullWidth
          required
        >
          <SelectItem key="PERCENTAGE" value="PERCENTAGE">
            Persentase
          </SelectItem>
          <SelectItem key="NOMINAL" value="NOMINAL">
            Nominal
          </SelectItem>
        </Select>
        <Spacer y={1} />
        <Input
          name="storeId"
          label="ID Toko"
          placeholder="Masukkan ID toko"
          value={formData.storeId}
          onChange={handleChange}
          fullWidth
          required
        />
        <Spacer y={1} />
        <Button type="submit" color="primary" fullWidth disabled={loading}>
          {loading ? 'Loading...' : 'Buat Diskon'}
        </Button>
      </form>
      <Spacer y={1} />
      {message && (
        <p style={{ color: message.includes('berhasil') ? 'green' : 'red' }}>
          {message}
        </p>
      )}
    </Card>
  );
};

export default CreateManualDiscount;
