import { nextui } from '@nextui-org/react';
/** @type {import('tailwindcss').Config} */
export const content = [
  './app/**/*.{js,ts,jsx,tsx,mdx}',
  './pages/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
  '../../node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  './src/**/*.{js,ts,jsx,tsx,mdx}',
];
export const theme = {
  extend: {
    container: {
        center: true,
        screens: {
          sm: '100%',
          md: '470px',
          lg: '930px',
          xl: '1110px'
        }
      }
  },
};
export const darkMode = 'class';
export const plugins = [nextui()];
