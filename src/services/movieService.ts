import axios from 'axios'
import type { Movie } from '../types/movie'

interface SearchMovieResponse {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

export const fetchMovies = async (query: string, page: number): Promise<SearchMovieResponse> => {
  const token = import.meta.env.VITE_TMDB_TOKEN

  if (!token) {
    throw new Error('TMDB token is not configured.')
  }

  const response = await axios.get<SearchMovieResponse>('https://api.themoviedb.org/3/search/movie', {
    params: {
      query,
      include_adult: false,
      language: 'en-US',
      page,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}
