import { Moment } from "moment";

export type TAccount = {
  id: string;
  name: string;
  gender: number;
  dob: Moment;
  mail: string;
  phone: string;
  address: string;
  status: number;
  cccd: string;
  insuranceId: string;
  salaryId: string;
  taxId: string;
  educationLevel: number;
  updateAt?: Date;
  createAt?: Date;
};
