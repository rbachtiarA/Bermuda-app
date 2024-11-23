import { useState } from 'react';
import { Button, Input, Select, SelectItem, Spacer } from '@nextui-org/react';

const CreateDiscountForm: React.FC = () => {
  const [minPurchase, setMinPurchase] = useState<string>('');
  const [value, setValue] = useState<string>('');
  const [discountType, setDiscountType] = useState<string>('');
  const [storeId, setStoreId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:3000/api/discount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          minPurchase: Number(minPurchase),
          value: Number(value),
          discountType,
          storeId,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Diskon bersyarat berhasil dibuat!');
      } else {
        setMessage(data.error || 'Terjadi kesalahan.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Gagal membuat diskon.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
      <h3>Buat Diskon Bersyarat</h3>
      <Spacer y={1} />
      <Input
        type="number"
        label="Minimal Pembelian"
        placeholder="Masukkan minimal pembelian"
        value={minPurchase}
        onChange={(e) => setMinPurchase(e.target.value)}
        required
      />
      <Spacer y={1} />
      <Input
        type="number"
        label="Nilai Diskon"
        placeholder="Masukkan nilai diskon"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
      />
      <Spacer y={1} />
      <Select
        label="Tipe Diskon"
        placeholder="Pilih tipe diskon"
        items={[
          { label: 'Persentase', value: 'percentage' },
          { label: 'Nominal', value: 'nominal' },
        ]}
        onSelectionChange={(val) => setDiscountType(val as string)}
        required
      >
        {(item) => <SelectItem key={item.value}>{item.label}</SelectItem>}
      </Select>
      <Spacer y={1} />
      <Input
        type="text"
        label="ID Toko"
        placeholder="Masukkan ID toko"
        value={storeId}
        onChange={(e) => setStoreId(e.target.value)}
        required
      />
      <Spacer y={1} />
      <Button type="submit" disabled={loading}>
        {loading ? 'Mengirim...' : 'Buat Diskon'}
      </Button>
      <Spacer y={1} />
      {message && <p>{message}</p>}
    </form>
  );
};

export default CreateDiscountForm;
