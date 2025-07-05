import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, User, Package, Tag, ArrowLeft} from 'lucide-react';
import type { IBook } from '@/types';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { deleteBook, selectBook } from '@/redux/features/book/bookSlice';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

interface BookDetailsProps {
  book: IBook;
}

const BookDetails: React.FC<BookDetailsProps> = () => {
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const books = useAppSelector(selectBook);
 
  const book = books.find((book: IBook) => book.id === id);

   if (!book) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Books
        </Button>
        <Card className="bg-white shadow-lg border-0 ring-1 ring-gray-200">
          <CardContent className="py-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Book Not Found</h2>
            <p className="text-gray-600 mb-6">The book you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/')}>
              Return to Books
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
 const {  title, author, genre, description, isbn, copies, availability } = book;

  const handleDelete = () => {
    if (id && window.confirm('Are you sure you want to delete this book?')) {
      dispatch(deleteBook(id));
      navigate('/');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Books
      </Button>

      <Card className="bg-white shadow-lg border-0 ring-1 ring-gray-200">
        <CardHeader className="pb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold text-gray-900 mb-3">
                {title}
              </CardTitle>
              <CardDescription className="flex items-center text-gray-600 text-lg mb-4">
                <User className="w-5 h-5 mr-2" />
                {author}
              </CardDescription>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="flex items-center">
                  <Tag className="w-4 h-4 mr-1" />
                  {genre}
                </Badge>
                <Badge variant={availability ? "default" : "destructive"}>
                  {availability ? "Available" : "Out of Stock"}
                </Badge>
                
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <div className="text-sm text-gray-500 font-mono bg-gray-100 px-3 py-1 rounded">
                ISBN: {isbn}
              </div>
              <div className="text-sm text-gray-600 flex items-center">
                <Package className="w-4 h-4 mr-1" />
                {copies} copies in library
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-700">{description}</p>
              </div>
             
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">Book Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Copies</span>
                    <span className="font-medium">{copies}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available Now</span>
                    <span className="font-medium">{availability ? copies : 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">On Loan</span>
                    <span className="font-medium">{copies - (availability ? copies : 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-4 border-t">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button 
              variant="default" 
              className="flex-1"
              disabled={!availability}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Borrow This Book
            </Button>
           
            <Button 
              variant="destructive" 
              className="flex-1"
             onClick={handleDelete}
            >
              Delete Book
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {/* Additional sections can be added here */}
   
    </div>
  );
};

export default BookDetails;