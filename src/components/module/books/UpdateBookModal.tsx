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
import { useAppDispatch } from "@/redux/hooks";
import { updateBook } from "@/redux/features/book/bookSlice";
import type { IBook } from "@/types";
import { useState } from "react";

// Form validation schema for updating books
const updateBookSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  author: z.string().min(1, 'Author is required').max(50, 'Author name must be less than 50 characters'),
  genre: z.string().min(1, 'Genre is required').max(30, 'Genre must be less than 30 characters'),
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
  const dispatch = useAppDispatch();

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
      genre: book.genre,
      description: book.description,
      isbn: book.isbn,
      copies: book.copies,
      available: book.available,
    },
  });

  const onSubmit = (data: UpdateBookFormData) => {
    const updatedBook: IBook = {
      ...book,
      ...data,
      available: data.copies > 0,
    };

    dispatch(updateBook(updatedBook));
    setIsOpen(false);
    reset();
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="p-2">
          <Pencil className="w-4 h-4" /> Update Book
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
              <Input
                id="genre"
                {...register("genre")}
                placeholder="Enter book genre"
              />
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
                <input
                  id="available"
                  type="checkbox"
                  {...register("available")}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-600">
                  Available for borrowing
                </span>
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Book"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}