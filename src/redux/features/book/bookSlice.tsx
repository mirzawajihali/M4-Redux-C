import type { RootState } from "@/redux/store";
import type { IBook } from "@/types";


import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface InitialState {
    book: IBook[];
    filter: 'all' | 'available' | 'unavailable';
}
const initialState : InitialState= {
        book :[
            {
                _id : '1',
                title : 'The Great Gatsby',
                author : 'F. Scott Fitzgerald',
                genre : 'Classic Literature',
                description : 'A timeless American classic about the Jazz Age, exploring themes of wealth, love, and the American Dream.',
                isbn : 'ISBN-978-0-7432-7356-5',
                copies : 5, 
                available : true,
            },
            {
                _id : '2',
                title : 'To Kill a Mockingbird',
                author : 'Harper Lee',
                genre : 'Fiction',
                description : 'A gripping tale of racial injustice and childhood in the American South.',
                isbn : 'ISBN-978-0-06-112008-4',
                copies : 3, 
                available : true,
            },
            {
                _id : '3',
                title : '1984',
                author : 'George Orwell',
                genre : 'Dystopian Fiction',
                description : 'A dystopian social science fiction novel about totalitarianism and surveillance.',
                isbn : 'ISBN-978-0-452-28423-4',
                copies : 0, 
                available : false,
            },
            {
                _id : '4',
                title : 'Pr_ide and Prejudice',
                author : 'Jane Austen',
                genre : 'Romance',
                description : 'A romantic novel that critiques the British landed gentry at the end of the 18th century.',
                isbn : 'ISBN-978-0-14-143951-8',
                copies : 7, 
                available : true,
            },
            {
                _id : '5',
                title : 'The Catcher in the Rye',
                author : 'J.D. Salinger',
                genre : 'Coming-of-age Fiction',
                description : 'A controversial novel about teenage rebellion and alienation in post-war America.',
                isbn : 'ISBN-978-0-316-76948-0',
                copies : 2, 
                available : true,
            },
            {
                _id : '6',
                title : 'Harry Potter and the Philosopher\'s Stone',
                author : 'J.K. Rowling',
                genre : 'Fantasy',
                description : 'The first book in the beloved Harry Potter series about a young wizard\'s adventures.',
                isbn : 'ISBN-978-0-7475-3269-9',
                copies : 10, 
                available : true,
            },
         ],
        filter: 'all',
}

const bookSlice = createSlice({
  name: 'book',
initialState,
reducers:{
    addBook : (state, action : PayloadAction<IBook>) => {
       
        state.book.push(action.payload);
    },
    setFilter: (state, action: PayloadAction<'all' | 'available' | 'unavailable'>) => {
        state.filter = action.payload;
    },
       deleteBook: (state, action: PayloadAction<string>) => {
      state.book = state.book.filter((item) => item._id !== action.payload);
    },
   
    updateBook: (state, action: PayloadAction<IBook>) => {
      const index = state.book.findIndex(book => book._id === action.payload._id);
      if (index !== -1) {
        state.book[index] = action.payload;
      }
    },
}
})

export const selectBook = (state: RootState) => {
    return state.book.book
};
export const selectFilter = (state: RootState) => {
    return state.book.filter
};

export const{ addBook,updateBook, setFilter, deleteBook} = bookSlice.actions;

export default bookSlice.reducer;