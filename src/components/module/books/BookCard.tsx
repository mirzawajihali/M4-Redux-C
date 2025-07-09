import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Package, Tag, Loader2 } from 'lucide-react';
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
   <Card className="w-full max-w-sm mx-auto bg-white shadow-sm hover:shadow-md transition-all duration-200 rounded-xl border border-gray-100 overflow-hidden">
  <CardHeader className="pb-3 px-5 pt-5">
    <div className="flex items-start justify-between gap-2">
      <div className="flex-1 space-y-1.5">
        <CardTitle className="text-lg font-medium text-gray-900 line-clamp-2 leading-snug">
          {title}
        </CardTitle>
        <CardDescription className="flex items-center text-sm text-gray-500">
          <User className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 opacity-70" />
          <span className="truncate">{author}</span>
        </CardDescription>
      </div>
      <Badge 
        variant={available ? "default" : "destructive"}
        className="ml-2 flex-shrink-0 h-6"
      >
        {available ? "Available" : "Out of Stock"}
      </Badge>
    </div>
  </CardHeader>
  
  <CardContent className="pt-0 px-5 pb-3">
    <div className="space-y-3">
      <div className="flex items-center text-sm text-gray-700">
        <Tag className="w-3.5 h-3.5 mr-2 text-gray-500 flex-shrink-0 opacity-80" />
        <span className="font-medium text-gray-700">{genre}</span>
      </div>
      
      <div className="flex items-center text-sm text-gray-700">
        <Package className="w-3.5 h-3.5 mr-2 text-gray-500 flex-shrink-0 opacity-80" />
        <span>{copies} {copies === 1 ? 'copy' : 'copies'} available</span>
      </div>
      
      <div className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
        {description}
      </div>
      
      <div className="text-xs text-gray-400 font-mono bg-gray-50 px-2.5 py-1 rounded-md inline-block border border-gray-100">
        ISBN: {isbn}
      </div>
    </div>
  </CardContent>
  
  <CardFooter className="pt-3 pb-4 px-5 bg-gray-50/50 border-t border-gray-100">
    <div className="flex gap-2.5 w-full flex-wrap">
      <BorrowBookModal book={props}  />
      
      <div className="flex-1 min-w-[calc(50%-5px)]">
        <UpdateBookModal book={props} />
      </div>
      
      <Link 
        to={`/book/${props._id}`} 
        className="flex-1 min-w-[calc(50%-5px)]"
      >
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full h-9"
        >
          Details
        </Button>
      </Link>
      
      <Button 
        variant="destructive" 
        size="sm"
        className="flex-1 min-w-[calc(50%-5px)] h-9"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <span className="flex items-center justify-center gap-1.5">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Deleting...
          </span>
        ) : 'Delete'}
      </Button>
    </div>
  </CardFooter>
</Card>
  );
};

export default BookCard;