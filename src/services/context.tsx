import React from 'react';
import { Movie } from '../models';

export const MoviesContext = React.createContext<{
  movies: Movie[];
  error?: string;
  plexValid: boolean;
  plexMachineId?: string;
  setMovies: (movies: Movie[]) => void;
  setError: (error: string) => void;
  setPlexValid: (valid: boolean) => void;
}>({
  movies: [],
  error: undefined,
  plexValid: false,
  plexMachineId: undefined,
  setMovies: (movies) => {},
  setError: (error) => {},
  setPlexValid: (valid) => {},
});
