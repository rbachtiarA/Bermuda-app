import { nextui } from '@nextui-org/react';
/** @type {import('tailwindcss').Config} */
export const content = [
  './app/**/*.{js,ts,jsx,tsx,mdx}',
  './pages/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
  '../../node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  // Or if using `src` directory:
  './src/**/*.{js,ts,jsx,tsx,mdx}',
];
export const theme = {
  extend: {
    screen: {
      sm: '100%',
          md: '470px',
          lg: '930px',
          xl: '1110px'
    },
    container: {
        center: true,
        screens: {
          sm: '576px',
          md: '768px',
          lg: '992px',
          xl: '1200px'
        }
      }
  },
};
export const darkMode = 'class';
export const plugins = [nextui()];