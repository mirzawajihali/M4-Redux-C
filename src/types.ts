export interface IBook {
  _id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  isbn: string;
  copies: number;
  available: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// For frontend forms and new book creation
export interface IBookForm {
  title: string;
  author: string;
  genre: string;
  description: string;
  isbn: string;
  copies: number;
}

export interface IBorrow {
  _id?: string;
  book: string;
  quantity: number;
  dueDate: string;
  createdAt?: string;
  updatedAt?: string;
}


export interface IBorrowForm {
  book: string; 
  quantity: number;
  dueDate: string;
}

export interface IBorrowSummary {
  book: {
    title: string;
    isbn: string;
  };
  totalQuantity: number;
}