import type { RootState } from "@/redux/store";
import type { IBook } from "@/types";


import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface InitialState {
    book: IBook[];
    filter: 'all' | 'completed' | 'incomplete';
}
const initialState : InitialState= {
        book :[
            {
                id : '1',
                title : 'Task 1',
                author : 'Author 1',
                genre : 'Genre 1',
                description : 'Description 1',
                isbn : 'ISBN-1',
                copies : 5, 
                availability : true,
                
            },
           
         ],
        filter: 'all',
}

const bookSlice = createSlice({
  name: 'book',
initialState,
reducers:{
    addTask : (state, action : PayloadAction<IBook>) => {
       
       
        const bookData ={
            ...action.payload,
            id: Math.random().toString(),
        }

        state.book.push(bookData);
    },

   

}
})

export const selectBook = (state: RootState) => {
    return state.book.book
};
export const selectFilter = (state: RootState) => {
    return state.book.filter
};

export const{ addTask} = bookSlice.actions;

export default bookSlice.reducer;