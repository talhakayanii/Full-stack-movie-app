import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MovieDetails as MovieDetailsType } from '../types/movie';
import { movieAPI } from '../utils/movieApi';
import { imageHelpers } from '../utils/movieApi';
import LoadingSpinner from './LoadingSpinner';
import '../styles/moviedetails.css'
const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        
        const movieData = await movieAPI.getMovieDetails(Number(id));
        setMovie(movieData);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  const formatRuntime = (minutes: number): string => {
    if (!minutes) return 'Runtime unknown';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatBudget = (amount: number): string => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="movie-details-loading-wrapper">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="movie-details-error-wrapper">
        <div className="movie-details-error-content">
          <div className="movie-details-error-icon">🎬</div>
          <h2 className="movie-details-error-title">Movie Not Found</h2>
          <p className="movie-details-error-message">{error || 'The requested movie could not be loaded.'}</p>
          <button 
            onClick={() => navigate('/movies')}
            className="movie-details-error-button"
          >
            Back to Movies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-details-main-container">
      {/* Animated Background Elements */}
      <div className="movie-details-background-overlay">
        <div className="movie-details-floating-shape-1"></div>
        <div className="movie-details-floating-shape-2"></div>
        <div className="movie-details-floating-shape-3"></div>
        <div className="movie-details-floating-shape-4"></div>
        
        <div className="movie-details-grid-pattern">
          <div className="movie-details-grid-lines"></div>
        </div>
        
        <div className="movie-details-light-streaks">
          <div className="movie-details-streak-1"></div>
          <div className="movie-details-streak-2"></div>
          <div className="movie-details-streak-3"></div>
        </div>
      </div>
      
      {/* Content overlay */}
      <div className="movie-details-content-wrapper">
        {/* Header with Back Button */}
        <div className="movie-details-header">
          <button 
            onClick={() => navigate('/movies')}
            className="movie-details-back-button"
          >
            <svg className="movie-details-back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="movie-details-back-text">Back to Movies</span>
          </button>
        </div>

        {/* Main Movie Details Layout */}
        <div className="movie-details-main-content">
          <div className="movie-details-card">
            <div className="movie-details-layout-grid">
              
              {/* Movie Poster - Left Side */}
              <div className="movie-details-poster-section">
                <div className="movie-details-poster-container">
                  <div className="movie-details-poster-wrapper">
                    <img
                      src={movie.poster_path ? imageHelpers.getPosterUrl(movie.poster_path, 'w500') : '/placeholder-movie.png'}
                      alt={movie.title}
                      className="movie-details-poster-image"
                    />
                    <div className="movie-details-poster-overlay"></div>
                    <div className="movie-details-poster-ring"></div>
                  </div>
                </div>
              </div>

              {/* Movie Information - Right Side */}
              <div className="movie-details-info-section">
                
                {/* Title and Tagline */}
                <div className="movie-details-title-box">
                  <h1 className="movie-details-title">
                    {movie.title}
                  </h1>
                  {movie.tagline && (
                    <p className="movie-details-tagline">
                      "{movie.tagline}"
                    </p>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="movie-details-stats-box">
                  <h3 className="movie-details-stats-header">
                    <span className="movie-details-stats-icon">📊</span>
                    Movie Stats
                  </h3>
                  <div className="movie-details-stats-grid">
                    <div className="movie-details-stat-item">
                      <div className="movie-details-stat-icon">📅</div>
                      <div className="movie-details-stat-value">{movie.release_date?.split('-')[0] || 'N/A'}</div>
                      <div className="movie-details-stat-label">Year</div>
                    </div>
                    
                    {movie.runtime && (
                      <div className="movie-details-stat-item">
                        <div className="movie-details-stat-icon">⏱️</div>
                        <div className="movie-details-stat-value">{formatRuntime(movie.runtime)}</div>
                        <div className="movie-details-stat-label">Runtime</div>
                      </div>
                    )}

                    {movie.vote_average > 0 && (
                      <div className="movie-details-stat-item">
                        <div className="movie-details-stat-icon">⭐</div>
                        <div className="movie-details-stat-value">{movie.vote_average.toFixed(1)}</div>
                        <div className="movie-details-stat-label">{movie.vote_count?.toLocaleString()} votes</div>
                      </div>
                    )}

                    {movie.status && (
                      <div className="movie-details-stat-item">
                        <div className="movie-details-stat-icon">📺</div>
                        <div className="movie-details-stat-value movie-details-status-text">{movie.status}</div>
                        <div className="movie-details-stat-label">Status</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Genres */}
                {movie.genres?.length > 0 && (
                  <div className="movie-details-genres-box">
                    <h3 className="movie-details-genres-header">
                      <span className="movie-details-genres-icon">🎭</span>
                      Genres
                    </h3>
                    <div className="movie-details-genres-list">
                      {movie.genres.map((genre) => (
                        <span 
                          key={genre.id} 
                          className="movie-details-genre-tag"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Overview */}
                <div className="movie-details-overview-box">
                  <h3 className="movie-details-overview-header">
                    <span className="movie-details-overview-icon">📖</span>
                    Overview
                  </h3>
                  <p className="movie-details-overview-text">
                    {movie.overview || 'No overview available for this movie.'}
                  </p>
                </div>

                {/* Box Office */}
                {(movie.budget > 0 || movie.revenue > 0) && (
                  <div className="movie-details-boxoffice-box">
                    <h3 className="movie-details-boxoffice-header">
                      <span className="movie-details-boxoffice-icon">💰</span>
                      Box Office
                    </h3>
                    <div className="movie-details-boxoffice-grid">
                      {movie.budget > 0 && (
                        <div className="movie-details-boxoffice-item">
                          <div className="movie-details-boxoffice-content">
                            <div className="movie-details-budget-value">
                              {formatBudget(movie.budget)}
                            </div>
                            <div className="movie-details-boxoffice-label">Budget</div>
                          </div>
                        </div>
                      )}

                      {movie.revenue > 0 && (
                        <div className="movie-details-boxoffice-item">
                          <div className="movie-details-boxoffice-content">
                            <div className="movie-details-revenue-value">
                              {formatBudget(movie.revenue)}
                            </div>
                            <div className="movie-details-boxoffice-label">Revenue</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;