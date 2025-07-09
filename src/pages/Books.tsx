import React, { useState } from 'react';
import BookCard from '@/components/module/books/BookCard';
import { selectFilter, setFilter } from '@/redux/features/book/bookSlice';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, BookOpen, Plus } from 'lucide-react';
import type { IBook } from '@/types';
import { Link } from 'react-router-dom';
import { useGetBooksQuery, extractBooks } from '@/redux/api/baseApi';

const Books: React.FC = () => {
    const { data: booksData, isLoading, isError, error, refetch } = useGetBooksQuery(undefined, {
    // Refetch every 30 seconds to ensure data is fresh
    pollingInterval: 30000,
    // Refetch on window focus
    refetchOnFocus: true,
    // Refetch when reconnecting
    refetchOnReconnect: true,
  });
  
  const currentFilter = useAppSelector(selectFilter);
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  

  // Manual refetch function
  const handleRefresh = () => {
    refetch();
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4 animate-pulse" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading books...</h3>
            <p className="text-gray-600">Please wait while we fetch your books</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (isError) {
    console.error('Error fetching books:', error);
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <BookOpen className="w-16 h-16 text-red-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error loading books</h3>
              <p className="text-red-600 mb-4">Failed to fetch books from the server. Please try again.</p>
              <p className="text-sm text-red-500 mb-4">Error: {error?.toString()}</p>
              <Button onClick={handleRefresh} variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get books from API response - adjust this based on your backend response structure
  const books: IBook[] = extractBooks(booksData);
  console.log('API Response:', booksData);
  console.log('Extracted books:', books);
  
  // Filter books based on search term, genre, and available
  const filteredBooks = books.filter((book: IBook) => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.genre.toLowerCase().includes(searchTerm.toLowerCase());
    
   
    
    const matchesavailable = currentFilter === 'all' || 
                               (currentFilter === 'available' && book.available) ||
                               (currentFilter === 'unavailable' && !book.available);
    
    return matchesSearch && matchesavailable;
  });

  const availableCount = books.filter((book: IBook) => book.available).length;
  const unavailableCount = books.filter((book: IBook) => !book.available).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                <BookOpen className="inline-block w-8 h-8 mr-3" />
                Book Library
              </h1>
              <p className="text-gray-600">
                Discover and manage your collection of {books.length} books
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleRefresh} variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                <Filter className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Link to="/create-book">
                <Button className="bg-black text-white hover:bg-gray-800">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Book
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4 mb-6">
            <Badge variant="default" className="text-sm px-3 py-1">
              Total: {books.length}
            </Badge>
            <Badge variant="default" className="text-sm px-3 py-1 bg-green-100 text-green-800">
              Available: {availableCount}
            </Badge>
            <Badge variant="destructive" className="text-sm px-3 py-1">
              Out of Stock: {unavailableCount}
            </Badge>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search books by title, author, or genre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

         
            
          </div>

          {/* available Filter */}
          <div className="flex gap-2 flex-wrap items-center">
            <Filter className="w-4 h-4 text-gray-500 mt-1" />
            <span className="text-sm text-gray-600 mr-3">Filter by available:</span>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={currentFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => dispatch(setFilter('all'))}
                className={currentFilter === 'all' ? 'bg-black text-white hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
              >
                All Books
              </Button>
              <Button
                variant={currentFilter === 'available' ? 'default' : 'outline'}
                size="sm"
                onClick={() => dispatch(setFilter('available'))}
                className={currentFilter === 'available' ? 'bg-green-600 text-white hover:bg-green-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
              >
                Available
              </Button>
              <Button
                variant={currentFilter === 'unavailable' ? 'default' : 'outline'}
                size="sm"
                onClick={() => dispatch(setFilter('unavailable'))}
                className={currentFilter === 'unavailable' ? 'bg-red-600 text-white hover:bg-red-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
              >
                Out of Stock
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredBooks.length} of {books.length} books
          </p>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book: IBook) => (
              <BookCard key={book._id} props={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;