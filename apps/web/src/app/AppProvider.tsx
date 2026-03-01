// src/app/providers.tsx
'use client';
import { NextUIProvider } from '@nextui-org/react';
import { AppStore, makeStore } from '@/redux/store';
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { Persistor, persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import Loading from '@/components/reduxStore/storeLoading';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore>();

  const persistorRef = useRef<Persistor>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
    persistorRef.current = persistStore(storeRef.current);
  }

  return (
    <NextUIProvider>
      <Provider store={storeRef.current}>
        <PersistGate persistor={persistorRef.current!} loading={<Loading />}>
          {children}
        </PersistGate>
      </Provider>
    </NextUIProvider>
  );
}
