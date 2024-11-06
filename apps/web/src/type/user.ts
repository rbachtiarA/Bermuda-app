export interface IRegEmail {
  email: string;
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface IUserState {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
  addresses: string;
}
