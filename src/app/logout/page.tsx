"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { clearCredentials } from "@/redux/slices/authSlice";

export default function LogoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearCredentials());
    router.replace("/login");
  }, []);

  return null;
}
