'use client';

import { FaInbox, FaPhone } from 'react-icons/fa';
import { useEffect } from 'react';
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
} from '@nextui-org/react';
import { LocationIcon, PhoneIcon } from './addressIcon';
import { AddressSelector } from './addressSelector';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { getNearestStore } from '@/lib/store.handler';
import { updateStore } from '@/redux/slice/storeSlice';

export default function AddressBar() {
  const dispatch = useAppDispatch()
  const user = useAppSelector(state => state.user)

  useEffect(() => {
    if(!user.isLoggedIn || !user.selectedAddress) {
        navigator.geolocation.getCurrentPosition(async (postition) => {
          const { latitude, longitude } = postition.coords
          const {status, msg} = await getNearestStore(latitude, longitude)
          if(status === 'ok') dispatch(updateStore({id: msg.id, name: msg.name}))
        })
    } else {
      const getData = async () => {
        const {status, msg} = await getNearestStore(user.selectedAddress?.latitude!, user.selectedAddress?.longitude!)
        if(status === 'ok') dispatch(updateStore({id: msg.id, name: msg.name}))
      }
      
      getData()
    }
  },[user.selectedAddress])
  return (
    <div className="bg-gray-100 text-xs text-neutral-700 py-2 w-full hidden md:block">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center gap-2 font-medium">
          <LocationIcon className="w-4 h-4 text-current" />
          <AddressSelector />
        </div>

        <div className="gap-4 hidden md:flex">
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
                <a href="/apoint">B-Poin</a>
              </DropdownItem>
              <DropdownItem>
                <a href="/shipping-cost">Gratis Ongkir</a>
              </DropdownItem>
              <DropdownItem>
                <a href="mailto:alfacare@sat.co.id">
                  <div className="flex items-center gap-2">
                    <FaInbox size={18} />
                    cs.bertiga.store@gmail.com
                  </div>
                </a>
              </DropdownItem>
              <DropdownItem>
                <a href="tel:1500959">
                  <div className="flex items-center gap-2">
                    <FaPhone size={18} />
                    1100-420
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
                <a href="/about">Tentang Bermuda</a>
              </DropdownItem>
              <DropdownItem>
                <a href="/terms">Syarat & Ketentuan</a>
              </DropdownItem>
              <DropdownItem>
                <a href="/privacy">Kebijakan Privasi</a>
              </DropdownItem>
              <DropdownItem>
                <a href="/" target="_blank" rel="noopener noreferrer">
                  Karir
                </a>
              </DropdownItem>
              <DropdownItem>
                <a href="/" target="_blank" rel="noopener noreferrer">
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
            <DropdownMenu className="">
              <DropdownItem>
                {/* <p className="mb-2">Scan QR atau download dari:</p> */}
                <a href="https://play.google.com/">
                  <img
                    src="https://static-content.alfagift.id/static/play-store-btn.png"
                    alt="Play Store"
                    className="w-[145px] h-auto"
                  />
                </a>
              </DropdownItem>
              <DropdownItem>
                <a href="https://apps.apple.com/">
                  <img
                    src="https://static-content.alfagift.id/static/app-store-btn.png"
                    alt="App Store"
                    className="w-[145px] h-auto"
                  />
                </a>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
