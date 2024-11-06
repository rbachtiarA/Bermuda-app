import React from 'react';

interface IconProps {
  size?: number; // Ukuran ikon dalam piksel, default 16px
  color?: string; // Warna ikon, default `currentColor` agar mengikuti warna teks
  className?: string; // Opsional className untuk menambahkan gaya eksternal
}

// Ikon Lokasi
export const LocationIcon: React.FC<IconProps> = ({
  size = 16,
  color = 'currentColor',
  className,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Location Icon"
    className={className} // Menggunakan className yang dioper
  >
    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
  </svg>
);

// Ikon Telepon
export const PhoneIcon: React.FC<IconProps> = ({
  size = 16,
  color = 'currentColor',
  className,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Phone Icon"
    className={className} // Menggunakan className yang dioper
  >
    <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H5z" />
    <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
  </svg>
);

export default { LocationIcon, PhoneIcon };
