import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/counterSlice';
import menuReducer from './features/menuSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterReducer,
      menu: menuReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
