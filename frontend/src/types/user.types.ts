type Role = "USER" | "ADMIN";

export type TUser = {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  password?: string;
  address: TAddress[];
  created_at: string;
  updated_at: string;
  roles: Role;
};

export type TAddress = {
  id?: string;
  address: string;
  name: string;
  phone: string;
  default: boolean;
  created_at?: string;
  updated_at?: string;
  userId?: string;
};

export type ValidationResult = {
  [key: string]: string;
};
