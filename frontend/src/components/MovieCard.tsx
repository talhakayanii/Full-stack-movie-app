import React, { useState, memo } from 'react';
import { Movie } from '../types/movie';
import { imageHelpers } from '../utils/movieApi';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
  className?: string;
}

const MovieCard: React.FC<MovieCardProps> = memo(({ movie, onClick, className = '' }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const formatRating = (rating: number): string => {
    return rating.toFixed(1);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.getFullYear().toString();
  };

  const getRatingColor = (rating: number): string => {
    if (rating >= 7.5) return 'rating-good';
    if (rating >= 6) return 'rating-average';
    return 'rating-poor';
  };

  // Truncate overview for hover display
  const truncateText = (text: string, maxLength: number = 150): string => {
    if (!text) return 'No plot available.';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div
      className={`movie-card ${className}`}
      onClick={() => onClick(movie)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        zIndex: isHovered ? 20 : 1
      }}
    >
      <div className="movie-poster-container" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Image skeleton loader */}
        {!imageLoaded && (
          <div className="skeleton-poster flex items-center justify-center">
            <div className="text-gray-500 text-xs">Loading...</div>
          </div>
        )}
        
        {/* Movie poster */}
        <img
          src={imageError ? '/placeholder-movie.png' : imageHelpers.getPosterUrl(movie.poster_path)}
          alt={movie.title}
          className={`movie-poster ${imageLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'opacity 0.3s ease'
          }}
        />
        
       

        {/* Hover Overlay with Plot */}
        <div 
          className="hover-overlay"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.92)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '12px',
            opacity: isHovered ? 1 : 0,
            visibility: isHovered ? 'visible' : 'hidden',
            transition: 'all 0.3s ease',
            zIndex: 10
          }}
        >
          {/* Plot content */}
          <div style={{ color: 'white' }}>
            <h3 className="hover-title" style={{ 
              fontWeight: 'bold', 
              fontSize: '14px', 
              marginBottom: '8px',
              color: 'white',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {movie.title}
            </h3>
            
            <div className="hover-meta" style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '12px' 
            }}>
              <span className="hover-rating" style={{ 
                color: '#fbbf24', 
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center'
              }}>
                ⭐ {formatRating(movie.vote_average)}
              </span>
              <span className="hover-year" style={{ color: '#d1d5db', fontSize: '12px' }}>
                {movie.release_date ? formatDate(movie.release_date) : 'N/A'}
              </span>
            </div>
            
            <p className="hover-plot" style={{ 
              color: '#e5e7eb', 
              fontSize: '12px', 
              lineHeight: '1.4',
              overflow: 'hidden',
              marginBottom: '12px'
            }}>
              {truncateText(movie.overview)}
            </p>
            
            <div className="hover-cta" style={{ 
              marginTop: '8px', 
              paddingTop: '8px', 
              borderTop: '1px solid #4b5563' 
            }}>
              <p className="hover-cta-text" style={{ 
                color: '#fbbf24', 
                fontSize: '12px', 
                fontWeight: '500' 
              }}>
                Click to view full details
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Movie info - hidden on hover */}
      <div 
        className="movie-info"
        style={{
          transition: 'opacity 0.3s ease',
          opacity: isHovered ? 0 : 1
        }}
      >
        <h3 className="movie-title">
          {movie.title}
        </h3>
        
        <div className="movie-meta">
          <span className="movie-year">
            {movie.release_date ? formatDate(movie.release_date) : 'N/A'}
          </span>
          {movie.vote_average > 0 && (
            <div className={`movie-rating ${getRatingColor(movie.vote_average)}`}>
              <span>⭐</span>
              <span>{formatRating(movie.vote_average)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

MovieCard.displayName = 'MovieCard';

export default MovieCard;