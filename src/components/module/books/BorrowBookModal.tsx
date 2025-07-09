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

// Form validation schema for borrowing books
const createBorrowBookSchema = (maxCopies: number) => z.object({
  book: z.string().min(1, 'Book ID is required'),
  quantity: z.coerce.number()
    .min(1, 'Quantity must be at least 1')
    .max(Math.min(maxCopies, 10), `Cannot borrow more than ${Math.min(maxCopies, 10)} copies`),
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

  // Create schema based on available copies
  const borrowBookSchema = createBorrowBookSchema(book.copies);

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
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
    },
  });

  const onSubmit = async (data: BorrowBookFormData) => {
    // Check if there are enough copies available
    if (book.copies === 0) {
      alert('This book is currently out of stock and cannot be borrowed.');
      return;
    }
    
    if (data.quantity > book.copies) {
      alert(`Only ${book.copies} copies are available. Please reduce the quantity.`);
      return;
    }

    try {
      const borrowData: IBorrowForm = {
        book: data.book,
        quantity: data.quantity,
        dueDate: data.dueDate,
      };

      await borrowBook(borrowData).unwrap();
      
      // Show success message
      alert(`Successfully borrowed ${data.quantity} copy(ies) of "${book.title}"!`);
      
      // Reset form and close modal
      reset();
      setIsOpen(false);
    } catch (error: unknown) {
      console.error('Error borrowing book:', error);
      
      // Log the full error for debugging
      if (error && typeof error === 'object' && 'data' in error) {
        console.log('Error data:', (error as { data: unknown }).data);
      }
      
      // Extract error message from response
      let errorMessage = 'Failed to borrow book. Please try again.';
      
      if (error && typeof error === 'object' && 'data' in error) {
        const errorData = (error as { data: unknown }).data;
        if (errorData && typeof errorData === 'object' && 'message' in errorData) {
          errorMessage = String((errorData as { message: string }).message);
        }
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String((error as { message: string }).message);
      }
      
      alert(`Failed to borrow book: ${errorMessage}`);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      // Reset form when opening
      setValue('book', book._id);
      setValue('quantity', 1);
      setValue('dueDate', new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    } else {
      // Reset form when closing
      reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="default" 
          size="sm" 
          className="flex-1"
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
