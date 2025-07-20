// utils/movieApi.ts
import { Movie, MovieDetails, MovieResponse, MovieApiParams } from '../types/movie';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY || 'a1a82166881608ff0ac7e1769b0f39f5';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Image helper functions
export const imageHelpers = {
  getPosterUrl: (path: string | null, size: string = 'w500'): string => {
    if (!path) return '/placeholder-movie.png';
    return `${IMAGE_BASE_URL}/${size}${path}`;
  },
  
  getBackdropUrl: (path: string | null, size: string = 'w1280'): string => {
    if (!path) return '/placeholder-backdrop.png';
    return `${IMAGE_BASE_URL}/${size}${path}`;
  }
};

// API helper function
const apiCall = async <T>(endpoint: string, params: Record<string, any> = {}): Promise<T> => {
  const url = new URL(`${BASE_URL}${endpoint}`);
  
  // Add API key
  url.searchParams.append('api_key', API_KEY);
  
  // other parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  try {
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Movie API functions
export const movieAPI = {
  // To get popular movies
  getPopular: async (page: number = 1): Promise<MovieResponse> => {
    return apiCall<MovieResponse>('/movie/popular', { page });
  },

  // To get top rated movies
  getTopRated: async (page: number = 1): Promise<MovieResponse> => {
    return apiCall<MovieResponse>('/movie/top_rated', { page });
  },

  // To get latest movies
  getLatest: async (page: number = 1): Promise<MovieResponse> => {
    return apiCall<MovieResponse>('/movie/now_playing', { page });
  },

  // Discovering movies with filters
  discover: async (params: MovieApiParams = {}): Promise<MovieResponse> => {
    const { page = 1, sort_by = 'popularity.desc', year, with_genres } = params;
    
    const apiParams: Record<string, any> = {
      page,
      sort_by
    };
    
    if (year) apiParams.year = year;
    if (with_genres) apiParams.with_genres = with_genres;
    
    return apiCall<MovieResponse>('/discover/movie', apiParams);
  },

  // Searching movies
  search: async (query: string, page: number = 1): Promise<MovieResponse> => {
    if (!query.trim()) {
      return movieAPI.getPopular(page);
    }
    return apiCall<MovieResponse>('/search/movie', { query, page });
  },

  // Getting movie details
  getMovieDetails: async (movieId: number): Promise<MovieDetails> => {
    return apiCall<MovieDetails>(`/movie/${movieId}`);
  },

  // Getting movie recommendations
  getRecommendations: async (movieId: number, page: number = 1): Promise<MovieResponse> => {
    return apiCall<MovieResponse>(`/movie/${movieId}/recommendations`, { page });
  },

  // Getting similar movies
  getSimilar: async (movieId: number, page: number = 1): Promise<MovieResponse> => {
    return apiCall<MovieResponse>(`/movie/${movieId}/similar`, { page });
  }
};

export default movieAPI;