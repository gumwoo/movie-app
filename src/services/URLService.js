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

  // **여기에 누락된 메서드 추가**
  // 인기 영화 목록 조회 URL 반환 메서드
  getURL4PopularMovies = () => {
    return `${this.baseURL}/movie/popular?api_key=${this.apiKey}&language=${this.language}`;
  };

  // 최신 영화 목록 조회 URL 반환 메서드
  getURL4ReleaseMovies = () => {
    return `${this.baseURL}/movie/now_playing?api_key=${this.apiKey}&language=${this.language}`;
  };

  // 인기 영화 목록 조회 함수 (react-query용)
  fetchPopularMovies = async (page = 1) => {
    const response = await axios.get(`${this.baseURL}/movie/popular`, {
      params: {
        api_key: this.apiKey,
        language: this.language,
        page,
      },
      headers: this.headers,
    });
    return response.data.results;
  };

  // 현재 상영 중인 영화 목록 조회 함수
  fetchNowPlayingMovies = async (page = 1) => {
    const response = await axios.get(`${this.baseURL}/movie/now_playing`, {
      params: {
        api_key: this.apiKey,
        language: this.language,
        page,
      },
      headers: this.headers,
    });
    return response.data.results;
  };

   // 필터 기반 영화 목록 조회 함수
   fetchMoviesByFilters = async ({ page = 1, genreCode, sortingOrder, voteEverage }) => {
    const params = {
      api_key: this.apiKey,
      language: this.language,
      page,
      include_adult: false,
    };

    if (genreCode && genreCode !== '0') {
      params.with_genres = genreCode;
    }

    if (sortingOrder && sortingOrder !== 'all') {
      params.with_original_language = sortingOrder;
    }

    if (voteEverage !== -1 && voteEverage !== -2) {
      params['vote_average.gte'] = voteEverage;
      params['vote_average.lte'] = voteEverage + 1;
    } else if (voteEverage === -2) {
      params['vote_average.lte'] = 4;
    }

    const response = await axios.get(`${this.baseURL}/discover/movie`, {
      params,
      headers: this.headers,
    });
    return response.data;
  };

  // 영화 상세 정보 조회 함수
  fetchMovieDetails = async (movieId) => {
    const response = await axios.get(`${this.baseURL}/movie/${movieId}`, {
      params: {
        api_key: this.apiKey,
        language: this.language,
      },
      headers: this.headers,
    });
    return response.data;
  };

  // 검색 및 장르 필터링 영화 목록 조회 함수
  searchMovies = async (query, page = 1, genre = '0') => {
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

    let results = response.data.results;
    if (genre !== '0') {
      results = results.filter(movie => movie.genre_ids.includes(parseInt(genre)));
    }

    return {
      results,
      total_pages: response.data.total_pages,
      current_page: response.data.page,
    };
  };

  // 장르 목록 조회 함수
  fetchGenres = async () => {
    const response = await axios.get(`${this.baseURL}/genre/movie/list`, {
      params: {
        api_key: this.apiKey,
        language: this.language,
      },
      headers: this.headers,
    });
    return response.data.genres;
  };
  async searchMovies(query, page = 1, genre = '0') {
    const params = {
      api_key: this.apiKey,
      language: this.language,
      query,
      page,
      include_adult: false,
    };

    if (genre !== '0') {
      params.with_genres = genre;
    }

    const response = await axios.get(`${this.baseURL}/search/movie`, {
      params,
      headers: this.headers,
    });
    return response.data;
  }
}

export default URLService;
