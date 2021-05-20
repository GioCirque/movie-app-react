import React, { useState, useContext } from 'react';
import './Search.css';

import { searchMovies } from '../../services/movies.service';
import { MoviesContext } from '../../services/context';

export const Search = () => {
  const [search, setSearch] = useState('');
  const { plexValid, setMovies } = useContext(MoviesContext);

  const handleOnSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setMovies([]);
    searchMovies(search).then(setMovies);
  };

  return (
    <div>
      <form name='form' onSubmit={(e) => handleOnSubmit(e)} noValidate>
        <input
          type='text'
          name='movie'
          className='search__input'
          placeholder='Search movies...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={plexValid !== true}
        />
      </form>
    </div>
  );
};
