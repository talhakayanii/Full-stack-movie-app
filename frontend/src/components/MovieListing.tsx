// components/MovieListing.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMovieSearch } from '../hooks/useMovies';
import { Movie } from '../types/movie';
import MovieGrid from './MovieGrid';
import SearchBar from './SearchBar';
import FiltersPanel from './FiltersPanel';

const MovieListing: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const {
    movies,
    loading,
    error,
    hasNextPage,
    fetchNextPage,
    searchQuery,
    handleSearch,
    clearSearch,
    filters,
    setFilters
  } = useMovieSearch();

  const handleMovieClick = (movie: Movie) => {
    navigate(`/movies/${movie.id}`);
  };

  return (
    <div className="netflix-listing min-h-screen bg-black text-white">
      {/* Netflix-style hero gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 to-black pointer-events-none" />
      
      <div className="relative z-10">
        {/* Container with Netflix-style padding */}
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          {/* Netflix-style header */}
          <header className="pt-8 pb-8 lg:pb-12">
            <div className="flex flex-col space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                Welcome back, {user?.name}
              </h1>
              <p className="text-gray-400 text-base lg:text-lg">
                
              </p>
            </div>
          </header>

          {/* Netflix-style search section */}
          <div className="mb-8 lg:mb-12">
            <div className="max-w-2xl">
              <SearchBar 
                onSearch={handleSearch} 
                initialValue={searchQuery}
                placeholder="Search Here!"
                className="netflix-search"
              />
            </div>
            
            {/* Show current search query */}
            {searchQuery && (
              <div className="mt-4 flex items-center space-x-4">
                <span className="text-gray-400">
                  Searching for: <span className="text-white font-medium">"{searchQuery}"</span>
                </span>
                <button
                  onClick={clearSearch}
                  className="text-gray-400 hover:text-white text-sm underline transition-colors"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>

          {/* Netflix-style filters */}
          <div className="mb-8 lg:mb-12">
            <FiltersPanel 
              filters={filters}
              onChange={setFilters}
              className="netflix-filters"
            />
          </div>

          {/* Results count and category */}
          {!loading && movies.length > 0 && (
            <div className="mb-6 lg:mb-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl lg:text-2xl font-semibold text-white top-movies-heading">
                  {searchQuery ? `Search Results` : `Top Movies`}
                </h2>
                <span className="text-gray-400 text-sm lg:text-base">
                  
                </span>
              </div>
            </div>
          )}

          {/* Netflix-style movie grid */}
          <div className="pb-12 lg:pb-16">
            <MovieGrid
              movies={movies}
              loading={loading}
              error={error}
              hasNextPage={hasNextPage}
              onMovieClick={handleMovieClick}
              onRetry={fetchNextPage}
            />
          </div>
        </div>
      </div>

      {/* Netflix-style bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </div>
  );
};

export default MovieListing;