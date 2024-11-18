'use client';
import { useAppSelector } from '@/redux/hook';
import { Avatar, Button, Input, Textarea } from '@nextui-org/react';
import { useState } from 'react';

export default function ProfilePage() {
  const user = useAppSelector((state) => state.user);
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    address: user.address || '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updated Profile:', profileData);
  };

  return (
    <main className="flex-1 px-6 py-4">
      <div className="flex flex-col bg-white p-4 h-full w-full">
        <header className="flex items-center justify-between py-4 border-b">
          <h1 className="text-xl font-semibold">Pengaturan Akun</h1>
        </header>

        <div className="flex flex-col lg:flex-row gap-8 py-8">
          <div className="flex flex-col items-center">
            <div className="h-24 w-24">
              <Avatar
                isBordered
                radius="full"
                src={user.avatarUrl}
                alt="User Avatar"
                size="lg"
                className="h-24 w-24"
              />
            </div>
            <Button
              className="mt-4"
              color="danger"
              onClick={() => console.log('Ubah Foto')}
            >
              Ubah Foto
            </Button>
          </div>

          <div className="flex-1">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-lg font-bold mb-4">Data Diri</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Nama"
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama Anda"
                  />
                  <Input
                    label="E-mail"
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    placeholder="Masukkan email Anda"
                  />
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold mb-4">Alamat</h2>
                <Textarea
                  label="Alamat"
                  name="address"
                  value={profileData.address.toString()}
                  onChange={handleInputChange}
                  placeholder="Masukkan alamat Anda"
                  rows={4}
                />
              </div>

              <div className="text-right">
                <Button type="submit" color="danger">
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
