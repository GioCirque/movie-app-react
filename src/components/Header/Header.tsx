import React, { useContext } from 'react';
import { MoviesContext } from '../../services/context';
import { Search } from '../Search/Search';
import './Header.css';

export const Header = () => {
  const { plexValid, error } = useContext(MoviesContext);

  return (
    <div className='header'>
      <h1 className='header__title'>
        <a href='/'>Movie App</a>
      </h1>
      {plexValid === false ? <div className='header__plex__error'>{error}</div> : ''}
      <div className='header__search'>
        <Search></Search>
      </div>
    </div>
  );
};
