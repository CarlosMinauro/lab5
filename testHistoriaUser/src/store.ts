import { configureStore } from '@reduxjs/toolkit';

export interface RootState {
  auth: {
    user: {
      id: string;
      email: string;
    };
  };
}

export const store = configureStore({
  reducer: {
    auth: (state = { user: { id: '1', email: 'test@example.com' } }) => state,
  },
});

export { useAppDispatch, useAppSelector } from './store/index'; 