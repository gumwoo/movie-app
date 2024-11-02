// src/views/Home/HomeMain/HomeMain.js
import React, { useState, useEffect } from 'react';
import Banner from '../../../components/Banner/Banner';
import MovieRow from '../../../components/MovieRow/MovieRow';
import URLService from '../../../services/URLService';

function HomeMain() {
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const apiKey = localStorage.getItem('TMDb-Key') || '';

  useEffect(() => {
    const urlService = new URLService();
    urlService.fetchFeaturedMovie(apiKey).then((movie) => {
      setFeaturedMovie(movie);
    });
  }, [apiKey]);

  return (
    <div>
      <Banner movie={featuredMovie} />
      <MovieRow title="대세 콘텐츠" fetchUrl={new URLService().getURL4PopularMovies()} />
      <MovieRow title="최신 콘텐츠" fetchUrl={new URLService().getURL4ReleaseMovies()} />
      {/* 필요한 만큼 MovieRow 추가 */}
    </div>
  );
}

export default HomeMain;
