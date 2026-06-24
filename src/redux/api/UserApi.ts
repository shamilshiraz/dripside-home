import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const UserApi = createApi({
  reducerPath: "UserApi",
  baseQuery: fetchBaseQuery({
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
  }),
  tagTypes: ["User", "Artists", "Products"],

  endpoints: (builder) => ({
    signin: builder.mutation({
      query: (credentials: { email: string; password: string }) => ({
        url: "/user/login",
        method: "POST",
        body: credentials,
      }),
    }),

    signup: builder.mutation({
      query: (user: { name: string; email: string; password: string }) => ({
        url: "/user/register",
        method: "POST",
        body: user,
      }),
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
  useGetUserProfileQuery,
  useGetActiveArtistsQuery,
  useGetAllProductsPublicQuery,
} = UserApi;
