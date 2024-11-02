// src/views/Home/HomePopular/HomePopular.js
import React from 'react';
import MovieGrid from '../../../components/MovieGrid/MovieGrid';
import URLService from '../../../services/URLService';

function HomePopular() {
  const urlService = new URLService();
  const fetchUrl = urlService.getURL4PopularMovies();

  return (
    <div>
      <MovieGrid fetchUrl={fetchUrl} />
    </div>
  );
}

export default HomePopular;
