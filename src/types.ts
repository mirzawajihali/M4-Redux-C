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