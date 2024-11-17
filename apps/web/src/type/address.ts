export interface IAddress {
    id: number,
    userId: number,
    addressLine: string,
    city: string,
    state: string,
    postalCode: string,
    latitude: number,
    longitude: number,
    isPrimary: boolean
}

export interface ILocation {
    lat: number;
    lng: number;
    city: string;
    state: string;
}

export interface AddressCardProps {
    address: {
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
    };
    onSelect: () => void;
  };