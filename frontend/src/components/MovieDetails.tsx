import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MovieDetails as MovieDetailsType, Movie } from '../types/movie';
import { movieAPI } from '../utils/movieApi';
import { imageHelpers } from '../utils/movieApi';
import LoadingSpinner from './LoadingSpinner';

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovieData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        
        const movieData = await movieAPI.getMovieDetails(Number(id));
        setMovie(movieData);
        
        // Fetch recommendations
        try {
          const recs = await movieAPI.getRecommendations(Number(id));
          setRecommendations(recs.results?.slice(0, 9) || []);
        } catch (recError) {
          console.warn('Failed to load recommendations:', recError);
        }
        
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

  const getRatingColor = (rating: number): string => {
    if (rating >= 8) return '#10b981'; // emerald
    if (rating >= 7) return '#f59e0b'; // amber
    if (rating >= 6) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  const getRatingBadgeStyle = (rating: number) => {
    if (rating >= 8) return 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300';
    if (rating >= 7) return 'bg-amber-500/20 border-amber-500/50 text-amber-300';
    if (rating >= 6) return 'bg-orange-500/20 border-orange-500/50 text-orange-300';
    return 'bg-red-500/20 border-red-500/50 text-red-300';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <div className="text-red-400 text-6xl mb-6">🎬</div>
          <h2 className="text-3xl font-bold mb-4">Movie Not Found</h2>
          <p className="text-gray-400 mb-8">{error || 'The requested movie could not be loaded.'}</p>
          <button 
            onClick={() => navigate('/movies')}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-8 py-3 rounded-full transition-all duration-300 font-semibold shadow-lg hover:shadow-red-500/25"
          >
            Back to Movies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Diagonal light streaks */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 -left-20 w-1 h-64 bg-gradient-to-b from-red-400/20 via-red-400/10 to-transparent rotate-12 blur-sm"></div>
          <div className="absolute top-32 right-40 w-1 h-48 bg-gradient-to-b from-blue-400/20 via-blue-400/10 to-transparent -rotate-12 blur-sm"></div>
          <div className="absolute bottom-40 left-60 w-1 h-56 bg-gradient-to-b from-purple-400/20 via-purple-400/10 to-transparent rotate-45 blur-sm"></div>
        </div>
      </div>
      
      {/* Content overlay */}
      <div className="relative z-10">
      {/* Header with Back Button */}
      <div className="container mx-auto px-6 lg:px-12 pt-8">
        <button 
          onClick={() => navigate('/movies')}
          className="flex items-center space-x-3 bg-black/40 hover:bg-black/60 backdrop-blur-md px-6 py-3 rounded-full transition-all duration-300 border border-white/10 hover:border-white/20 group mb-8 shadow-lg hover:shadow-purple-500/20"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium text-gray-200">Back to Movies</span>
        </button>
      </div>

      {/* Main Movie Details */}
      <div className="container mx-auto px-6 lg:px-12 pb-12">
        <div className="bg-black/20 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl hover:shadow-purple-500/10 transition-all duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 lg:p-12">
            
            {/* Movie Poster */}
            <div className="lg:col-span-4">
              <div className="relative group">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
                  <img
                    src={movie.poster_path ? imageHelpers.getPosterUrl(movie.poster_path, 'w500') : '/placeholder-movie.png'}
                    alt={movie.title}
                    className="w-full max-w-md mx-auto lg:max-w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 ring-2 ring-purple-500/0 group-hover:ring-purple-500/30 transition-all duration-500 rounded-2xl" />
                </div>
              </div>
            </div>

            {/* Movie Information Boxes */}
            <div className="lg:col-span-8 space-y-6">
              {/* Title and Tagline Box */}
              <div className="bg-gradient-to-r from-black/40 to-purple-900/20 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                <h1 className="text-3xl lg:text-4xl font-bold mb-3 text-white leading-tight bg-gradient-to-r from-white to-purple-200 bg-clip-text">
                  {movie.title}
                </h1>
                {movie.tagline && (
                  <p className="text-lg text-purple-200 italic opacity-90">
                    "{movie.tagline}"
                  </p>
                )}
              </div>

              {/* Quick Stats Box */}
              <div className="bg-gradient-to-r from-black/40 to-blue-900/20 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                <h3 className="text-lg font-bold mb-4 text-blue-400 flex items-center">
                  <span className="mr-2">📊</span>
                  Movie Stats
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl mb-1">📅</div>
                    <div className="text-white font-semibold">{movie.release_date?.split('-')[0] || 'N/A'}</div>
                    <div className="text-xs text-gray-400">Year</div>
                  </div>
                  
                  {movie.runtime && (
                    <div className="text-center">
                      <div className="text-2xl mb-1">⏱️</div>
                      <div className="text-white font-semibold">{formatRuntime(movie.runtime)}</div>
                      <div className="text-xs text-gray-400">Runtime</div>
                    </div>
                  )}

                  {movie.vote_average > 0 && (
                    <div className="text-center">
                      <div className="text-2xl mb-1">⭐</div>
                      <div className="text-white font-semibold">{movie.vote_average.toFixed(1)}</div>
                      <div className="text-xs text-gray-400">{movie.vote_count?.toLocaleString()} votes</div>
                    </div>
                  )}

                  {movie.status && (
                    <div className="text-center">
                      <div className="text-2xl mb-1">📺</div>
                      <div className="text-green-300 font-semibold text-sm">{movie.status}</div>
                      <div className="text-xs text-gray-400">Status</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Genres Box */}
              {movie.genres?.length > 0 && (
                <div className="bg-gradient-to-r from-black/40 to-red-900/20 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                  <h3 className="text-lg font-bold mb-4 text-red-400 flex items-center">
                    <span className="mr-2">🎭</span>
                    Genres
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre, index) => (
                      <span 
                        key={genre.id} 
                        className="px-3 py-1 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/30 rounded-full text-red-300 font-medium hover:from-red-500/30 hover:to-pink-500/30 hover:scale-105 transition-all duration-300 cursor-default text-sm"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Overview Box */}
              <div className="bg-gradient-to-r from-black/40 to-green-900/20 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                <h3 className="text-lg font-bold mb-4 text-green-400 flex items-center">
                  <span className="mr-2">📖</span>
                  Overview
                </h3>
                <p className="text-gray-200 leading-relaxed">
                  {movie.overview || 'No overview available for this movie.'}
                </p>
              </div>

              {/* Box Office Information Box */}
              {(movie.budget > 0 || movie.revenue > 0) && (
                <div className="bg-gradient-to-r from-black/40 to-yellow-900/20 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                  <h3 className="text-lg font-bold mb-4 text-yellow-400 flex items-center">
                    <span className="mr-2">💰</span>
                    Box Office
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {movie.budget > 0 && (
                      <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <div className="text-center">
                          <div className="text-green-400 font-bold text-xl mb-1">
                            {formatBudget(movie.budget)}
                          </div>
                          <div className="text-xs text-gray-400 uppercase tracking-wide">Budget</div>
                        </div>
                      </div>
                    )}

                    {movie.revenue > 0 && (
                      <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <div className="text-center">
                          <div className="text-blue-400 font-bold text-xl mb-1">
                            {formatBudget(movie.revenue)}
                          </div>
                          <div className="text-xs text-gray-400 uppercase tracking-wide">Revenue</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl lg:text-3xl font-bold mb-8 text-red-400 flex items-center">
              <span className="mr-3">🎬</span>
              More Like This
            </h2>
            <div className="bg-black/15 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-xl hover:shadow-purple-500/10 transition-all duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((rec, index) => (
                  <div 
                    key={rec.id}
                    onClick={() => navigate(`/movies/${rec.id}`)}
                    className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="relative overflow-hidden rounded-xl bg-black/30 border border-white/10 hover:border-red-400/30 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300">
                      <div className="flex">
                        {/* Small Poster */}
                        <div className="w-24 h-36 flex-shrink-0">
                          <img
                            src={rec.poster_path ? imageHelpers.getPosterUrl(rec.poster_path) : '/placeholder-movie.png'}
                            alt={rec.title}
                            className="w-full h-full object-cover group-hover:brightness-75 transition-all duration-300"
                          />
                        </div>
                        
                        {/* Movie Info */}
                        <div className="flex-1 p-4 flex flex-col justify-between">
                          <div>
                            <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 group-hover:text-red-300 transition-colors duration-300">
                              {rec.title}
                            </h3>
                            <p className="text-gray-400 text-xs mb-3 line-clamp-2">
                              {rec.overview?.substring(0, 100)}...
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            {rec.vote_average > 0 && (
                              <div className="flex items-center space-x-1">
                                <span className="text-yellow-400 text-xs">⭐</span>
                                <span className="text-yellow-400 text-xs font-medium">
                                  {rec.vote_average.toFixed(1)}
                                </span>
                              </div>
                            )}
                            <span className="text-gray-500 text-xs">
                              {rec.release_date?.split('-')[0]}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Hover indicator */}
                      <div className="absolute inset-0 ring-1 ring-red-500/0 group-hover:ring-red-500/50 transition-all duration-300 rounded-xl pointer-events-none" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      </div> {/* Close content overlay */}
    </div>
  );
};

export default MovieDetails;