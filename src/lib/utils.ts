import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extracts error message from various error response structures
 * Handles RTK Query errors, fetch errors, and generic errors
 */
export function extractErrorMessage(error: unknown, defaultMessage = 'An error occurred'): string {
  // RTK Query error with data.message
  if (
    error && 
    typeof error === 'object' && 
    'data' in error && 
    error.data &&
    typeof error.data === 'object' &&
    'message' in error.data &&
    typeof error.data.message === 'string'
  ) {
    return error.data.message;
  }
  
  // RTK Query error with data.error
  if (
    error && 
    typeof error === 'object' && 
    'data' in error && 
    error.data &&
    typeof error.data === 'object' &&
    'error' in error.data &&
    typeof error.data.error === 'string'
  ) {
    return error.data.error;
  }
  
  // Standard error with message property
  if (
    error && 
    typeof error === 'object' && 
    'message' in error && 
    typeof error.message === 'string'
  ) {
    return error.message;
  }
  
  // String error
  if (typeof error === 'string') {
    return error;
  }
  
  // Fallback to default message
  return defaultMessage;
}