export interface IAddress {
  id: number;
  userId: number;
  label: string;
  recipient: string;
  phoneNumber: string;
  addressLine: string;
  city?: string;
  cityId?: number;
  state: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  isPrimary: boolean;
}

export interface ILocation {
  lat: number;
  lng: number;
  addressLine: string;
  state: string;
  postalCode: string;
}

export interface IAddressList {
  id: number;
  label: string;
  recipient: string;
  phoneNumber: string;
  addressLine: string;
  city: string;
  cityId: number;
  state: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  isPrimary: boolean;
}
export interface AddressCardProps {
 address: IAddressList
  onSelect: () => void;
}

export interface IFetchCity {
  id: number;
  name: string;
}

export interface ICreateAddress {
  label: string;
  recipient: string;
  phoneNumber: string;
  cityId: number;
  state: string;
  addressLine: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  isPrimary: boolean;
}

export interface CitySearchInputProps {
  handleSelect: (id: number, name: string) => void;
  resetTrigger?: boolean;
}
