import create, { GetState, SetState, StoreApi, State } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import createAccountSlice, { IAccountSlice } from './createAccountSlice';

interface IStore extends IAccountSlice {}

export type SliceStateCreator<
  S extends State,
  C extends State = {},
  T extends S = S & C,
  CustomSetState = SetState<T>
> = (set: CustomSetState, get: GetState<T>, api: StoreApi<T>) => S;

export const useStore = create<IStore>()(
  devtools(
    persist((set, get, api) => ({
      ...createAccountSlice(set, get, api),
    }), {name: 'storage'})
  )
);
