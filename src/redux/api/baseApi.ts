import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import type { IBook, IBookForm } from '@/types';

// Update this interface based on your actual backend response
interface BooksResponse {
  success: boolean;
  message: string;
  data: IBook[];
}

// Alternative response structure for single book operations
interface SingleBookResponse {
  success: boolean;
  message: string;
  data: IBook;
}

// Helper function to extract books from response
export function extractBooks(response: BooksResponse | undefined): IBook[] {
  if (!response) {
    return [];
  }
  // For the backend structure: { success: true, message: "...", data: [...] }
  return response?.data || [];
}

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api', 
  }),
  tagTypes: ['Book'],
  endpoints: (builder) => ({
    getBooks: builder.query<BooksResponse, void>({
      query: () => '/books',
      providesTags: ['Book'],
    }),
    getBookById: builder.query<SingleBookResponse, string>({
      query: (id) => `/books/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Book', id }],
    }),
    addBook: builder.mutation<SingleBookResponse, IBookForm>({
      query: (newBook) => ({
        url: '/books',
        method: 'POST',
        body: newBook,
      }),
      invalidatesTags: ['Book'],
    }),
    updateBook: builder.mutation<SingleBookResponse, { id: string } & Partial<IBook>>({
      query: ({id, ...updatedBook}) => ({
        url: `/books/${id}`,
        method: 'PUT',
        body: updatedBook,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Book', id }],
    }),
    deleteBook: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/books/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Book', id }],
    }),
  }),
})

export const {
  useGetBooksQuery,
  useGetBookByIdQuery,
  useAddBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
} = baseApi;