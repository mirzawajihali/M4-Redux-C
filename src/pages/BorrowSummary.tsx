import React from 'react';
import { useGetBorrowSummaryQuery, extractBorrowSummary } from '@/redux/api/baseApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Package, RefreshCw, AlertCircle } from 'lucide-react';
import type { IBorrowSummary } from '@/types';

const BorrowSummary: React.FC = () => {
  const { data: borrowData, isLoading, isError, error, refetch } = useGetBorrowSummaryQuery(undefined, {
    // Refetch every 30 seconds to ensure data is fresh
    pollingInterval: 30000,
    // Refetch on window focus
    refetchOnFocus: true,
    // Refetch when reconnecting
    refetchOnReconnect: true,
  });

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-bold text-gray-600 mb-2">Loading Borrow Summary...</h2>
            <p className="text-gray-500">Please wait while we fetch the borrowed books data</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (isError) {
    console.error('Error fetching borrow summary:', error);
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Summary</h2>
              <p className="text-red-600 mb-4">
                Failed to load borrow summary. Please try again.
              </p>
              <Button onClick={() => refetch()} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get borrow summary from API response
  const borrowSummary: IBorrowSummary[] = extractBorrowSummary(borrowData);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Borrowed Books Summary</h1>
          <p className="text-gray-600 text-lg mb-2">
            Aggregated view of all currently borrowed books from our library
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Data retrieved from aggregation API showing total quantities per book
          </p>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>

       

        {/* Borrow Summary Table */}
        {borrowSummary.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Borrowed Books</h3>
            <p className="text-gray-500">No books have been borrowed yet</p>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Borrowed Books Summary
              </CardTitle>
              <CardDescription>
                List of books that have been borrowed with total quantities from aggregation API
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Table Header */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-100 rounded-t-lg border-b-2 border-gray-200 font-semibold text-gray-700">
                <div>Book Title</div>
                <div>ISBN</div>
                <div className="text-center">Total Quantity Borrowed</div>
              </div>
              
              {/* Table Body */}
              <div className="space-y-0">
                {borrowSummary.map((item, index) => (
                  <div 
                    key={index}
                    className="grid grid-cols-3 gap-4 p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    {/* Book Title */}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {item.book.title}
                      </h3>
                    </div>
                    
                    {/* ISBN */}
                    <div className="font-mono text-sm text-gray-600">
                      {item.book.isbn}
                    </div>
                    
                    {/* Total Quantity */}
                    <div className="text-center">
                      <Badge variant="secondary" className="px-3 py-1">
                        <Package className="w-4 h-4 mr-1" />
                        {item.totalQuantity}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Summary Stats */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-blue-700">
                    <strong>Summary:</strong> {borrowSummary.length} unique books borrowed
                  </div>
                  <div className="text-sm text-blue-700">
                    <strong>Total copies borrowed:</strong> {borrowSummary.reduce((total, item) => total + item.totalQuantity, 0)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BorrowSummary;
