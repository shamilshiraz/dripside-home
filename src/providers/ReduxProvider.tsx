"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store, AppDispatch, RootState } from "@/redux/store";
import { hydrateFromStorage, setCredentials } from "@/redux/slices/authSlice";
import { useGetUserProfileQuery } from "@/redux/api/UserApi";

function StoreHydrator({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(hydrateFromStorage());
  }, [dispatch]);

  return <ProfileRefresher>{children}</ProfileRefresher>;
}

function ProfileRefresher({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const { token, hydrated } = useSelector((state: RootState) => state.auth);

  const { data, refetch } = useGetUserProfileQuery(undefined, {
    skip: !hydrated || !token,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (data?.data && token) {
      dispatch(setCredentials({ userInfo: data.data, token }));
    }
  }, [data, token, dispatch]);

  // Re-check on every client-side navigation, since the App Router keeps
  // this provider mounted across route changes (no full remount on refresh-like nav).
  useEffect(() => {
    if (token) refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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
