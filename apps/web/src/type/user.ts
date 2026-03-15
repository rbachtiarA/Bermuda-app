import { IAddressList } from './address';

export interface IUser {
  id: number;
  name: string;
  email: string;
  role: string;
  referralCode: string;
  avatarUrl: string;
  isVerified: boolean;
}

export interface IRegEmail {
  email: string;
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  role: string;
  name: string;
  email: string;
  avatarUrl: string;
  address: IAddressList[];
  storeId?: string;
}

export interface IUserState {
  id: number;
  name: string;
  email: string;
  role: string;
  avatarUrl: string;
  storeId?: string;
  address: Record<string, IAddressList>;
  location?: { latitude: number; longitude: number } | null;
  isLoggedIn: boolean;
  selectedAddress?: {
    label: string;
    recipient: string;
    phoneNumber: string;
    addressLine: string;
    city: string;
    state: string;
    postalCode: string;
    latitude: number;
    longitude: number;
    isPrimary: boolean;
  } | null;
}
