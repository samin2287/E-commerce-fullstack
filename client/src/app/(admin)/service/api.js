import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const AUTH_TOKEN_KEY = "verdant_auth_token";

export const adminApiService = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    credentials: "include",
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  tagTypes: ["Products", "Categories"],
  endpoints: (build) => ({
    getProducts: build.query({
      query: ({ page, limit, category, search } = {}) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);
        if (category) params.append("category", category);
        if (search) params.append("search", search);
        const q = params.toString();
        return `/product/allproducts${q ? `?${q}` : ""}`;
      },
      transformResponse: (response) => response?.data?.products || [],
      providesTags: ["Products"],
    }),

    // Create product (multipart/form-data expected)
    createProduct: build.mutation({
      query: (formData) => ({
        url: "/product/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Products"],
    }),

    // Update product (multipart/form-data expected)
    updateProduct: build.mutation({
      query: ({ slug, formData }) => ({
        url: `/product/update/${slug}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Products"],
    }),
    getCategories: build.query({
      query: () => "/category/all",
      transformResponse: (response) => response?.data || [],
      providesTags: ["Categories"],
    }),
    // Create category (multipart/form-data expected)
    createCategory: build.mutation({
      query: (formData) => ({
        url: "/category/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetCategoriesQuery,
} = adminApiService;
