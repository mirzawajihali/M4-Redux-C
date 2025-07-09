import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import type { IBook, IBookForm, IBorrow, IBorrowForm, IBorrowSummary } from '@/types';

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

// Borrow response interfaces
interface BorrowResponse {
  success: boolean;
  message: string;
  data: IBorrow;
}

interface BorrowSummaryResponse {
  success: boolean;
  message: string;
  data: IBorrowSummary[];
}

// Helper function to extract books from response
export function extractBooks(response: BooksResponse | undefined): IBook[] {
  if (!response) {
    return [];
  }
  
  return response?.data || [];
}

// Helper function to extract borrow summary from response
export function extractBorrowSummary(response: BorrowSummaryResponse | undefined): IBorrowSummary[] {
  if (!response) {
    return [];
  }
  return response?.data || [];
}

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://backend-m3-assignment.vercel.app/api', 
  }),
  tagTypes: ['Book', 'Borrow'],
  endpoints: (builder) => ({
    getBooks: builder.query<BooksResponse, void>({
      query: () => '/books',
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Book' as const, id: _id })),
              { type: 'Book', id: 'LIST' },
            ]
          : [{ type: 'Book', id: 'LIST' }],
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
      invalidatesTags: [{ type: 'Book', id: 'LIST' }],
      
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Update the cache immediately after successful mutation
          dispatch(
            baseApi.util.updateQueryData('getBooks', undefined, (draft) => {
              if (draft.data) {
                draft.data.push(data.data);
              }
            })
          );
        } catch {
          // If the mutation fails, the cache will revert automatically
        }
      },
    }),
    updateBook: builder.mutation<SingleBookResponse, { id: string } & Partial<IBook>>({
      query: ({id, ...updatedBook}) => ({
        url: `/books/${id}`,
        method: 'PUT',
        body: updatedBook,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Book', id },
        { type: 'Book', id: 'LIST' },
        { type: 'Borrow', id: 'LIST' }, // Also invalidate borrow summary since book availability might change
      ],
      // Optimistic update
      async onQueryStarted({ id, ...updatedBook }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          baseApi.util.updateQueryData('getBooks', undefined, (draft) => {
            const book = draft.data?.find((book) => book._id === id);
            if (book) {
              Object.assign(book, updatedBook);
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    deleteBook: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/books/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Book', id },
        { type: 'Book', id: 'LIST' },
        { type: 'Borrow', id: 'LIST' }, // Also invalidate borrow summary
      ],
      // Optimistic update
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          baseApi.util.updateQueryData('getBooks', undefined, (draft) => {
            if (draft.data) {
              draft.data = draft.data.filter((book) => book._id !== id);
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    // Borrow endpoints
    borrowBook: builder.mutation<BorrowResponse, IBorrowForm>({
      query: (borrowData) => ({
        url: '/borrows',
        method: 'POST',
        body: borrowData,
      }),
      invalidatesTags: [
        { type: 'Book', id: 'LIST' }, // Invalidate books list to update availability
        { type: 'Borrow', id: 'LIST' }, // Invalidate borrow summary
      ],
      // Optimistic update for better UX
      async onQueryStarted({ book: bookId, quantity }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          baseApi.util.updateQueryData('getBooks', undefined, (draft) => {
            const book = draft.data?.find((book) => book._id === bookId);
            if (book && book.copies >= quantity) {
              book.copies -= quantity;
              book.available = book.copies > 0;
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          // If the mutation fails, revert the optimistic update
          patchResult.undo();
        }
      },
    }),
    getBorrowSummary: builder.query<BorrowSummaryResponse, void>({
      query: () => '/borrows',
      providesTags: [{ type: 'Borrow', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetBooksQuery,
  useGetBookByIdQuery,
  useAddBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useBorrowBookMutation,
  useGetBorrowSummaryQuery,
} = baseApi;