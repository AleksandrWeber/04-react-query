import { useEffect, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import type { Movie } from '../../types/movie'
import styles from './MovieModal.module.css'

interface MovieModalProps {
  movie: Movie
  onClose: () => void
}

const MovieModal = ({ movie, onClose }: MovieModalProps) => {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  const modalRoot = document.getElementById('modal-root') ?? document.body

  return createPortal(
    <div
      className={styles.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={(event: MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div className={styles.modal}>
        <button
          className={styles.closeButton}
          type="button"
          aria-label="Close modal"
          onClick={onClose}
        >
          &times;
        </button>

        <img
          className={styles.image}
          src={
            movie.backdrop_path
              ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
              : movie.poster_path
              ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
              : 'https://via.placeholder.com/1200x675?text=No+image'
          }
          alt={movie.title}
        />

        <div className={styles.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
          <p>
            <strong>Release Date:</strong> {movie.release_date || 'Unknown'}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average.toFixed(1)}/10
          </p>
        </div>
      </div>
    </div>,
    modalRoot,
  )
}

export default MovieModal
