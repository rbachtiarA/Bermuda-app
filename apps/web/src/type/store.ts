export interface IStore {
  id: number,
  name: string,
  location: string,
  latitude: number,
  longitude: number,
  cityId: number
}
export interface IStoreList {
  name: string;
  location: string;
  cityId: number
  city: string

}

export interface ICreateStore {
  name: string,
  location: string,
  latitude: number,
  longitude: number,
  cityId: number
}