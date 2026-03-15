import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  persistReducer,
  persistStore,
  Persistor,
  PersistConfig,
} from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import userReducer from './slice/userSlice';
import cartReducer from './slice/cartSlice';
import { REHYDRATE, PERSIST, REGISTER } from 'redux-persist';
import storeReducer from './slice/storeSlice';
import checkoutReducer from './slice/checkoutSlice';

const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: number) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== 'undefined'
    ? createWebStorage('local')
    : createNoopStorage();

const persistConfig = {
  key: 'store',
  storage,
  timeout: 2000,
};

const userPersistConfig = {
  key: 'user',
  storage,
};
const checkoutPersistConfig = {
  key: 'checkout',
  storage,
};
const storePersistConfig = {
  key: 'store',
  storage,
};

const cartPersistConfig = {
  key: 'cart',
  storage,
  blacklist: ['updatingItemIds'],
};
const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  cart: persistReducer(cartPersistConfig, cartReducer),
  checkout: persistReducer(checkoutPersistConfig, checkoutReducer),
  store: persistReducer(storePersistConfig, storeReducer),
});

const makeConfiguredStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [REHYDRATE, PERSIST, REGISTER],
        },
      }),
  });

type StoreWithPersistor = ReturnType<typeof makeConfiguredStore> & {
  __persistor?: Persistor;
};

export const makeStore = (): StoreWithPersistor => {
  const isServer = typeof window === 'undefined';
  if (isServer) {
    return makeConfiguredStore();
  } else {
    // const persistedReducer = persistReducer(persistConfig, rootReducer);
    const store = configureStore({
      reducer: rootReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [REHYDRATE, PERSIST, REGISTER],
          },
        }),
    }) as StoreWithPersistor;
    store.__persistor = persistStore(store);
    return store;
  }
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
