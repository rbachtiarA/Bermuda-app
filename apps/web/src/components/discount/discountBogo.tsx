import React, { useState, useEffect } from 'react';
import {
  Button,
  Input,
  Modal,
  Select,
  Spinner,
  SelectItem,
} from '@nextui-org/react';
import axios from 'axios';

const CreateBuyOneGetOneDiscount = () => {
  const [productId, setProductId] = useState<string | null>(null);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]); // Menyimpan daftar produk
  const [stores, setStores] = useState<any[]>([]); // Menyimpan daftar toko
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch data produk dan toko saat halaman dimuat
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, storesRes] = await Promise.all([
          axios.get('/api/products'), // Ganti dengan endpoint produk Anda
          axios.get('/api/stores'), // Ganti dengan endpoint toko Anda
        ]);
        setProducts(productsRes.data);
        setStores(storesRes.data);
      } catch (err) {
        setError('Gagal memuat data produk atau toko');
      }
    };

    fetchData();
  }, []);

  // Fungsi untuk menangani pengiriman form
  const handleSubmit = async () => {
    if (!productId || !storeId) {
      setError('Harap pilih produk dan toko terlebih dahulu');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/discounts/create-bogo', {
        productId,
        storeId,
      });
      setMessage(response.data.message);
      setProductId(null);
      setStoreId(null);
    } catch (err) {
      setError('Gagal membuat diskon BOGO');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h3 className="mb-4">Buat Diskon Beli 1 Gratis 1</h3>

      {message && <p className="mb-4 text-green-500">{message}</p>}
      {error && <p className="mb-4 text-red-500">{error}</p>}

      <Select
        label="Pilih Produk"
        placeholder="Pilih produk"
        value={productId || ''}
        onChange={(event) => setProductId(event.target.value)} // Perbaiki penanganan onChange
        required
      >
        {products.map((product) => (
          <SelectItem key={product.id} value={product.id}>
            {product.name}
          </SelectItem>
        ))}
      </Select>

      <Select
        label="Pilih Toko"
        placeholder="Pilih toko"
        value={storeId || ''}
        onChange={(event) => setStoreId(event.target.value)} // Perbaiki penanganan onChange
        required
        className="mt-4"
      >
        {stores.map((store) => (
          <SelectItem key={store.id} value={store.id}>
            {store.name}
          </SelectItem>
        ))}
      </Select>

      <Button
        onClick={handleSubmit}
        color="primary"
        className="mt-6 w-full"
        disabled={loading}
      >
        {loading ? <Spinner size="sm" /> : 'Buat Diskon'}
      </Button>
    </div>
  );
};

export default CreateBuyOneGetOneDiscount;
