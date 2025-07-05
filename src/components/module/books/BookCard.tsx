import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, User, Package, Tag } from 'lucide-react';
import type { IBook } from '@/types';
import { useAppDispatch } from '@/redux/hooks';
import { deleteBook } from '@/redux/features/book/bookSlice';
import { Link } from 'react-router-dom';

interface BookCardProps {
  props: IBook;
}

const BookCard: React.FC<BookCardProps> = ({ props }) => {
  const { title, author, genre, description, isbn, copies, availability } = props;
  const dispatch = useAppDispatch();

  return (
    <Card className="w-full max-w-sm mx-auto bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 ring-1 ring-gray-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2 mb-2">
              {title}
            </CardTitle>
            <CardDescription className="flex items-center text-gray-600 mb-2">
              <User className="w-4 h-4 mr-1" />
              {author}
            </CardDescription>
          </div>
          <Badge 
            variant={availability ? "default" : "destructive"}
            className="ml-2"
          >
            {availability ? "Available" : "Out of Stock"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Tag className="w-4 h-4 mr-2" />
            <span className="font-medium">{genre}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <Package className="w-4 h-4 mr-2" />
            <span>{copies} copies available</span>
          </div>
          
          <div className="text-sm text-gray-700 line-clamp-3">
            {description}
          </div>
          
          <div className="text-xs text-gray-500 font-mono">
            {isbn}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-4">
        <div className="flex gap-2 w-full">
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            disabled={!availability}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Borrow
          </Button>
         <Link to={`/book/${props.id}`}>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
          >
            Details
          </Button>
         </Link>
          <Button 
            variant="destructive" 
            size="sm" 
            className="flex-1"
            onClick={()=> dispatch(deleteBook(props.id))} // Assuming deleteBook is an action creator

          >
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BookCard;