import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { removeUserCookie } from "@/utils/setUserCookie";

interface UserInfo {
  _id?: string;
  id?: string;
  name?: string;
  fullname?: string;
  email?: string;
  role?: string;
  status?: string;
  isArtist?: boolean;
  [key: string]: unknown;
}

interface AuthState {
  userInfo: UserInfo | null;
  token: string | null;
  hydrated: boolean;
}

const initialState: AuthState = {
  userInfo: null,
  token: null,
  hydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ userInfo: UserInfo; token: string }>
    ) => {
      state.userInfo = action.payload.userInfo;
      state.token = action.payload.token;
      localStorage.setItem("userInfo", JSON.stringify(action.payload.userInfo));
      localStorage.setItem("token", action.payload.token);
    },

    clearCredentials: (state) => {
      state.userInfo = null;
      state.token = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");
        removeUserCookie();
      }
    },

    hydrateFromStorage: (state) => {
      if (typeof window === "undefined") return;
      const userInfo = localStorage.getItem("userInfo");
      const token = localStorage.getItem("token");
      if (userInfo) state.userInfo = JSON.parse(userInfo);
      if (token) state.token = token;
      state.hydrated = true;
    },
  },
});

export const { setCredentials, clearCredentials, hydrateFromStorage } =
  authSlice.actions;

export default authSlice.reducer;
