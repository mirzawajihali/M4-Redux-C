import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from './api/baseApi'
import bookReducer from './features/book/bookSlice'

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    book: bookReducer, // Keep this for filter state only
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(baseApi.middleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch