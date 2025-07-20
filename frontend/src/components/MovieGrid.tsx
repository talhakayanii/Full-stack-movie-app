import React, { memo, useMemo } from 'react';
import { Movie } from '../types/movie';
import MovieCard from './MovieCard';

interface MovieGridProps {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  hasNextPage: boolean;
  onMovieClick: (movie: Movie) => void;
  onRetry?: () => void;
}

const MovieGrid: React.FC<MovieGridProps> = memo(({
  movies,
  loading,
  error,
  hasNextPage,
  onMovieClick,
  onRetry
}) => {
  // Filter out movies without poster images
  const moviesWithPosters = useMemo(() => {
    return movies.filter(movie => movie.poster_path && movie.poster_path.trim() !== '');
  }, [movies]);

  // Compact loading skeleton
  const MovieSkeleton = () => (
    <div className="movie-skeleton">
      <div className="skeleton-poster" />
      <div className="skeleton-info">
        <div className="skeleton-title" />
        <div className="skeleton-meta" />
      </div>
    </div>
  );

  // Error state
  if (error && moviesWithPosters.length === 0) {
    return (
      <div className="movie-grid-container">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-red-400 text-4xl mb-3">⚠️</div>
          <h3 className="text-white text-lg mb-2">Something went wrong</h3>
          <p className="text-gray-400 text-center mb-4 max-w-md text-sm">
            {error}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-200 font-medium text-sm"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  // No movies found (including when all movies are filtered out)
  if (!loading && moviesWithPosters.length === 0) {
    return (
      <div className="movie-grid-container">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="text-gray-400 text-4xl mb-3">🎬</div>
          <h3 className="text-white text-lg mb-2">No movies found</h3>
          <p className="text-gray-400 text-center text-sm">
            Try adjusting your search criteria or browse our recommendations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-grid-container">
      {/* Fixed grid with proper responsive columns */}
      <div className="movie-grid">
        {moviesWithPosters.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onClick={onMovieClick}
          />
        ))}
        
        {/* Loading skeletons - show appropriate number based on screen size */}
        {loading && (
          <>
            {Array.from({ length: 20 }).map((_, index) => (
              <MovieSkeleton key={`skeleton-${index}`} />
            ))}
          </>
        )}
      </div>

      {/* Loading indicator for infinite scroll */}
      {loading && moviesWithPosters.length > 0 && (
        <div className="flex justify-center py-6 mt-6">
          <div className="flex items-center text-gray-400">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600 mr-2"></div>
            <span className="text-sm">Loading more movies...</span>
          </div>
        </div>
      )}

      {/* End of results indicator */}
      {!loading && !hasNextPage && moviesWithPosters.length > 0 && (
        <div className="flex justify-center py-6 mt-6">
          <div className="text-gray-400 text-center bg-gray-800/30 rounded-lg px-4 py-3">
            <div className="text-xl mb-1">🎭</div>
            <p className="text-sm mb-1">All movies loaded!</p>
            <p className="text-xs opacity-75">{moviesWithPosters.length} movies total</p>
          </div>
        </div>
      )}

      {/* Error during pagination */}
      {error && moviesWithPosters.length > 0 && (
        <div className="flex justify-center py-4 mt-4">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 max-w-sm">
            <div className="flex items-center text-red-400 mb-2">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-sm">Error loading more</span>
            </div>
            <p className="text-red-300 text-xs mb-3">{error}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-xs transition-colors duration-200 font-medium"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

MovieGrid.displayName = 'MovieGrid';

export default MovieGrid;