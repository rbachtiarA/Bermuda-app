import React from 'react';

interface CrossIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export const CrossIcon: React.FC<CrossIconProps> = ({
  size = 24,
  height,
  width,
  ...props
}) => {
  return (
    <svg
      width={width || size}
      height={height || size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2Z"
        fill="black"
      />
      <path
        d="M15.54 8.46C15.83 8.17 15.83 7.69 15.54 7.4C15.25 7.11 14.77 7.11 14.48 7.4L12 9.88L9.52 7.4C9.23 7.11 8.75 7.11 8.46 7.4C8.17 7.69 8.17 8.17 8.46 8.46L10.94 11L8.46 13.54C8.17 13.83 8.17 14.31 8.46 14.6C8.75 14.89 9.23 14.89 9.52 14.6L12 12.12L14.48 14.6C14.77 14.89 15.25 14.89 15.54 14.6C15.83 14.31 15.83 13.83 15.54 13.54L13.06 11L15.54 8.46Z"
        fill="white"
      />
    </svg>
  );
};
