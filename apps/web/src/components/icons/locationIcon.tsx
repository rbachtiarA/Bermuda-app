interface LocationIconProps {
  size?: number; // ukuran default dari icon
  width?: number; // lebar icon
  height?: number; // tinggi icon
  [key: string]: any; // menambahkan tipe untuk props lainnya
}

export const LocationIcon = ({
  size = 24,
  width,
  height,
  ...props
}: LocationIconProps) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 2C7.58172 2 4 5.58172 4 10C4 12.4477 5.13552 14.6777 7.34315 16.3431L12 22L16.6569 16.3431C18.8645 14.6777 20 12.4477 20 10C20 5.58172 16.4183 2 12 2Z"
    />
    <circle cx="12" cy="10" r="3" fill="currentColor" />
  </svg>
);
