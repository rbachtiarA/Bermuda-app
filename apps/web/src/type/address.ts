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