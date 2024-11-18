'use client';

import React, { useState } from 'react';
import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Input,
  ModalContent,
} from '@nextui-org/react';
import axios from 'axios';
import { getToken } from '@/lib/server';
import { toast } from 'react-toastify';

interface EditAvatarProps {
  avatarUrl: string;
}

const AvatarImage: React.FC<EditAvatarProps> = ({ avatarUrl }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preview, setPreview] = useState<string>(avatarUrl);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const fileUrl = URL.createObjectURL(selectedFile);
      setPreview(fileUrl);
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    if (!file) return alert('Silakan pilih file terlebih dahulu.');
    formData.append('avatar', file);
    setLoading(true);
    const token = await getToken();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}users/avatar`,
      {
        method: 'PATCH',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!res.ok) {
      throw new Error('Gagal mengunggah foto profil');
    }
    toast.success(`Foto profil berhasil diperbarui!`);
    setIsModalOpen(false);
    setLoading(false);
  };

  return (
    <div className=" flex flex-col items-center container">
      <div className="flex flex-col items-center">
        <Avatar
          showFallback
          isBordered
          className="w-40 h-40 text-large"
          src={preview}
          alt="User Avatar"
        />
        <Button
          className="mt-4"
          color="primary"
          onClick={() => setIsModalOpen(true)}
        >
          Ubah Foto Profil
        </Button>
      </div>
      <div>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Ubah Foto Profil</ModalHeader>
                <ModalBody>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    label="Pilih Foto Baru"
                    description="Format yang didukung: jpg, png, jpeg."
                  />
                  {file && (
                    <div className="mt-4">
                      <p>Pratinjau:</p>
                      <Avatar
                        isBordered
                        size="lg"
                        src={preview}
                        alt="Preview Avatar"
                      />
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button
                    isLoading={loading}
                    color="primary"
                    onClick={handleUpload}
                  >
                    Simpan
                  </Button>
                  <Button color="default" onClick={() => setIsModalOpen(false)}>
                    Batal
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};

export default AvatarImage;
