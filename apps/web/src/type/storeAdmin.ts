export interface IStoreAdminReg {
  email: string;
}

export interface IStoreAdminDel {
  id: number;
  onDeleted: () => Promise<void>;
}

export interface IStoreAdmin {
  storeAdmin: any;
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  avatar: string;
  addresses: string;
  storeId?: number;
}
