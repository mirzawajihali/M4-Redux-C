import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Package, Tag,  } from 'lucide-react';
import type { IBook } from '@/types';
import { Link } from 'react-router-dom';
import { UpdateBookModal } from './UpdateBookModal';
import { BorrowBookModal } from './BorrowBookModal';
import { useDeleteBookMutation } from '@/redux/api/baseApi';
import { toast } from 'react-toastify';

interface BookCardProps {
  props: IBook;
}

const BookCard: React.FC<BookCardProps> = ({ props }) => {
  const { title, author, genre, description, isbn, copies, available } = props;
  const [deleteBook, { isLoading: isDeleting }] = useDeleteBookMutation();


  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(props._id).unwrap();
        toast.success('Book deleted successfully!');
      } catch (error) {
        console.error('Error deleting book:', error);
        toast.error('Failed to delete book. Please try again.');
      }
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-gray-300 h-full flex flex-col">
      <CardHeader className="pb-4 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2 mb-2 break-words">
              {title}
            </CardTitle>
            <CardDescription className="flex items-center text-gray-600 mb-2">
              <User className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{author}</span>
            </CardDescription>
          </div>
          <Badge 
            variant={available ? "default" : "destructive"}
            className="ml-2 flex-shrink-0"
          >
            {available ? "Available" : "Out of Stock"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 pb-4 flex-1">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Tag className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="font-medium truncate">{genre}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Package className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{copies} copies available</span>
          </div>
          
          <div className="text-sm text-gray-700 leading-relaxed break-words">
            {description.slice(0, 50 ) + '...'}
          </div>
          
          <div className="text-xs text-gray-500 font-mono truncate bg-gray-50 p-2 rounded">
            {isbn}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-4 border-t border-gray-100 flex-shrink-0 mt-auto">
        <div className="w-full space-y-3">
          {/* First row - Borrow and Update buttons */}
          <div className="grid grid-cols-2 gap-2">
            <BorrowBookModal book={props} />
            <UpdateBookModal book={props}/>
          </div>
          
          {/* Second row - Details and Delete buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Link to={`/book/${props._id}`} className="w-full">
              <Button 
                variant="secondary" 
                size="sm" 
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300"
              >
                Details
              </Button>
            </Link>
            <Button 
              variant="destructive" 
              size="sm" 
              className="w-full bg-red-500 hover:bg-red-600 text-white"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BookCard;