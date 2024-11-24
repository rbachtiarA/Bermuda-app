import { StockHistory } from './stock';
export interface IProduct {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  isRecommended?: boolean;
  stock?: IStocks[];
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  categories: number[];
  discounts?: any[];
  onUpdate?: () => Promise<void>;
}

interface Discount {
  id?: number;
  name?: string;
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
  stockHistory: any;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}
