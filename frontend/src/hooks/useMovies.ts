// hooks/useMovies.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { Movie, SearchFilters } from '../types/movie';
import { movieAPI } from '../utils/movieApi';

// Define the API response type
interface MovieAPIResponse {
  results: Movie[];
  total_pages: number;
  page: number;
  total_results: number;
}

interface UseMovieSearchReturn {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  hasNextPage: boolean;
  currentPage: number;
  totalPages: number;
  searchQuery: string;
  filters: SearchFilters;
  fetchNextPage: () => void;
  handleSearch: (query: string) => void;
  clearSearch: () => void;
  setFilters: (filters: SearchFilters) => void;
  retry: () => void;
}

export const useMovieSearch = (): UseMovieSearchReturn => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true); // Start with loading true for initial load
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: 'popularity.desc'
  });
  const [initialized, setInitialized] = useState(false);

  // Use refs to prevent infinite re-renders
  const abortControllerRef = useRef<AbortController | null>(null);
  const loadingRef = useRef(false);

  // Fetch movies function
  const fetchMovies = useCallback(async (
    page: number = 1, 
    query: string = '', 
    currentFilters: SearchFilters = filters,
    append: boolean = false
  ) => {
    // Prevent duplicate requests
    if (loadingRef.current) return;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      loadingRef.current = true;
      setError(null);

      let response: MovieAPIResponse;

      if (query.trim()) {
        // Search movies
        response = await movieAPI.search(query, page);
      } else {
        // Discover movies with filters - this will load popular movies by default
        response = await movieAPI.discover({
          page,
          sort_by: currentFilters.sortBy,
          year: currentFilters.year,
          with_genres: currentFilters.genre
        });
      }

      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      setCurrentPage(page);
      setTotalPages(response.total_pages);

      if (append && page > 1) {
        setMovies(prev => [...prev, ...response.results]);
      } else {
        setMovies(response.results);
      }

    } catch (err: any) {
      // Don't set error if request was aborted
      if (err.name !== 'AbortError') {
        console.error('Error fetching movies:', err);
        setError(err.message || 'Failed to fetch movies');
        
        // If it's the first page and there's an error, clear movies
        if (!append || page === 1) {
          setMovies([]);
        }
      }
    } finally {
      setLoading(false);
      loadingRef.current = false;
      setInitialized(true);
    }
  }, [filters]);

  // Initial load - fetch popular movies when component mounts
  useEffect(() => {
    if (!initialized) {
      fetchMovies(1, '', filters, false);
    }
  }, [initialized, fetchMovies, filters]);

  // Handle search/filter changes (but not initial load)
  useEffect(() => {
    if (initialized) {
      fetchMovies(1, searchQuery, filters, false);
    }
  }, [searchQuery, filters, initialized, fetchMovies]);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  // Clear search - go back to popular movies
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setCurrentPage(1);
  }, []);

  // Fetch next page
  const fetchNextPage = useCallback(() => {
    if (loading || currentPage >= totalPages) return;
    
    const nextPage = currentPage + 1;
    fetchMovies(nextPage, searchQuery, filters, true);
  }, [loading, currentPage, totalPages, searchQuery, filters, fetchMovies]);

  // Update filters
  const handleFiltersChange = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  // Retry function
  const retry = useCallback(() => {
    fetchMovies(1, searchQuery, filters, false);
  }, [fetchMovies, searchQuery, filters]);

  // Infinite scroll implementation - integrated directly
  useEffect(() => {
    if (loading || currentPage >= totalPages) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      
      // Trigger when user scrolls to 80% of the page
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
      
      if (scrollPercentage >= 0.8 && !loadingRef.current) {
        fetchNextPage();
      }
    };

    const throttledHandleScroll = throttle(handleScroll, 300);
    window.addEventListener('scroll', throttledHandleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [loading, currentPage, totalPages, fetchNextPage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    movies,
    loading,
    error,
    hasNextPage: currentPage < totalPages,
    currentPage,
    totalPages,
    searchQuery,
    filters,
    fetchNextPage,
    handleSearch,
    clearSearch,
    setFilters: handleFiltersChange,
    retry
  };
};

// Simple throttle utility
const throttle = (func: () => void, delay: number) => {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;
  
  return () => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func();
      lastExecTime = currentTime;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func();
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};