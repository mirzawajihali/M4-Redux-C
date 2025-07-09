import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useDeleteBookMutation } from "@/redux/api/baseApi";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import type { IBook } from "@/types";

interface DeleteBookModalProps {
  book: IBook;
}

export function DeleteBookModal({ book }: DeleteBookModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteBook, { isLoading: isDeleting }] = useDeleteBookMutation();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await deleteBook(book._id).unwrap();
      toast.success('Book deleted successfully!');
      setIsOpen(false);
      navigate('/'); // Navigate back to books list after deletion
    } catch (error) {
      console.error('Error deleting book:', error);
      toast.error('Failed to delete book. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="destructive" 
          size="sm"
          className="w-full sm:w-auto"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Book</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{book.title}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Trash2 className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Permanent Deletion
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    This will permanently delete the book and all associated data. 
                    This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Book'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
