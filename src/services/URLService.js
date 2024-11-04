// src/services/URLService.js
import axios from 'axios';

class URLService {
  constructor() {
    this.apiKey = process.env.REACT_APP_TMDB_API_KEY; // 환경 변수 사용
  }

  fetchFeaturedMovie = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=${this.apiKey}&language=ko-KR`
      );
      console.log(response.data.results[0]);
      return response.data.results[0];
    } catch (error) {
      console.error('Error fetching featured movie:', error);
    }
  };

  getURL4PopularMovies = (page = 1) => {
    return `https://api.themoviedb.org/3/movie/popular?api_key=${this.apiKey}&language=ko-KR&page=${page}`;
  };

  getURL4ReleaseMovies = (page = 2) => {
    return `https://api.themoviedb.org/3/movie/now_playing?api_key=${this.apiKey}&language=ko-KR&page=${page}`;
  };

  getURL4GenreMovies = (genre, page = 1) => {
    return `https://api.themoviedb.org/3/discover/movie?api_key=${this.apiKey}&with_genres=${genre}&language=ko-KR&page=${page}`;
  };
}

export default URLService;
