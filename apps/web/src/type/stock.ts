export interface IStock {
  name: any;
  id: number;
  productId: number;
  product?: string;
  store?: string;
  storeId: number;
  quantity: number;
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
