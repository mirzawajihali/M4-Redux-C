import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useBorrowBookMutation } from "@/redux/api/baseApi";
import type { IBook, IBorrowForm } from "@/types";
import { useState } from "react";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { extractErrorMessage } from '@/lib/utils';

// Form validation schema for borrowing books
const createBorrowBookSchema = () => z.object({
  book: z.string().min(1, 'Book ID is required'),
  quantity: z.coerce.number()
    .min(1, 'Quantity must be at least 1'),
    
  dueDate: z.string().min(1, 'Due date is required'),
});

type BorrowBookFormData = {
  book: string;
  quantity: number;
  dueDate: string;
};

interface BorrowBookModalProps {
  book: IBook;
}

export function BorrowBookModal({ book }: BorrowBookModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [borrowBook, { isLoading: isBorrowing }] = useBorrowBookMutation();
  const navigate = useNavigate();

  const borrowBookSchema = createBorrowBookSchema();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<BorrowBookFormData>({
    resolver: zodResolver(borrowBookSchema),
    defaultValues: {
      book: book._id,
      quantity: 1,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
    },
  });

  const onSubmit = async (data: BorrowBookFormData) => {
    

    try {
      const borrowData: IBorrowForm = {
        book: data.book,
        quantity: data.quantity,
        dueDate: data.dueDate,
      };

      await borrowBook(borrowData).unwrap();
      
      // Show success message
      toast.success(`Successfully borrowed ${data.quantity} copy(ies) of "${book.title}"!`);
      
    
      reset();
      setIsOpen(false);
      navigate('/borrow-summary')
    } catch (error: unknown) {
      console.error('Error borrowing book:', error);
      
      const errorMessage = extractErrorMessage(error, 'Failed to borrow book. Please try again.');
      toast.error(errorMessage);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
     
      setValue('book', book._id);
      setValue('quantity', 1);
      setValue('dueDate', new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    } else {
     
      reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="default" 
          size="sm" 
          className="w-full"
          disabled={!book.available || book.copies === 0}
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Borrow
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Borrow Book</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Book Information Display */}
          <div className="space-y-2">
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900">{book.title}</h4>
              <p className="text-sm text-gray-600">by {book.author}</p>
              <p className="text-sm text-gray-500">Available copies: {book.copies}</p>
            </div>
          </div>

          {/* Hidden book ID field */}
          <input type="hidden" {...register('book')} />
          
          {/* Quantity Input */}
          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-sm font-medium">
              Quantity to Borrow
            </Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={Math.min(book.copies, 10)}
              {...register('quantity')}
              placeholder="Enter quantity"
              className={errors.quantity ? 'border-red-500' : ''}
            />
            {errors.quantity && (
              <p className="text-sm text-red-600">{errors.quantity.message}</p>
            )}
            <p className="text-xs text-gray-500">
              Maximum {Math.min(book.copies, 10)} copies can be borrowed
            </p>
          </div>

          {/* Due Date Input */}
          <div className="space-y-2">
            <Label htmlFor="dueDate" className="text-sm font-medium">
              Due Date
            </Label>
            <Input
              id="dueDate"
              type="date"
              min={new Date().toISOString().split('T')[0]}
              {...register('dueDate')}
              className={errors.dueDate ? 'border-red-500' : ''}
            />
            {errors.dueDate && (
              <p className="text-sm text-red-600">{errors.dueDate.message}</p>
            )}
            <p className="text-xs text-gray-500">
              Select when you plan to return the book
            </p>
          </div>

          <DialogFooter className="flex gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isBorrowing}>
                Cancel
              </Button>
            </DialogClose>
            <Button 
              type="submit" 
              disabled={isBorrowing || !book.available || book.copies === 0}
              className="min-w-[100px]"
            >
              {isBorrowing ? 'Borrowing...' : 'Borrow Book'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
