import React, { useEffect, useState } from 'react';
import './App.css';
import { Header } from './components/Header/Header';
import { Catalog } from './components/Catalog/Catalog';
import { discoverMovies, getPlexMachineId, validatePlex } from './services/movies.service';
import { MoviesContext } from './services/context';
import { Movie } from './models';

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string>('');
  const [plexValid, setPlexValid] = useState<boolean>(false);
  const [plexMachineId, setPlexMachineId] = useState<string>('');

  useEffect(() => {
    validatePlex()
      .then(setPlexValid)
      .then(() => getPlexMachineId())
      .then(setPlexMachineId)
      .then(() => {
        discoverMovies()
          .then(setMovies)
          .catch((err) => {
            setMovies([]);
            setError(err.message || err.toString());
          });
      })
      .catch((err) => {
        setPlexValid(false);
        setError(err.message || err.toString());
      });
  }, []);

  return (
    <MoviesContext.Provider value={{ movies, error, plexValid, plexMachineId, setMovies, setError, setPlexValid }}>
      <div className='App'>
        <Header></Header>
        <Catalog></Catalog>
      </div>
    </MoviesContext.Provider>
  );
}

export default App;
