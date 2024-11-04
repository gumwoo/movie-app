// src/components/MovieInfiniteScroll/MovieInfiniteScroll.js
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import useFetch from '../../hooks/useFetch';
import './MovieInfiniteScroll.css';

function MovieInfiniteScroll({ apiKey, genreCode, sortingOrder, voteEverage }) {
  const { data, loading, error } = useFetch(getFetchUrl());
  const [currentPage, setCurrentPage] = useState(1);
  const [rowSize, setRowSize] = useState(4);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [currentView] = useState('grid');
  const [hasMore, setHasMore] = useState(true);
  const [showTopButton, setShowTopButton] = useState(false);

  const gridContainerRef = useRef(null);
  const loadingTriggerRef = useRef(null);

  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.wishlist);

  useEffect(() => {
    setupIntersectionObserver();
    if (data && data.results) {
      filterAndSetMovies(data.results);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (observer.current) {
        observer.current.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const observer = useRef(null);

  function getFetchUrl() {
    return genreCode === '0'
      ? 'https://api.themoviedb.org/3/movie/popular'
      : 'https://api.themoviedb.org/3/discover/movie';
  }

  const setupIntersectionObserver = () => {
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          fetchMoreMovies();
        }
      },
      { rootMargin: '100px', threshold: 0.1 }
    );

    if (loadingTriggerRef.current) {
      observer.current.observe(loadingTriggerRef.current);
    }
  };

  const filterAndSetMovies = (fetchedMovies) => {
    let filteredMovies = fetchedMovies;

    if (sortingOrder !== 'all') {
      filteredMovies = filteredMovies.filter(
        (movie) => movie.original_language === sortingOrder
      );
    }

    if (voteEverage !== -1 && voteEverage !== -2) {
      filteredMovies = filteredMovies.filter((movie) => 
        movie.vote_average >= voteEverage && movie.vote_average < voteEverage + 1
      );
    } else if (voteEverage === -2) {
      filteredMovies = filteredMovies.filter((movie) => movie.vote_average <= 4);
    }

    setMovies((prevMovies) => [...prevMovies, ...filteredMovies]);
    if (filteredMovies.length === 0) {
      setHasMore(false);
    }
  };

  const fetchMoreMovies = () => {
    if (loading || !hasMore) return;
    setCurrentPage((prevPage) => prevPage + 1);
    // `useFetch`는 이미 다음 페이지 데이터를 가져오므로 추가 fetch는 필요 없습니다.
    // 다만, `useFetch`의 구현이 페이지를 인식하도록 설정되어 있어야 합니다.
  };

  const [movies, setMovies] = useState([]);
  const [maxScroll, setMaxScroll] = useState(0);

  const getImageUrl = (path) => {
    return path ? `https://image.tmdb.org/t/p/w300${path}` : '/placeholder-image.jpg';
  };

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
    if (gridContainerRef.current) {
      const containerWidth = gridContainerRef.current.offsetWidth;
      const movieCardWidth = isMobile ? 100 : 300;
      const horizontalGap = isMobile ? 10 : 15;
      const newRowSize = Math.floor(containerWidth / (movieCardWidth + horizontalGap));
      setRowSize(newRowSize);
    }
  };

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    setShowTopButton(scrollTop > 300);
  };

  const scrollToTopAndReset = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    resetMovies();
  };

  const resetMovies = () => {
    setMovies([]);
    setCurrentPage(1);
    setHasMore(true);
    // `useFetch`의 페이지 상태를 초기화하려면 추가적인 설정이 필요할 수 있습니다.
  };

  const toggleWishlistHandler = (movie) => {
    dispatch(toggleWishlist(movie));
  };

  const isInWishlist = (movieId) => {
    return wishlist.some((movie) => movie.id === movieId);
  };

  const visibleMovieGroups = movies.reduce((resultArray, item, index) => {
    const groupIndex = Math.floor(index / rowSize);
    if (!resultArray[groupIndex]) {
      resultArray[groupIndex] = [];
    }
    resultArray[groupIndex].push(item);
    return resultArray;
  }, []);

  if (loading && currentPage === 1) {
    return (
      <div className="movie-grid">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movie-grid">
        <div className="error-message">Failed to load movies.</div>
      </div>
    );
  }

  return (
    <div className="movie-grid" ref={gridContainerRef}>
      <div className={`grid-container ${currentView}`}>
        {visibleMovieGroups.map((movieGroup, i) => (
          <div
            key={i}
            className={`movie-row ${movieGroup.length === rowSize ? 'full' : ''}`}
          >
            {movieGroup.map((movie) => (
              <div
                key={movie.id}
                className="movie-card"
                onClick={() => toggleWishlistHandler(movie)}
              >
                <img src={getImageUrl(movie.poster_path)} alt={movie.title} />
                <div className="movie-title">{movie.title}</div>
                {isInWishlist(movie.id) && (
                  <div className="wishlist-indicator">👍</div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div ref={loadingTriggerRef} className="loading-trigger">
        {loading && hasMore && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <span>Loading...</span>
          </div>
        )}
      </div>
      {showTopButton && (
        <button onClick={scrollToTopAndReset} className="top-button">
          Top
        </button>
      )}
    </div>
  );
}

export default MovieInfiniteScroll;
