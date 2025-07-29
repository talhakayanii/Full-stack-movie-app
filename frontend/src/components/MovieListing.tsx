// components/MovieListing.tsx
import React, { useEffect, useState } from 'react';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
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

  // Handle browser back button to redirect to dashboard
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Prevent the default back navigation
      window.history.pushState(null, '', window.location.href);
      // Navigate to dashboard instead
      navigate('/dashboard', { replace: true });
    };

    // Push current state to prevent immediate back
    window.history.pushState(null, '', window.location.href);
    
    // Add event listener for back button
    window.addEventListener('popstate', handlePopState);

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  const handleMovieClick = (movie: Movie) => {
    navigate(`/movies/${movie.id}`);
  };

  const handleNavigation = (route: string) => {
    navigate(route);
    setIsMenuOpen(false); // Close menu after navigation
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
              
              {/* Navigation Menu */}
              <div className="movie-listing-nav-menu">
                <button 
                  onClick={toggleMenu}
                  className="movie-listing-menu-toggle"
                  title="Navigation Menu"
                >
                  <svg 
                    className="movie-listing-hamburger-icon" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4 6h16M4 12h16M4 18h16" 
                    />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="movie-listing-dropdown">
                    <button 
                      onClick={() => handleNavigation('/dashboard')}
                      className="movie-listing-dropdown-item"
                    >
                      <svg 
                        className="movie-listing-dropdown-icon" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" 
                        />
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" 
                        />
                      </svg>
                      <span>Dashboard</span>
                    </button>
                    
                    <button 
                      onClick={() => handleNavigation('/favorites')}
                      className="movie-listing-dropdown-item"
                    >
                      <svg 
                        className="movie-listing-dropdown-icon" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                        />
                      </svg>
                      <span>Favorites</span>
                    </button>
                  </div>
                )}
              </div>
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