import Cookies from "js-cookie";

export const setUserCookie = (userInfo: unknown) => {
  Cookies.set("userInfo", JSON.stringify(userInfo), { expires: 1, path: "/" });
};

export const removeUserCookie = () => {
  Cookies.remove("userInfo", { path: "/" });
};
