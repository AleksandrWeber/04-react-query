import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import ReactPaginateModule from 'react-paginate'
import type { ReactPaginateProps } from 'react-paginate'
import type { ComponentType } from 'react'
import SearchBar from '../SearchBar/SearchBar'
import MovieGrid from '../MovieGrid/MovieGrid'
import Loader from '../Loader/Loader'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import MovieModal from '../MovieModal/MovieModal'
import { fetchMovies } from '../../services/movieService'
import type { Movie } from '../../types/movie'
import styles from './App.module.css'

type ModuleWithDefault<T> = { default: T }

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<ComponentType<ReactPaginateProps>>
).default

const App = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)

  const {
    data,
    isLoading,
    isError,
  } = useQuery(
    ['movies', searchQuery, page],
    () => fetchMovies(searchQuery, page),
    {
      enabled: searchQuery.trim().length > 0,
      keepPreviousData: true,
      staleTime: 1000 * 60 * 5,
    },
  )

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setPage(1)
    setSelectedMovie(null)
  }

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie)
  }

  const handleCloseModal = () => {
    setSelectedMovie(null)
  }

  const movies = data?.results ?? []
  const totalPages = data?.total_pages ?? 0
  const shouldShowPagination = totalPages > 1

  return (
    <div className={styles.app}>
      <div className={styles.main}>
        <h1 className={styles.heading}>Movie Search</h1>
        <SearchBar onSubmit={handleSearch} />

        {isLoading && <Loader />}
        {isError && <ErrorMessage />}
        {!isLoading && !isError && searchQuery && movies.length === 0 && (
          <p className={styles.empty}>No movies found for your request.</p>
        )}

        {!isLoading && !isError && movies.length > 0 && (
          <>
            <MovieGrid movies={movies} onSelect={handleSelectMovie} />

            {shouldShowPagination && (
              <ReactPaginate
                pageCount={totalPages}
                pageRangeDisplayed={5}
                marginPagesDisplayed={1}
                onPageChange={({ selected }) => setPage(selected + 1)}
                forcePage={page - 1}
                containerClassName={styles.pagination}
                activeClassName={styles.active}
                nextLabel="→"
                previousLabel="←"
              />
            )}
          </>
        )}

        {selectedMovie && (
          <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
        )}
      </div>
    </div>
  )
}

export default App
