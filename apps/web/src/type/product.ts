export interface IProduct {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  stock?: IStocks[];
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  categories: string[];
}

export interface IProductDel {
  id: number;
  onDeleted: () => Promise<void>;
}

export interface IStocks {
  id: number;
  quantity: number;
  storeId: number;
  productId: number;
  product: IProduct;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}
