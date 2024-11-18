export interface IStoreAdminReg {
  email: string;
}

export interface IStoreAdminDel {
  id: number;
  onDeleted: () => Promise<void>;
}

export interface IStoreAdmin {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
  addresses: string;
  storeId?: number;
}
