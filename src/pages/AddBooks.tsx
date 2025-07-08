import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Plus, Save } from 'lucide-react';
// import { useAppDispatch } from '@/redux/hooks';
// import { addBook } from '@/redux/features/book/bookSlice';
import { useAddBookMutation } from '@/redux/api/baseApi';

// Form validation schema
const bookSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  author: z.string().min(1, 'Author is required').max(50, 'Author name must be less than 50 characters'),
  genre: z.enum(['FICTION', 'NON-FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'], {
    required_error: 'Please select a genre',
    invalid_type_error: 'Please select a valid genre',
  }),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
  isbn: z.string().min(10, 'ISBN must be at least 10 characters').max(25, 'ISBN must be less than 20 characters'),
  copies: z.coerce.number().min(1, 'Must have at least 1 copy').max(100, 'Cannot exceed 100 copies'),
});

const GENRE_OPTIONS = [
  { value: 'FICTION', label: 'Fiction' },
  { value: 'NON-FICTION', label: 'Non-Fiction' },
  { value: 'SCIENCE', label: 'Science' },
  { value: 'HISTORY', label: 'History' },
  { value: 'BIOGRAPHY', label: 'Biography' },
  { value: 'FANTASY', label: 'Fantasy' },
] as const;

type BookFormData = z.infer<typeof bookSchema>;

const AddBooks: React.FC = () => {
  const navigate = useNavigate();
  const [addBook, { isLoading: isAdding }] = useAddBookMutation();
  
  const form = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: '',
      author: '',
      genre: 'FICTION',
      description: '',
      isbn: '',
      copies: 1,
    },
  });

  const onSubmit = async (data: BookFormData) => {
    try {
      const newBook = {
        ...data,
        // Don't send available field, let backend handle it
      };
      
      console.log('Submitting book:', newBook);
      await addBook(newBook).unwrap();
      
      form.reset();
      alert('Book added successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Failed to add book. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            <Plus className="inline-block w-8 h-8 mr-3" />
            Add New Book
          </h1>
          <p className="text-gray-600">
            Add a new book to your library collection
          </p>
        </div>

        {/* Form Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Book Information
            </CardTitle>
            <CardDescription>
              Fill in the details below to add a new book to your library
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Title Field */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Book Title <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter book title"
                          {...field}
                          className="focus:ring-2 focus:ring-black focus:border-black"
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500">
                        The full title of the book
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Author Field */}
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Author <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter author name"
                          {...field}
                          className="focus:ring-2 focus:ring-black focus:border-black"
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500">
                        The author or authors of the book
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Genre Field */}
                <FormField
                  control={form.control}
                  name="genre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Genre <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="focus:ring-2 focus:ring-black focus:border-black">
                            <SelectValue placeholder="Select a genre" />
                          </SelectTrigger>
                          <SelectContent>
                            {GENRE_OPTIONS.map((genre) => (
                              <SelectItem key={genre.value} value={genre.value}>
                                {genre.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500">
                        Select the genre or category of the book
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description Field */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Description <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter a brief description of the book..."
                          rows={4}
                          {...field}
                          className="focus:ring-2 focus:ring-black focus:border-black resize-none"
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500">
                        A brief summary or description of the book (10-500 characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ISBN Field */}
                <FormField
                  control={form.control}
                  name="isbn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        ISBN <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., ISBN-978-0-123456-78-9"
                          {...field}
                          className="focus:ring-2 focus:ring-black focus:border-black"
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500">
                        The International Standard Book Number
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Copies Field */}
                <FormField
                  control={form.control}
                  name="copies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Number of Copies <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="100"
                          placeholder="1"
                          {...field}
                          className="focus:ring-2 focus:ring-black focus:border-black"
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-gray-500">
                        How many copies of this book are available
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="submit"
                    className="flex-1 bg-black text-white hover:bg-gray-800 h-12"
                    disabled={isAdding}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isAdding ? 'Adding Book...' : 'Add Book'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="px-8 h-12 border-gray-300 hover:bg-gray-50"
                    onClick={() => form.reset()}
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-blue-900 mb-1">Tips for Adding Books</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Make sure the ISBN is accurate for proper cataloging</li>
                  <li>• Use descriptive genres to help users find books easily</li>
                  <li>• Write clear descriptions that capture the book's essence</li>
                  <li>• Double-check the number of copies available</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddBooks;
