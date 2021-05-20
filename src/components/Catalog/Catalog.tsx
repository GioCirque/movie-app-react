import React, { useContext } from 'react';
import './Catalog.css';
import imgPlaceholder from './movie_placeholder.png';
import { MoviesContext } from '../../services/context';
import { Movie, Torrent } from '../../models/yify';
import { downloadMovieTorrent } from '../../services/movies.service';

export const Catalog = () => {
  const { movies, plexMachineId, setMovies } = useContext(MoviesContext);
  let activeMovieId: number | undefined = undefined;

  async function showItemInfo(movie: Movie) {
    if (!!activeMovieId && activeMovieId !== movie.id) {
      document.getElementById(`movie_${activeMovieId}`)?.classList.remove('catalog__item__active');
    }
    activeMovieId = movie.id;

    const target = document.getElementById(`movie_${activeMovieId}`);
    target?.classList.contains('catalog__item__active')
      ? target?.classList.remove('catalog__item__active')
      : target?.classList.add('catalog__item__active');
  }

  async function downloadMovie(movie: Movie, torrent: Torrent) {
    const success = await downloadMovieTorrent(torrent.url, torrent.hash);
    if (!!success) {
      movie.btc = success;
      movies[movies.findIndex((m) => m.id === movie.id)] = movie;
      setMovies(movies);
    } else {
      console.error(`There was a problem downloading`, success);
    }
  }

  return (
    <div className='catalogContainer'>
      {movies.map((movie) => (
        <div id={`movie_${movie.id}`} className='catalog__item' key={movie.id}>
          <div className='catalog__item__header'>
            <div className='catalog__item__header__name'>{movie.title}</div>
            <button
              className='catalog__item__button catalog__item__button__header'
              onClick={async (e) => await showItemInfo(movie)}>
              i
            </button>
          </div>
          <div className='catalog__item__img'>
            <img src={movie.cover || imgPlaceholder} alt={movie.title} />
            <div className='catalog__item__info'>
              <div className='catalog__item__options'>
                {movie.downloaded === false ? (
                  !!movie.btc ? (
                    <div className='catalog__item__meta catalog__item__meta__downloaded'>Downloading...</div>
                  ) : (
                    <button
                      key={movie.torrent.hash}
                      className='catalog__item__button'
                      onClick={(e) => downloadMovie(movie, movie.torrent)}>
                      Download in {movie.torrent.quality}
                    </button>
                  )
                ) : (
                  <div className='catalog__item__meta catalog__item__meta__downloaded'>
                    <a
                      target='_blank'
                      rel='noreferrer'
                      className='catalog__item__meta__watch'
                      href={`https://app.plex.tv/desktop/#!/server/${plexMachineId}/details?key=${movie?.plex?.key}`}>
                      On{' '}
                      <img
                        alt='Plex Logo'
                        src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzA4NiIgaGVpZ2h0PSIxMDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxyYWRpYWxHcmFkaWVudCBjeD0iODkuMjY3JSIgY3k9IjQ5Ljc2JSIgZng9Ijg5LjI2NyUiIGZ5PSI0OS43NiUiIHI9IjkyLjUlIiBpZD0iYSI+PHN0b3Agc3RvcC1jb2xvcj0iI0Y5QkUwMyIgb2Zmc2V0PSIwJSIvPjxzdG9wIHN0b3AtY29sb3I9IiNDQzdDMTkiIG9mZnNldD0iMTAwJSIvPjwvcmFkaWFsR3JhZGllbnQ+PC9kZWZzPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PHBhdGggZD0iTTMwODUuOTkgMGgtMjkwbC0yOTAgNTAwIDI5MCA1MDBoMjg5Ljc0N0wyNzk1Ljk5IDUwMC4yNSAzMDg1Ljk5IDAiIGZpbGw9IiNGRkYiLz48cGF0aCBkPSJNMjE4NiAwaDI5MGwzMjAgNTAwLjI1LTMyMCA1MDAuMjVoLTI5MGwzMjAtNTAwLjI1TDIxODYgMCIgZmlsbD0idXJsKCNhKSIvPjxwYXRoIGQ9Ik0yMDg1Ljk0NyAxMDAwaC01NzcuMDczVjBoNTc3LjA3M3YxNzMuNzM3SDE3MjEuMzRWMzkzLjNoMzM5LjI1NHYxNzMuNzNIMTcyMS4zNHYyNTcuODY1aDM2NC42MDdWMTAwMG0tMTI5NC42NzEgMFYwaDIxMi4wNHY4MjQuODk1aDQwNS42MVYxMDAwaC02MTcuNjUiIGZpbGw9IiNGRkYiLz48ZyBmaWxsPSIjRkZGIj48cGF0aCBkPSJNNTg5Ljk0NyA1NTguODI0Yy02Ny4yNjggNTcuMDA3LTE2Mi45MSA4NS41LTI4Ni45MzggODUuNWgtOTAuOTdWMTAwMEgwVjQ3MC4zMzhsMjkwIC4zNmMxNzcuNTYzLTIuMDcgMTg2Ljg0Mi0xMTAuODIgMTg2Ljg0Mi0xNDguNDk4IDAtMzQuOTggMC0xNDYuNzU1LTE1Ny44NDItMTQ4LjVsLTMxOSAuMDAzVjBoMzE5LjQyNEM0NDAuNzE3IDAgNTMyLjk0IDI2LjEwNyA1OTYuMSA3OC4zMmM2My4xNTMgNTIuMjE0IDk0LjczNCAxMzAuMDcyIDk0LjczNCAyMzMuNTgyIDAgMTA3LjYyNS0zMy42MzIgMTg5LjkyOC0xMDAuODg3IDI0Ni45MjJ6Ii8+PHBhdGggZD0iTTAgMTEwaDIxMi4ydjQyOUgweiIvPjwvZz48L2c+PC9zdmc+'
                      />
                    </a>
                  </div>
                )}
              </div>
              <div className='catalog__item__summary'>
                <p>
                  <span dangerouslySetInnerHTML={{ __html: movie.title.replace(':', ':<br />') }}></span>
                  {movie.summary}
                </p>
              </div>
            </div>
          </div>
          <div className='catalog__item__footer'>
            <div className='catalog__item__meta'>{movie.year}</div>
            <div className='catalog__item__meta'>{movie.mpa_rating || 'NR'}</div>
            <div className='catalog__item__meta catalog__item__meta__rating'>{movie.rating}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
