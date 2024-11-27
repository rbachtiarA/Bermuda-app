export interface IStock {
  name: any;
  id: number;
  productId: number;
  product?: Object;
  store?: Object;
  storeId: number;
  quantity: number;
}
interface Object {
  id: number;
  name: string;
}
export interface IStockCreate {
  productId: number;
  storeId: number;
  quantity: number;
}

export interface IStockDel {
  id: number;
  onDeleted: () => Promise<void>;
}

export interface StockHistory {
  id: number;
  changeType?: string;
  stock?: { product: { name: string; store: { name: string; id: string } } };
  stockId: number;
  quantity: number;
  orderItems?: any;
  action: string;
  createdAt: string;
}
