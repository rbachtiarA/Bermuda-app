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

export interface IUserState {
  id: number;
  name: string;
  email: string;
  role: string;
  avatarUrl: string;
  storeId?: string;
  address:
    | {
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
      }[]
    | null;
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
