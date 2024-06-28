import { TAccount } from '../types/User';
import { SliceStateCreator } from './index';

export interface IAccountSlice {
  user: TAccount | null;
  upadteAccountData: (data: TAccount) => void;
}

const createAccountSlice: SliceStateCreator<IAccountSlice> = (set, get) => ({
  user: null,
  upadteAccountData(data) {
    set((state) => ({ user: data }));
  },
});

export default createAccountSlice;
