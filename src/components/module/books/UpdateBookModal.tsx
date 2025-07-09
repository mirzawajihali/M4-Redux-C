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
import { Textarea } from "@/components/ui/textarea";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUpdateBookMutation } from "@/redux/api/baseApi";
import type { IBook } from "@/types";
import { useState, useEffect } from "react";
import { toast } from 'react-toastify';

// Form validation schema for updating books
const updateBookSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  author: z.string().min(1, 'Author is required').max(50, 'Author name must be less than 50 characters'),
  genre: z.enum(['FICTION', 'NON-FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'], {
    required_error: 'Please select a genre',
    invalid_type_error: 'Please select a valid genre',
  }),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
  isbn: z.string().min(10, 'ISBN must be at least 10 characters').max(25, 'ISBN must be less than 20 characters'),
  copies: z.coerce.number().min(0, 'Copies cannot be negative').max(100, 'Cannot exceed 100 copies'),
  available: z.boolean(),
});

type UpdateBookFormData = z.infer<typeof updateBookSchema>;

interface UpdateBookModalProps {
  book: IBook;
}

export function UpdateBookModal({ book }: UpdateBookModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdateBookFormData>({
    resolver: zodResolver(updateBookSchema),
    defaultValues: {
      title: book.title,
      author: book.author,
      genre: book.genre as 'FICTION' | 'NON-FICTION' | 'SCIENCE' | 'HISTORY' | 'BIOGRAPHY' | 'FANTASY',
      description: book.description,
      isbn: book.isbn,
      copies: book.copies,
      available: book.available,
    },
  });

  // Update form values when book prop changes
  useEffect(() => {
    reset({
      title: book.title,
      author: book.author,
      genre: book.genre as 'FICTION' | 'NON-FICTION' | 'SCIENCE' | 'HISTORY' | 'BIOGRAPHY' | 'FANTASY',
      description: book.description,
      isbn: book.isbn,
      copies: book.copies,
      available: book.available,
    });
  }, [book, reset]);

  const onSubmit = async (data: UpdateBookFormData) => {
    try {
      const updatedData = {
        id: book._id,
        ...data,
        available: data.copies > 0,
      };

      await updateBook(updatedData).unwrap();
      setIsOpen(false);
      reset();
      toast.success('Book updated successfully!');
    } catch (error) {
      console.error('Error updating book:', error);
      toast.error('Failed to update book. Please try again.');
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      // Reset form with current book values when opening
      reset({
        title: book.title,
        author: book.author,
        genre: book.genre as 'FICTION' | 'NON-FICTION' | 'SCIENCE' | 'HISTORY' | 'BIOGRAPHY' | 'FANTASY',
        description: book.description,
        isbn: book.isbn,
        copies: book.copies,
        available: book.available,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="secondary" 
          size="sm" 
          className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 border border-blue-300"
        >
          <Pencil className="w-4 h-4 mr-2" />
          Update
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Update Book</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Enter book title"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Author */}
            <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Input
                id="author"
                {...register("author")}
                placeholder="Enter author name"
              />
              {errors.author && (
                <p className="text-sm text-red-500">{errors.author.message}</p>
              )}
            </div>

            {/* Genre */}
            <div className="space-y-2">
              <Label htmlFor="genre">Genre *</Label>
              <select
                id="genre"
                {...register("genre")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a genre</option>
                <option value="FICTION">Fiction</option>
                <option value="NON-FICTION">Non-Fiction</option>
                <option value="SCIENCE">Science</option>
                <option value="HISTORY">History</option>
                <option value="BIOGRAPHY">Biography</option>
                <option value="FANTASY">Fantasy</option>
              </select>
              {errors.genre && (
                <p className="text-sm text-red-500">{errors.genre.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Enter book description"
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            {/* ISBN */}
            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN *</Label>
              <Input
                id="isbn"
                {...register("isbn")}
                placeholder="Enter ISBN (e.g., ISBN-978-0-123456-78-9)"
              />
              {errors.isbn && (
                <p className="text-sm text-red-500">{errors.isbn.message}</p>
              )}
            </div>

            {/* Copies */}
            <div className="space-y-2">
              <Label htmlFor="copies">Number of Copies *</Label>
              <Input
                id="copies"
                type="number"
                min="0"
                max="100"
                {...register("copies")}
                placeholder="Enter number of copies"
              />
              {errors.copies && (
                <p className="text-sm text-red-500">{errors.copies.message}</p>
              )}
            </div>

            {/* available - Read only, auto-calculated */}
            <div className="space-y-2">
              <Label htmlFor="available">available</Label>
              <div className="flex items-center space-x-2">
               
              </div>
              <p className="text-xs text-gray-500">
                Note: available will be automatically set based on the number of copies
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting || isUpdating}>
              {isSubmitting || isUpdating ? "Updating..." : "Update Book"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}