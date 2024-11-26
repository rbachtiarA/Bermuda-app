export interface IStore {
  id: number;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  cityId: number;
}
export interface IStoreList {
  name: string;
  location: string;
  cityId: number;
  city: string;
}

export interface ICreateStore {
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  cityId: number;
}

// Misalnya, tipe IStore bisa didefinisikan seperti ini:
export interface IStoreProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categories: string[];
  slug: string;
  isRecommended: boolean;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}
