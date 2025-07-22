// components/MovieListing.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMovieSearch } from '../hooks/useMovies';
import { Movie } from '../types/movie';
import MovieGrid from './MovieGrid';
import SearchBar from './SearchBar';
import FiltersPanel from './FiltersPanel';
import '../styles/movielisting.css';

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
    <div className="movie-listing-container">
      {/* Hero gradient background */}
      <div className="movie-listing-bg-overlay" />
      
      <div className="movie-listing-content">
        {/* Main container */}
        <div className="movie-listing-main-container">
          {/* Header section */}
          <header className="movie-listing-header">
            <div className="movie-listing-header-content">
              <h1 className="movie-listing-title">
                Welcome back, {user?.name}
              </h1>
              <p className="movie-listing-subtitle">
                
              </p>
            </div>
          </header>

          {/* Search section */}
          <div className="movie-listing-search-section">
            <div className="movie-listing-search-wrapper">
              <SearchBar 
                onSearch={handleSearch} 
                initialValue={searchQuery}
                placeholder="Search Here!"
                className="netflix-search"
              />
            </div>
            
            {/* Current search query display */}
            {searchQuery && (
              <div className="movie-listing-search-status">
                <span className="movie-listing-search-label">
                  Searching for: <span className="movie-listing-search-query">"{searchQuery}"</span>
                </span>
                <button
                  onClick={clearSearch}
                  className="movie-listing-clear-search"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>

          {/* Filters section */}
          <div className="movie-listing-filters-section">
            <FiltersPanel 
              filters={filters}
              onChange={setFilters}
              className="netflix-filters"
            />
          </div>

          {/* Results header */}
          {!loading && movies.length > 0 && (
            <div className="movie-listing-results-header">
              <div className="movie-listing-results-header-content">
                <h2 className="movie-listing-results-title">
                  {searchQuery ? `Search Results` : `Top Movies`}
                </h2>
                <span className="movie-listing-results-count">
                  
                </span>
              </div>
            </div>
          )}

          {/* Movie grid section */}
          <div className="movie-listing-grid-section">
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

      {/* Bottom fade effect */}
      <div className="movie-listing-bottom-fade" />
    </div>
  );
};

export default MovieListing;