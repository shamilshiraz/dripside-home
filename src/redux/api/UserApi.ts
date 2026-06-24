import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { clearCredentials } from "@/redux/slices/authSlice";

export interface CartItem {
  _id: string;
  productId: string;
  productName: string;
  productImage: string;
  colorName: string;
  size: string;
  price: number;
  salePrice?: number;
  quantity: number;
}

export interface CartResponse {
  success: boolean;
  message: string;
  data: {
    items: CartItem[];
    total: number;
    subtotal: number;
    itemCount: number;
  };
}

const rawBase = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/api`
    : "",
  credentials: "include",
  prepareHeaders: (headers) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Wrap the base query: on 401 / "invalid token", clear session and redirect to login
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBase(args, api, extraOptions);

  if (result.error) {
    const status = result.error.status;
    const msg = (result.error.data as { message?: string } | undefined)?.message ?? "";
    const isAuthError =
      status === 401 ||
      msg.toLowerCase().includes("invalid token") ||
      msg.toLowerCase().includes("unauthorized") ||
      msg.toLowerCase().includes("no token");

    if (isAuthError && typeof window !== "undefined") {
      api.dispatch(clearCredentials());
      window.location.href = "/login";
    }
  }

  return result;
};

export const UserApi = createApi({
  reducerPath: "UserApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Artists", "Products", "Cart"],

  endpoints: (builder) => ({
    signin: builder.mutation({
      query: (credentials: { email: string; password: string }) => ({
        url: "/user/login",
        method: "POST",
        body: credentials,
      }),
    }),

    signup: builder.mutation({
      query: (user: {
        name: string;
        username: string;
        email: string;
        phone: string;
        password: string;
      }) => ({
        url: "/user/register",
        method: "POST",
        body: user,
      }),
    }),

    verifyOtp: builder.mutation({
      query: (credentials: { email: string; otp: string }) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: credentials,
      }),
    }),

    artistSignup: builder.mutation({
      query: (formData: FormData) => {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        return {
          url: "/artist/artist-signup",
          method: "POST",
          body: formData,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        };
      },
      invalidatesTags: ["User"],
    }),

    signout: builder.mutation<void, void>({
      query: () => ({
        url: "/signout",
        method: "POST",
      }),
    }),

    getUserProfile: builder.query({
      query: () => "/user/profile",
      providesTags: ["User"],
    }),

    getActiveArtists: builder.query({
      query: (params?: { page?: number; limit?: number }) => {
        const qs = new URLSearchParams();
        if (params?.page) qs.append("page", String(params.page));
        if (params?.limit) qs.append("limit", String(params.limit));
        const q = qs.toString();
        return `/artist/active${q ? `?${q}` : ""}`;
      },
      providesTags: ["Artists"],
    }),

    getCart: builder.query<CartResponse, void>({
      query: () => "/cart",
      providesTags: ["Cart"],
    }),

    addToCart: builder.mutation({
      query: (cartItem) => ({
        url: "/cart",
        method: "POST",
        body: cartItem,
      }),
      invalidatesTags: ["Cart"],
    }),

    updateCartItem: builder.mutation({
      query: ({ itemId, quantity }: { itemId: string; quantity: number }) => ({
        url: `/cart/items/${itemId}`,
        method: "PUT",
        body: { quantity },
      }),
      invalidatesTags: ["Cart"],
    }),

    removeCartItem: builder.mutation({
      query: (itemId: string) => ({
        url: `/cart/items/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    clearCart: builder.mutation<void, void>({
      query: () => ({
        url: "/cart",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    getProductById: builder.query({
      query: (id: string) => `/product/${id}`,
    }),

    getAllProductsPublic: builder.query({
      query: (params?: { page?: number; limit?: number; search?: string }) => {
        const qs = new URLSearchParams();
        if (params?.page) qs.append("page", String(params.page));
        if (params?.limit) qs.append("limit", String(params.limit));
        if (params?.search) qs.append("search", params.search);
        const q = qs.toString();
        return `/product/all${q ? `?${q}` : ""}`;
      },
      providesTags: ["Products"],
    }),
  }),
});

export const {
  useSigninMutation,
  useSignupMutation,
  useSignoutMutation,
  useVerifyOtpMutation,
  useArtistSignupMutation,
  useGetUserProfileQuery,
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
  useGetProductByIdQuery,
  useGetActiveArtistsQuery,
  useGetAllProductsPublicQuery,
} = UserApi;
