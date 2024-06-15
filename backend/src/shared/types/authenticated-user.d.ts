import { JwtPayload } from 'jsonwebtoken';

export type IAuthenticatedUser = {
  _id: string;
  phone: string;
} & JwtPayload;
