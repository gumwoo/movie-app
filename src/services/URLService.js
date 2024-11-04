// src/services/URLService.js
import axios from 'axios';

class URLService {
  constructor() {
    this.apiKey = process.env.REACT_APP_TMDB_API_KEY; // 환경 변수 사용
    this.baseURL = 'https://api.themoviedb.org/3';
    this.language = 'ko-KR';
    this.headers = {
      'Content-Type': 'application/json',
    };
    this.imageBaseURL = 'https://image.tmdb.org/t/p/';
    this.posterSize = 'w300'; // 필요에 따라 변경 가능
    this.backdropSize = 'w780'; // 필요에 따라 변경 가능
  }

  // 이미지 URL 생성 메서드
  getPosterUrl(path) {
    return path ? `${this.imageBaseURL}${this.posterSize}${path}` : '/placeholder-image.jpg';
  }

  getBackdropUrl(path) {
    return path ? `${this.imageBaseURL}${this.backdropSize}${path}` : '';
  }

  // 에러 핸들링 메서드 추가
  handleError = (error) => {
    if (error.response) {
      // 서버가 응답했으나 상태 코드가 2xx가 아님
      console.error('Error Response:', error.response.data);
      alert(`Error: ${error.response.data.status_message}`);
    } else if (error.request) {
      // 요청이 이루어졌으나 응답을 받지 못함
      console.error('Error Request:', error.request);
      alert('Error: No response received from TMDB API.');
    } else {
      // 요청 설정 중 문제가 발생함
      console.error('Error:', error.message);
      alert(`Error: ${error.message}`);
    }
  };

  // 인기 영화 목록 조회
  fetchPopularMovies = async (page = 1) => {
    try {
      const response = await axios.get(`${this.baseURL}/movie/popular`, {
        params: {
          api_key: this.apiKey,
          language: this.language,
          page,
        },
        headers: this.headers,
      });
      return response.data.results;
    } catch (error) {
      this.handleError(error);
      throw error; // 에러를 상위로 전달
    }
  };

  // 현재 상영 중인 영화 목록 조회
  fetchNowPlayingMovies = async (page = 1) => {
    try {
      const response = await axios.get(`${this.baseURL}/movie/now_playing`, {
        params: {
          api_key: this.apiKey,
          language: this.language,
          page,
        },
        headers: this.headers,
      });
      return response.data.results;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  };

  // 영화 상세 정보 조회
  fetchMovieDetails = async (movieId) => {
    try {
      const response = await axios.get(`${this.baseURL}/movie/${movieId}`, {
        params: {
          api_key: this.apiKey,
          language: this.language,
        },
        headers: this.headers,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  };

  // 영화 검색 기능
  searchMovies = async (query, page = 1) => {
    try {
      const response = await axios.get(`${this.baseURL}/search/movie`, {
        params: {
          api_key: this.apiKey,
          language: this.language,
          query,
          page,
          include_adult: false, // 성인 콘텐츠 제외
        },
        headers: this.headers,
      });
      return response.data.results;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  };

  // 장르별 영화 필터링
  fetchMoviesByGenre = async (genreId, page = 1) => {
    try {
      const response = await axios.get(`${this.baseURL}/discover/movie`, {
        params: {
          api_key: this.apiKey,
          language: this.language,
          with_genres: genreId,
          page,
        },
        headers: this.headers,
      });
      return response.data.results;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  };

  // 장르 목록 조회
  fetchGenres = async () => {
    try {
      const response = await axios.get(`${this.baseURL}/genre/movie/list`, {
        params: {
          api_key: this.apiKey,
          language: this.language,
        },
        headers: this.headers,
      });
      return response.data.genres;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  };
}

export default URLService;
