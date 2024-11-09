'use client';

import { useState } from 'react';
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
} from '@nextui-org/react';
import { LocationIcon, PhoneIcon } from './addressIcon';

export default function AddressBar() {
  const [location, setLocation] = useState('JABODETABEK');

  return (
    <div className="bg-gray-100 text-xs text-neutral-700 py-2 w-full">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center gap-2 font-medium">
          <LocationIcon className="w-4 h-4 text-current" />
          <span>{location}</span>
          <span className="text-xs">
            {' '}
            <a href="/login" className="text-blue-500 hover:underline">
              Masuk untuk ubah lokasi
            </a>
          </span>
        </div>

        <div className="flex gap-4">
          <Dropdown>
            <DropdownTrigger>
              <button className="text-neutral-700 text-xs">
                Layanan Pelanggan
              </button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem>
                <a href="/faq">Pertanyaan Umum</a>
              </DropdownItem>
              <DropdownItem>
                <a href="/howtobuy">Cara Belanja</a>
              </DropdownItem>
              <DropdownItem>
                <a href="/apoint">A-Poin</a>
              </DropdownItem>
              <DropdownItem>
                <a href="/shipping-cost">Gratis Ongkir</a>
              </DropdownItem>
              <DropdownItem>
                <a href="mailto:alfacare@sat.co.id">
                  <div className="flex items-center gap-2">
                    <img
                      src="/images/Ic Inbox.svg"
                      alt="Email"
                      className="w-4 h-4"
                    />
                    alfacare@sat.co.id
                  </div>
                </a>
              </DropdownItem>
              <DropdownItem>
                <a href="tel:1500959">
                  <div className="flex items-center gap-2">
                    <img
                      src="/images/Ic Customer Service.svg"
                      alt="Phone"
                      className="w-4 h-4"
                    />
                    1500-959
                  </div>
                </a>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <Dropdown>
            <DropdownTrigger>
              <button className="text-neutral-700 text-xs">
                Jelajahi Bermuda Store
              </button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem>
                <a href="/about">Tentang Alfagift</a>
              </DropdownItem>
              <DropdownItem>
                <a href="/terms">Syarat & Ketentuan</a>
              </DropdownItem>
              <DropdownItem>
                <a href="/privacy">Kebijakan Privasi</a>
              </DropdownItem>
              <DropdownItem>
                <a
                  href="https://gli.id/career"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Karir
                </a>
              </DropdownItem>
              <DropdownItem>
                <a
                  href="https://gli.id/article"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Blog
                </a>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <Dropdown>
            <DropdownTrigger>
              <button className="text-neutral-700 text-xs flex items-center">
                <PhoneIcon className="w-4 h-4 mr-1" />
                Download Bermuda Store
              </button>
            </DropdownTrigger>
            <DropdownMenu>
              <div className="flex items-center p-3">
                <img
                  src="/images/downloadpage_qr_code.png"
                  alt="QR Code"
                  className="w-16 h-16"
                />
                <div className="ml-4 text-xs">
                  <p className="mb-2">Scan QR atau download dari:</p>
                  <a href="https://play.google.com/store/apps/details?id=com.alfamart.alfagift">
                    <img
                      src="https://static-content.alfagift.id/static/play-store-btn.png"
                      alt="Play Store"
                      className="mb-2 w-28"
                    />
                  </a>
                  <a href="https://apps.apple.com/id/app/id1013717463">
                    <img
                      src="https://static-content.alfagift.id/static/app-store-btn.png"
                      alt="App Store"
                      className="w-28"
                    />
                  </a>
                </div>
              </div>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
