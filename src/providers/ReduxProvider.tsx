"use client";

import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store, AppDispatch } from "@/redux/store";
import { hydrateFromStorage } from "@/redux/slices/authSlice";

function StoreHydrator({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(hydrateFromStorage());
  }, [dispatch]);

  return <>{children}</>;
}

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <StoreHydrator>{children}</StoreHydrator>
    </Provider>
  );
}
